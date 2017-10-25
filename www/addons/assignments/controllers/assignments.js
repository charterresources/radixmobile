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

angular.module('mm.addons.assignments')

/**
 * Controller to handle calendar events.
 *
 * @module mm.addons.assignments
 * @ngdoc controller
 * @name mmaAssignmentsCtrl
 */
    .controller('mmaAssignmentsCtrl', function($scope, $mmSite, $ionicTabsDelegate, $stateParams, $log,
                                               $mmaAssignments, $mmaMyStudents, $q, $ionicScrollDelegate, $mmUtil) {

        $log = $log.getInstance('mmaAssignmentsCtrl');
        var scrollView = $ionicScrollDelegate.$getByHandle('mmaAssignmentsListScroll');
        $scope.students = [];
        // $scope.currentStudent = null;
        $scope.missingassignments = null;
        $scope.totalmissing = null;
        $scope.upcomingassignments = null;
        $scope.totalupcoming = null;
        $scope.belowgradesassignments = null;
        $scope.totalbelowgrade = null;
        $scope.studentsLoaded = false;
        $scope.isparentuser = $mmSite.isParentUser;

        $scope.$on('$ionicView.beforeEnter', function() {
            autoSelectStudent();
        });

        function autoSelectStudent() {
            if($scope.currentStudent != null){
                if($scope.currentStudent.id !== $mmSite.currentStudentIdForParent){
                    $scope.setCurrentStudentById($mmSite.currentStudentIdForParent);
                }
            }
            else {
                if ($scope.students.length > 0) {
                    if($mmSite.currentStudentIdForParent != null) {
                        $scope.setCurrentStudentById($mmSite.currentStudentIdForParent);
                    }
                    else {
                        $scope.setCurrentStudentById($scope.students[0].id);
                    }
                }
            }
        }

        $scope.setCurrentStudentById = function(studentId) {
            $scope.assignmentsLoaded = false;
            $ionicScrollDelegate.scrollTop();
            for (var i = 0; i < $scope.students.length; i++) {
                if ($scope.students[i].id === studentId) {
                    $scope.currentStudent = $scope.students[i];
                    if(!$mmSite.currentStudentIdForParent || $mmSite.currentStudentIdForParent !== studentId) {
                        $mmSite.setCurrentStudentId(studentId);
                    }
                    break;
                }
            }
            $scope.refreshAssignments();
        }

        $scope.assignmentToLoad = 1;

        $scope.isCurrent = function(studentId){
            return studentId === $mmSite.currentStudentIdForParent;
        }

        var getStudents = function() {
            return $mmaMyStudents.getMyStudents().then(function(students) {
                $scope.students = students;
                if($stateParams.sid != null) {
                    if($scope.students.length > 0) {
                        $scope.setCurrentStudentById($stateParams.sid);
                    }
                }
                else {
                    autoSelectStudent();
                }
            });
        };

        // Convenience function that fetches the assignments and updates the scope.
        function fetchAssignments(refresh) {
            return  $mmaAssignments.getStudentMissingAssignments(refresh).then(function(e) {
                $scope.missingassignments=e;

                angular.forEach(e, function (missingassignment) {
                    $scope.totalmissing += missingassignment.missingassignments.length;
                });

                return  $mmaAssignments.getStudentUpcomingAssignments(refresh).then(function(e) {
                    $scope.upcomingassignments=e;

                    angular.forEach(e, function (upcomingassignment) {
                        $scope.totalupcoming += upcomingassignment.upcomingassignments.length;
                    });

                    return $mmaAssignments.getStudentBelowGradesAssignments(refresh).then(function(e) {
                        $scope.belowgradesassignments=e;

                        angular.forEach(e, function (belowgradesassignment) {
                            $scope.totalbelowgrade += belowgradesassignment.belowgrades.length;
                        });
                    });
                });
            }, function(error) {
                $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignments', true);
            }).finally(function () {
                $scope.assignmentsLoaded = true;
                // Resize the scroll view so infinite loading is able to calculate if it should load more items or not.
                scrollView.resize();
            });
        };

        // Pull to refresh.
        $scope.refreshAssignments = function() {
            var promises = [];
            promises.push($mmaAssignments.invalidateStudentMissingAssignments());
            promises.push($mmaAssignments.invalidateStudentUpcomingAssignments());
            promises.push($mmaAssignments.invalidateStudentBelowGradesAssignments());

            $scope.totalmissing = null;
            $scope.totalupcoming = null;
            $scope.totalbelowgrade = null;

            return $q.all(promises).finally(function() {
                return fetchAssignments(true).then(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            });
        };

        getStudents();
    });