var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "crm",
    password: "crm123!@#",
    database: "bits_crm"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM CLIENT_STORE", function (err, rows, fields) {
        if (err) throw err;
        console.log("Rows: " + rows[5].CL_NAME);
    });
    con.end();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Distribution Network'});
});

module.exports = router;
