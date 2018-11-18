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

<<<<<<< HEAD
                    totalItemList.push({
                        name: item[0],
                        pack: item[1],
                        rate: item[2]
                    });
=======
                    if (item[0] == "" || item[1] == "" || item[2] == "") {

                    } else {
                        totalItemList.push({
                            name: item[0],
                            pack: item[1],
                            rate: item[2]
                        });
                    }
>>>>>>> 60ed007c9e2f54eb4138ea0ba38c09cd90ac7ff5
                });

                $scope.itemList = totalItemList;
                console.log($scope.itemList);
                $scope.table_newItem = {
                    display: 'table'
                };
                $scope.$apply();

                //Submitting items to check if they exist
                var itemParams = {items_list: totalItemList};
                console.log(itemParams);

                // $http({
                //     method: 'GET',
                //     url: '/checkItems',
                //     params: itemParams,
                //     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                // }).then(function (success) {
                //     if (success.status === 200) {
                //
                //     }
                // }, function (error) {
                //     console.log(error);
                // });
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