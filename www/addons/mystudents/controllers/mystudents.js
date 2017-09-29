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

angular.module('mm.addons.mystudents')

/**
 * Controller to handle calendar events.
 *
 * @module mm.addons.calendar
 * @ngdoc controller
 * @name mmaCalendarListCtrl
 */
    .controller('mmaMyStudentsListCtrl', function($scope, $ionicTabsDelegate, $stateParams, $log, $mmaMyStudents,
                                                  $state, $q, $ionicScrollDelegate, $mmUtil, $mmSite, $mmUser) {

        $log = $log.getInstance('mmaMyStudentsListCtrl');

        var scrollView = $ionicScrollDelegate.$getByHandle('mmaMyStudentsListScroll');
        $scope.students = [];

        // Convenience function that fetches the students and updates the scope.
        function fetchStudents(refresh) {
            return $mmaMyStudents.getMyStudents(refresh).then(function(students) {

                if (refresh) {
                    $scope.students = students;
                } else {
                    // Filter events with same ID. Repeated events are returned once per WS call, show them only once.
                    $scope.students = $mmUtil.mergeArraysWithoutDuplicates($scope.students, students, 'id');
                }

                // Resize the scroll view so infinite loading is able to calculate if it should load more items or not.
                scrollView.resize();
            }, function(error) {
                $mmUtil.showErrorModalDefault(error, 'mma.mystudents.errorloadmystudents', true);
            });
        }

        $scope.onStudentSelected = function(studentId){
            if(studentId) {
                $mmSite.setCurrentStudentId(studentId);
                $state.go('site.assignments', {sid: studentId});
            }
        };

        // Pull to refresh.
        $scope.refreshStudents = function() {
            var promises = [];
            promises.push($mmaMyStudents.invalidateMyStudents());

            return $q.all(promises).finally(function() {
                return fetchStudents(true);
            });
        };

        // Get first students.
        fetchStudents().then(function() {
            $scope.studentsLoaded = true;
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });