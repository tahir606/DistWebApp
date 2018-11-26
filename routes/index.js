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
        var toINO = getMaxItemNo();
        for (fromINO; fromINO >= toINO; i++) {

        }
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

var insertNewItemsInDb = function (items) {

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
var createItemDistLink = function () {
    con.query("INSERT INTO item_distributor_link (INO, DNO) " +
        "SELECT MAX(INO), MAX(DNO) FROM item_list, distributor_list",
        function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Created Link");
        });
};

var getMaxItemNo = function (callback) {
    con.query("SELECT MAX(INO) AS INO FROM ITEM_LIST",
        function (err, success) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("MAX INO: " + success.data.INO);
            callback(success.data.INO);
        });
};

var getMaxDistNo = function () {
    con.query("SELECT MAX(DNO) AS INO FROM DISTRIBUTOR_LIST",
        function (err, success) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("MAX DNO: " + success.data.DNO);
            return success.data.DNO;
        });
};

module.exports = router;
