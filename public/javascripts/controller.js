(function () {
    'use strict';

    var appMy = angular.module('mainPage');

    appMy.controller('mainCtrl', function ($scope, $http) {
        $scope.sampleData = "Sample Data";

        $scope.itemList = [];

        window.openFile = function (event) {
            var input = event.target;

            readFile(input.files[0], function (content) {

                var totalItemList = [];

                console.log(content);

                var data = content.split(",");
                data.forEach(function (t) {
                    var item = t.split(";");
                    item[0] = item[0].replace(/[\n\r]/g, '');

                    if (item[0] == "" || item[1] == "" || item[2] == "") {

                    } else {
                        totalItemList.push({
                            name: item[0],
                            pack: item[1],
                            rate: item[2]
                        });
                    }
                });

                //Submitting items to check if they exist
                var itemParams = {items_list: JSON.stringify(totalItemList)};

                $http({
                    method: 'GET',
                    url: '/checkItems',
                    params: itemParams,
                    headers: {'Content-Type': undefined}
                }).then(function (success) {
                    if (success.status === 200) {

                        console.log(success.data);
                        console.log(totalItemList);

                        $scope.existItemList = success.data.items;
                        $scope.table_existingItem = {
                            display: 'table'
                        };

                        console.log($scope.existItemList);

                        var temp = $scope.existItemList;
                        temp.forEach(function (it) {
                            totalItemList.forEach(function (t) {
                                if (it.name == t.name) {

                                }
                            });
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            });
        };

        $scope.sub = function () {
            console.log("Trying to submit");

            if ($scope.itemList.length < 1) {
                $scope.msgHide = "Distributors Cannot be added without any Items"
            }

            var abc = {
                distName: $scope.distributor_name,
                itemList: JSON.stringify($scope.itemList)
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

            console.log("Distributor Added")
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

})();