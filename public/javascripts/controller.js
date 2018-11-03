(function () {
    'use strict';

    var appMy = angular.module('mainPage');

    appMy.controller('mainCtrl', function ($scope, $http) {
        $scope.sampleData = "Sample Data";

        $scope.itemList = [];

        $scope.itemList = [{
            name: "Oreo",
            pack: "4X2",
            rate: "20"
        }, {
            name: "Milk Pack",
            pack: "1 Litre",
            rate: "120"
        }];

        $scope.itemList.push({
            name: "Big Head",
            pack: "1X1",
            rate: "15000"
        });

        console.log($scope.itemList);

        window.openFile = function (event) {
            var input = event.target;

            readFile(input.files[0], function (content) {

                var data = content.split("\n");
                data.forEach(function (t) {
                    var item = t.split(";");
                    // console.log(item);
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
    });

    // appMy.directive("itemList", function () {
    //     return {
    //         scope: {
    //             itemList: "="
    //         },
    //         link: function (scope, element) {
    //             $(element).on('change', function (changeEvent) {
    //                 var files = changeEvent.target.files;
    //                 if (files.length) {
    //                     readFile(files[0], function (content) {
    //                         scope.itemList = [];
    //
    //                         var data = content.split("\n");
    //                         data.forEach(function (t) {
    //                             var item = t.split(";");
    //
    //                             scope.itemList.push({
    //                                 name: item[0],
    //                                 pack: item[1],
    //                                 rate: item[2]
    //                             });
    //                             scope.$apply();
    //                         });
    //                     });
    //                 }
    //             });
    //         }
    //     };
    // });

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
