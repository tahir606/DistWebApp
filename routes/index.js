var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var pool = mysql.createPool({
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
    // console.log(req.query.distName);
    // console.log(req.query.itemList);

    insertNewDistributorInDb(req.query.distName);
    var items = JSON.parse(req.query.itemList);
    insertNewItemsInDb(items);

    res.end();
});

var checkDuplicateItems = function (items, callable) {
    var query = "SELECT INO, INAME, ITRADEP, DESCRIPTION AS pack FROM ITEM_LIST WHERE 1 ";

    items.forEach(function (t) {
        query = query + " OR INAME LIKE \"" + t.name + "\" ";
    });

    console.log(query);

    pool.query(query, function (err, rows) {
        if (err) throw err;
        callable(rows);
    });
};

var insertNewDistributorInDb = function (dist) {

        pool.query("INSERT INTO DISTRIBUTOR_LIST(DNO, DNAME) " +
            "SELECT IFNULL(max(DNO),0)+1,? FROM DISTRIBUTOR_LIST",
            [dist],
            function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

            });
        console.log("Ending connection")
        // con.end();
};

var insertNewItemsInDb = function (items) {
        console.log(items[0]);

    items.forEach(function (t) {
        pool.query("INSERT INTO ITEM_LIST (INO, INAME, ITRADEP, DESCRIPTION) " +
            " SELECT IFNULL(max(INO),0)+1,?,?,? FROM ITEM_LIST",
            [t.name, t.rate, t.pack],
            function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Successfully Added")
            });
    });
};

module.exports = router;
