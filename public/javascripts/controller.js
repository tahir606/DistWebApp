(function () {
    'use strict';

    var appMy = angular.module('mainPage');

    appMy.controller('mainCtrl', function ($scope, $http) {
        $scope.sampleData = "Sample Data";

        $scope.itemList = [];

        window.openFile = function (event) {
            var input = event.target;

            readFile(input.files[0], function (content) {

                var data = content.split(",");
                data.forEach(function (t) {
                    var item = t.split(";");

                    $scope.itemList.push({
                        name: item[0],
                        pack: item[1],
                        rate: item[2]
                    });
                });

                console.log($scope.itemList);

                $scope.$apply();
            });
        };

        $scope.sub = function () {
            console.log("Trying to submit");

            if ($scope.itemList.length < 1) {
                $scope.msgHide = "Distributors Cannot be added without any Items"
            }

            console.log($scope.distributor_name);

            //Submitting distributor to insert
            // var abc = $.param({dist_name: $scope.distributor_name});
            var abc = {dist_name: "Value"};
            console.log(abc);

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
                //error
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
