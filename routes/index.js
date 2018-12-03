var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
    connectionLimit: 10,
    host: "localhost",
    user: "crm",
    password: "crm123!@#",
    database: "dist_network"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Distribution Network'});
});

router.get('/checkItems', function (req, res) {
    checkDuplicateItems(JSON.parse(req.query.items_list), function (rows) {
        res.send({
            items: rows
        });
    });
});

router.post('/submitDistributor', function (req, res) {
    //Everything must be executed through callable so that the values of insertion do not come up undefined
    var maxDNO,     //The distributor number that was last added
        fromINO;    //The last item number that was added before we start creating the link
    insertNewDistributorInDb(req.query.distName, function () {      //Insert new Distributor
        getMaxDistNo(function (DNO) {       //Get the code for the distributor we just inserted
            //New Items -------
            maxDNO = DNO;
            getMaxItemNo(function (INO) {   //Get the item that was last added
                fromINO = INO;
                fromINO++;          //Because the last item created is already linked to previous distributor(s)
                var items = JSON.parse(req.query.itemList);
                insertNewItemsInDb(items, function () {     //Insert the new Items into the database
                    getMaxItemNo(function (toINO) {         //Get the item number after all the new items have been added
                        for (fromINO; fromINO <= toINO; fromINO++) {    //Create a dist_item link from fromINO to toINO
                            createItemDistLink(fromINO, maxDNO);
                        }
                    });
                });
                res.end();
            });
            //Existing items -------
            var existItems = JSON.parse(req.query.existItemList);
            if (existItems.length > 0) {
                existItems.forEach(function (it) {
                    console.log("Adding existing item: " + it.INO);
                    createItemDistLink(it.INO, maxDNO);
                });
            }
        });
    });
});

var checkDuplicateItems = function (items, callable) {
    var query = "SELECT INO, INAME, ITRADEP, DESCRIPTION FROM ITEM_LIST WHERE 1 ";

    items.forEach(function (t) {
        query = query + " OR INAME LIKE \"" + t.name + "\" ";
    });

    console.log(query);

    con.query(query, function (err, rows) {
        if (err) {
            console.log(err);
            return;
        }
        callable(rows);
    });
};

var insertNewDistributorInDb = function (dist, callback) {

    con.query("INSERT INTO DISTRIBUTOR_LIST(DNO, DNAME) " +
        "SELECT IFNULL(max(DNO),0)+1,? FROM DISTRIBUTOR_LIST",
        [dist],
        function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                callback();
            }
        });
};

var insertNewItemsInDb = function (items, callback) {

    items.forEach(function (t) {
        con.query("INSERT INTO ITEM_LIST (INO, INAME, ITRADEP, DESCRIPTION) " +
            " SELECT IFNULL(max(INO),0)+1,?,?,? FROM ITEM_LIST",
            [t.name, t.rate, t.pack],
            function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
    });

    callback();
};

//This will create a link between the last item added to the database
var createItemDistLink = function (ino, dno) {
    con.query("INSERT INTO item_distributor_link (INO, DNO) " +
        " VALUES (?,?)",
        [ino, dno],
        function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
};

var getMaxItemNo = function (callback) {
    con.query("SELECT IFNULL(MAX(INO),0) AS INO FROM ITEM_LIST",
        function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            callback(rows[0].INO);
        });
};

var getMaxDistNo = function (callable) {
    con.query("SELECT IFNULL(MAX(DNO),0) AS DNO FROM DISTRIBUTOR_LIST",
        function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            callable(rows[0].DNO);
        });
};

module.exports = router;
