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
 * Controller to handle an assignment.
 *
 * @module mm.addons.mygrades
 * @ngdoc controller
 * @name mmaMyGradesCoursesGradesAssignmentCtrl
 */
    .controller('mmaMyGradesCoursesGradesAssignmentCtrl', function($scope, $log, $stateParams,
                                                               $mmaMyCoursesGradesAssignment, $mmUser,
                                                               $mmSite, $translate, $sce, $q, $ionicScrollDelegate,
                                                               $mmUtil) {

        $log = $log.getInstance('mmaMyGradesCoursesGradesAssignmentCtrl');

        var scrollView = $ionicScrollDelegate.$getByHandle('mmaMyGradesCoursesGradesAssignmentScroll');
        $scope.coursename = null;
        $scope.dategraded = null;
        $scope.title = null;
        $scope.itemmodule = null;
        $scope.feedback = null;
        $scope.icon = null;
        $scope.studentfullname = null;
        $scope.description = null;
        $scope.score = null;
        $scope.missed = false;
        $scope.excluded = false;

        // Convenience function that fetches the assignment and updates the scope.
        function fetchAssignment(refresh) {
            return $mmUser.getUserFromWS($stateParams.sid).then(function (student) {
                $scope.studentfullname = student.fullname;
                return $mmaMyCoursesGradesAssignment.getStudentAssignment(refresh, $stateParams.sid, $stateParams.cmid).then(function(e) {
                    $scope.coursename = e.coursename;
                    $scope.duedate = e.duedate;
                    $scope.dategraded = e.dategraded;
                    $scope.title = e.title;
                    $scope.itemmodule = e.itemmodule;
                    $scope.feedback = e.feedback;
                    $scope.icon = e.icon;
                    $scope.score = e.score;
                    $scope.missed = e.missed;
                    $scope.excluded = e.excluded;
                    $scope.description = $sce.trustAsHtml(e.description);
                }, function(error) {
                    $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignment', true);
                });
            }, function(error) {
                $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignment', true);
            }).finally(function () {
                // Resize the scroll view so infinite loading is able to calculate if it should load more items or not.
                scrollView.resize();
            });
        };

        // Pull to refresh.
        $scope.refreshAssignment = function() {
            var promises = [];

            promises.push($mmaMyCoursesGradesAssignment.invalidateStudentAssignment());

            return $q.all(promises).finally(function() {
                return fetchAssignment(true);
            });
        };

        // Get assignment.
        fetchAssignment().then(function() {
            $scope.assignmentLoaded = true;
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });