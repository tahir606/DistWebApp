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

                        $scope.existItemList = success.data.items;
                        if ($scope.existItemList.length < 1) {
                            $scope.exist_item_msg = display;
                        } else {
                            $scope.table_existingItem = display;
                        }

                        var BreakException = {};
                        var c = $scope.existItemList.length;    //Number of existing items
                        while (c > 0) {   //Loop until all the existing items have been expunged
                            try {
                                for (var i = 0; i < totalItemList.length; i++) {
                                    $scope.existItemList.forEach(function (item) {
                                        if (totalItemList[i].name == item.INAME) {  // If item names are same remove that object from array
                                            console.log("Removing: "
                                                + totalItemList[i].name + " == " + item.INAME);
                                            totalItemList.splice(i, 1);     //On removing break from the checking loop and start all over again with the while loop
                                            c--;
                                            throw BreakException;
                                        }
                                    });
                                }
                            } catch (e) {
                                if (e !== BreakException) throw e;
                            }
                        }

                        $scope.itemList = totalItemList;
                        if ($scope.itemList.length < 1) {
                            $scope.new_item_msg = display;
                        } else {
                            $scope.table_newItem = display;
                        }


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

})();