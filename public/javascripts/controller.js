(function () {
    'use strict';

    var appMy = angular.module('mainPage');

    appMy.controller('mainCtrl', function ($scope, $http) {
        $scope.sampleData = "Sample Data";
    });

    appMy.directive("fileReader", function () {
        return {
            scope: {
                fileReader: "="
            },
            link: function (scope, element) {
                $(element).on('change', function (changeEvent) {
                    scope.fileReader = "Wow what";
                    scope.$apply();
                    // var files = changeEvent.target.files;
                    // if (files.length) {
                    //     readFile(files[0], function (content) {
                    //         var data = content.split("\n");
                    //         data.forEach(function (t) {
                    //             var item = t.split(";");
                    //             console.log(item);
                    //         });
                    //     });
                    // }
                });
            }
        };
    });

    function readFile(file, cb) { // We pass a callback as parameter
        var content = "";
        var reader = new FileReader();

        reader.onload = function(e) {
            content = reader.result;
            // Content is ready, call the callback
            cb(content);
        }

        reader.readAsText(file);
        // return content; This is not needed anymore
    }

})();
