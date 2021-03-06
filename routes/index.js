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

router.post('/submitDistributor', function (req, res) {
    //Everything must be executed through callable so that the values of insertion do not come up undefined
    var maxDNO;     //The distributor number that was last added
    insertNewDistributorInDb(req.query, function () {      //Insert new Distributor
        getMaxDistNo(function (DNO) {       //Get the code for the distributor we just inserted
            maxDNO = DNO;
            //Inserting Companies
            var companies = JSON.parse(req.query.companies);
            insertNewCompaniesInDb(companies, maxDNO, function () {
                // Inserting Items -------
                var items = JSON.parse(req.query.itemList);
                insertNewItemsInDb(items, maxDNO);
                res.end();
            });
        });
    });
});

var insertNewDistributorInDb = function (dist, callback) {
    con.query("INSERT INTO DISTRIBUTOR_LIST(DNO, DNAME, DEMAIL, DPHONE, DWEBSITE, DADDR, DPASS, DCITY) " +
        "SELECT IFNULL(max(DNO),0)+1,?,?,?,?,?,?,? FROM DISTRIBUTOR_LIST",
        [dist.distName, dist.distEmail, dist.distPhone, dist.distWebsite, dist.distAddr, dist.distPass, dist.distCity],
        function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                callback();
            }
        });
};

var insertNewCompaniesInDb = function (comps, distNo, callback) {
    var counter = 0;
    comps.forEach(function (c) {
        con.query("INSERT INTO COMPANY_LIST (CNO, CNAME, DNO) " +
            " SELECT IFNULL(max(CNO),0)+1,'" + c + "'," + distNo + " FROM COMPANY_LIST",
            function (err) {
                if (err) {
                    console.log("in err");
                    console.log(err);
                }
                counter++;
                if (counter == comps.length) {
                    callback();
                }
            });
    });
};

var insertNewItemsInDb = function (items, distNo) {
    items.forEach(function (t) {
        con.query("SELECT CL.CNO,CL.CNAME " +
        " FROM COMPANY_LIST CL" +
        " WHERE CNAME = ?" +
        " AND CL.DNO = ? ",
            [t.company, distNo],
            function (err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(rows);
                con.query("INSERT INTO ITEM_LIST (INO, INAME, ITRADEP, DESCRIPTION, CNO, DNO) " +
                    " SELECT IFNULL(max(INO),0)+1,?,?,?,?,? " +
                    " FROM ITEM_LIST IL",
                    [t.name, t.rate, t.pack, rows[0].CNO, distNo],
                    function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
            });
    });
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
