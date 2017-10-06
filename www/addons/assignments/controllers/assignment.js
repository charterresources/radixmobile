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
 * Controller to handle an assignment.
 *
 * @module mm.addons.assignments
 * @ngdoc controller
 * @name mmaAssignmentCtrl
 */
    .controller('mmaAssignmentCtrl', function($scope, $log, $stateParams, $mmaAssignments, $mmUser,
                                              $mmSite, $translate, $sce, $q, $ionicScrollDelegate, $mmUtil) {

        $log = $log.getInstance('mmaAssignmentCtrl');

        var scrollView = $ionicScrollDelegate.$getByHandle('mmaAssignmentScroll');
        $scope.coursename = null;
        $scope.dategraded = null;
        $scope.grademax = null;
        $scope.title = null;
        $scope.itemmodule = null;
        $scope.feedback = null;
        $scope.icon = null;
        $scope.studentfullname = null;
        $scope.assignmenttype = null;
        $scope.description = null;

        // Convenience function that fetches the assignment and updates the scope.
        function fetchAssignment(refresh) {
            return $mmUser.getUserFromWS($mmSite.currentStudentIdForParent).then(function (student) {
                $scope.studentfullname = student.fullname;

                switch ($stateParams.type) {
                    case 'missing':
                        return $mmaAssignments.getStudentMissingAssignments(refresh).then(function(e) {
                            for (var i = 0; i < e.length; i++) {
                                for (var j = 0; j < e[i].missingassignments.length; j++) {
                                    if($stateParams.id == e[i].missingassignments[j].coursemoduleid) {
                                        $scope.coursename = e[i].coursename;
                                        $scope.duedate = e[i].missingassignments[j].duedate;
                                        $scope.dategraded = e[i].missingassignments[j].dategraded;
                                        $scope.grademax = e[i].missingassignments[j].grademax;
                                        $scope.title = e[i].missingassignments[j].title;
                                        $scope.itemmodule = e[i].missingassignments[j].itemmodule;
                                        $scope.feedback = e[i].missingassignments[j].feedback;
                                        $scope.icon = e[i].missingassignments[j].icon;
                                        $scope.assignmenttype = $translate.instant('mma.assignments.missingassignment');
                                        $scope.description = $sce.trustAsHtml(e[i].missingassignments[j].description);
                                        break;
                                    }
                                }
                            }
                        }, function(error) {
                            $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignment', true);
                        });
                        break;
                    case 'upcoming':
                        return $mmaAssignments.getStudentUpcomingAssignments(refresh).then(function(e) {
                            for (var i = 0; i < e.length; i++) {
                                for (var j = 0; j < e[i].upcomingassignments.length; j++) {
                                    if($stateParams.id == e[i].upcomingassignments[j].coursemoduleid) {
                                        $scope.coursename = e[i].coursename;
                                        $scope.duedate = e[i].upcomingassignments[j].duedate;
                                        $scope.dategraded = e[i].upcomingassignments[j].dategraded;
                                        $scope.grademax = e[i].upcomingassignments[j].grademax;
                                        $scope.title = e[i].upcomingassignments[j].title;
                                        $scope.itemmodule = e[i].upcomingassignments[j].itemmodule;
                                        $scope.feedback = e[i].upcomingassignments[j].feedback;
                                        $scope.icon = e[i].upcomingassignments[j].icon;
                                        $scope.assignmenttype = $translate.instant('mma.assignments.upcomingassignment');
                                        $scope.description = $sce.trustAsHtml(e[i].upcomingassignments[j].description);
                                        break;
                                    }
                                }
                            }
                        }, function(error) {
                            $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignment', true);
                        });
                        break;
                    case 'below':
                        return $mmaAssignments.getStudentBelowGradesAssignments(refresh).then(function(e) {
                            for (var i = 0; i < e.length; i++) {
                                for (var j = 0; j < e[i].belowgrades.length; j++) {
                                    if($stateParams.id == e[i].belowgrades[j].coursemoduleid) {
                                        $scope.coursename = e[i].coursename;
                                        $scope.dategraded = e[i].belowgrades[j].dategraded;
                                        $scope.grademax = e[i].belowgrades[j].grademax;
                                        $scope.title = e[i].belowgrades[j].title;
                                        $scope.itemmodule = e[i].belowgrades[j].itemmodule;
                                        $scope.feedback = e[i].belowgrades[j].feedback;
                                        $scope.icon = e[i].belowgrades[j].icon;
                                        $scope.assignmenttype = $translate.instant('mma.assignments.lowgradeassignment');
                                        $scope.description = $sce.trustAsHtml(e[i].belowgrades[j].description);
                                        break;
                                    }
                                }
                            }
                        }, function(error) {
                            $mmUtil.showErrorModalDefault(error, 'mma.assignments.errorloadassignment', true);
                        });
                        break;
                    default:
                }
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
            switch ($stateParams.type) {
                case 'missing':
                    promises.push($mmaAssignments.invalidateStudentMissingAssignments());
                    break;
                case 'upcoming':
                    promises.push($mmaAssignments.invalidateStudentUpcomingAssignments());
                    break;
                case 'below':
                    promises.push($mmaAssignments.invalidateStudentBelowGradesAssignments());
                    break;
                default:
            }

            return $q.all(promises).finally(function() {
                return fetchAssignment(true);
            });
        };

        // Get first assignment.
        fetchAssignment().then(function() {
            $scope.assignmentLoaded = true;
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });