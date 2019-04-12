(function () {
    'use strict';

    var appMy = angular.module('mainPage');

    appMy.controller('mainCtrl', function ($scope, $http) {
        $scope.sampleData = "Sample Data";
        $scope.itemList = [];

        var display = {
            display: 'table'
        };

        window.openFile = function (event) {
            var input = event.target;
            readFile(input.files[0], function (content) {

                var totalItemList = [];
                var data = content.split(",");
                data.forEach(function (t) {
                    var item = t.split(";");
                    item[0] = item[0].replace(/[\n\r]/g, '');

                    if (item[0] == "" || item[1] == "" || item[2] == "" || item[3] == undefined) {
                    } else {
                        totalItemList.push({
                            name: item[0],
                            rate: item[1],
                            pack: item[2],
                            company: item[3]
                        });
                    }
                });

                $scope.itemList = totalItemList;
                if ($scope.itemList.length < 1) {
                    $scope.new_item_msg = display;
                } else {
                    $scope.table_newItem = display;
                }
                $scope.$apply();
            });
        };

        $scope.sub = function () {
            console.log("Trying to submit");

            if ($scope.itemList.length < 1) {
                $scope.msgHide = "Distributors Cannot be added without any Items"
            }

            var companies = [];
            $scope.itemList.forEach(function (item) {
                companies.push(item.company);
            });
            var uniqueComps = companies.filter( onlyUnique );

            var abc = {
                distName: $scope.distributor_name,
                distEmail: $scope.distributor_email,
                distPass: $scope.distributor_password,
                distPhone: $scope.distributor_phone,
                distWebsite: $scope.distributor_website,
                distAddr: $scope.distributor_address,
                itemList: JSON.stringify($scope.itemList),
                companies: JSON.stringify(uniqueComps)
            };

            $http({
                method: 'POST',
                url: '/submitDistributor',
                params: abc,
                headers: {'Content-Type': undefined}
            }).then(function (success) {
                if (success.status === 200) {
                    // window.location = '/';
                }
            }, function (error) {
                console.log(error);
            });

            console.log("Distributor Added");
        }
    });

    function readFile(file, cb) { // We pass a callback as parameter
        var content = "";
        var reader = new FileReader();

        reader.onload = function (e) {
            content = reader.result;
            // Content is ready, call the callback
            cb(content);
        }

        reader.readAsText(file);
        // return content; This is not needed anymore
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

})();