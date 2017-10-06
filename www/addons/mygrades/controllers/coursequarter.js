// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mygrades')

/**
 * Controller to handle quarter course grades.
 *
 * @module mm.addons.mygrades
 * @ngdoc controller
 * @name mmaMyGradesCoursesGradesQuarterCtrl
 */
    .controller('mmaMyGradesCoursesGradesQuarterCtrl', function($scope, $log, $stateParams, $mmaMyCoursesGradesQuarter,
                                              $mmSite, $translate, $sce, $q, $ionicScrollDelegate, $mmUtil) {

        $log = $log.getInstance('mmaMyGradesCoursesGradesQuarterCtrl');

        var scrollView = $ionicScrollDelegate.$getByHandle('mmaMyGradesCoursesGradesQuarterScroll');
        $scope.courseQuarterToLoad = 1;
        $scope.courseQuarterLoaded = false;
        $scope.quartername = null;
        $scope.quarteraverage = null;
        $scope.courseid = null;
        $scope.coursename = null;
        $scope.categories = null;
        $scope.isscale = false;
        $scope.isgraded = false;
        $scope.lettergrade = null;
        $scope.progress = null;
        $scope.color = 'red';

        // var sid = parseInt($stateParams.sid);
        // var cid = parseInt($stateParams.cid);

        // Convenience function that fetches the assignment and updates the scope.
        function fetchMyCoursesGradesQuarter(refresh) {
            return $mmaMyCoursesGradesQuarter.getMyGradesQuarter(refresh, $stateParams.sid, $stateParams.cid).then(function(quarter) {
                $scope.courseid = quarter[0].courseid;
                $scope.coursename = quarter[0].coursename;
                $scope.quartername = quarter[0].quartername;
                $scope.quarteraverage = quarter[0].quarteraverage;
                $scope.categories = quarter[0].categories;
                $scope.isscale = quarter[0].isscale;
                $scope.isgraded = quarter[0].isgraded;
                $scope.lettergrade = quarter[0].lettergrade;
                $scope.progress = quarter[0].progress;
                $scope.color = quarter[0].color;
            }, function(error) {
                $mmUtil.showErrorModalDefault(error, 'mma.mygrades.errorloadquartercoursegrades', true);
            }).finally(function () {
                // Resize the scroll view so infinite loading is able to calculate if it should load more items or not.
                scrollView.resize();
            });
        };

        // Pull to refresh.
        $scope.refreshMyCoursesGradesQuarter = function() {
            var promises = [];

            promises.push($mmaMyCoursesGradesQuarter.invalidateMyCoursesGradesQuarterData());

            return $q.all(promises).finally(function() {
                return fetchMyCoursesGradesQuarter(true);
            });
        };

        // Get quarter course grade.
        fetchMyCoursesGradesQuarter().then(function() {
            $scope.courseQuarterLoaded = true;
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });