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

                var data = content.split(",");
                data.forEach(function (t) {
                    var item = t.split(";");
                    item[0] = item[0].replace(/[\n\r]/g,'');;
                    console.log(item);

                    totalItemList.push({
                        name: item[0],
                        pack: item[1],
                        rate: item[2]
                    });
                });

                $scope.itemList = totalItemList;
                $scope.table_newItem = {
                    display: 'inline'
                }
                $scope.apply();

                //Submitting items to check if they exist
                // var itemParams = {items_list: totalItemList};
                // console.log(itemParams);

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

            console.log($scope.distributor_name);

            var abc = {
                distName : $scope.distributor_name,
                itemList: $scope.itemList
            };

            $http({
                method: 'POST',
                url: '/submitDistributor',
                params: abc,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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