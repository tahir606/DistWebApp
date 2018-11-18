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
    // console.log(req.query.items_list);
    checkDuplicateItems(function (data) {
        // res.send({
        //     reps: items
        // });
        res.end();
    });

});

router.post('/submitDistributor', function (req, res) {
    // console.log(req.query.distName);
    console.log(req.query.itemList);
    // insertNewDistributorInDb(req.query.distName);
    insertNewItemsInDb(req.query.itemList);
    res.end();
});

var checkDuplicateItems = function () {
    // con.connect(function (err) {
    //     if (err) throw err;
    //     con.query("SELECT ", function (err, rows, fields) {
    //         if (err) throw err;
    //         // console.log("Rows: " + rows[5].CL_NAME);
    //         callable();
    //     });
    //     con.end();
    // });
};

var insertNewDistributorInDb = function (dist) {
    con.connect(function (err) {
        if (err) throw err;

        con.query("INSERT INTO DISTRIBUTOR_LIST(DNO, DNAME) " +
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
    });
};

var insertNewItemsInDb = function (items) {
    con.connect(function (err) {
        if (err) {
            console.log("Error in connection");
            console.log(err);
            return;
        }

        console.log(items[0]);

        // con.query("INSERT INTO ITEM_LIST (INO, INAME, ITRADEP, DESC) " +
        //     " SELECT IFNULL(max(INO),0)+1,?,?,? FROM ITEM_LIST",
        //     [items[0].name, items[0].pack, items[0].rate],
        //     // [items],
        //     function (err, rows, fields) {
        //         if (err) {
        //             console.log("Error in query");
        //             console.log(err);
        //             return;
        //         }
        //         console.log("Successfully Added")
        //     });
        // con.end();
    });
};

module.exports = router;
