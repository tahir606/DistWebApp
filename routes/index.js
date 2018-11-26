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
    var maxDNO, fromINO;
    insertNewDistributorInDb(req.query.distName, function () {
        getMaxDistNo(function (DNO) {
            maxDNO = DNO;
            getMaxItemNo(function (INO) {
                fromINO = INO;
            });
        });
    });
    var items = JSON.parse(req.query.itemList);
    insertNewItemsInDb(items, function () {
        getMaxItemNo(function (toINO) {
            for (fromINO; fromINO >= toINO; fromINO++) {
                createItemDistLink(maxDNO, fromINO);
            }
        });
    });
    res.end();
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
            console.log("Created Link");
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
