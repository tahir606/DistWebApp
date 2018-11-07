var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
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
    console.log(req.query.items_list);
    res.end();
});

router.post('/submitDistributor', function (req, res) {
    console.log(req.query.dist_name);
    console.log(req.query.items_list);
    res.end();
});

var checkDuplicateItems = function () {
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT ", function (err, rows, fields) {
            if (err) throw err;
            console.log("Rows: " + rows[5].CL_NAME);
        });
        con.end();
    });
};

var insertNewDistributorInDb = function (dist) {
    con.connect(function (err) {
        if (err) throw err;

        con.query("INSERT INTO DISTRIBUTOR_LIST(DNO, DNAME) " +
            "SELECT IFNULL(max(),0)+1,? FROM DISTRIBUTOR_LIST",
            {

            },
            function (err) {
                if (err) throw err;

            });
        con.end();
    });
};

var insertNewItemsInDb = function () {
    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO ITEM_LIST VALUE ", function (err, rows, fields) {
            if (err) throw err;
            console.log("Rows: " + rows[5].CL_NAME);
        });
        con.end();
    });
};

module.exports = router;
