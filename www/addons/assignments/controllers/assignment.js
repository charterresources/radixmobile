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
 * Controller to handle an event.
 *
 * @module mm.addons.calendar
 * @ngdoc controller
 * @name mmaCalendarEventCtrl
 */
    .controller('mmaAssignmentCtrl', function($scope, $log, $stateParams, $mmaAssignments) {

        $log = $log.getInstance('mmaAssignmentCtrl');

        $scope.eventToLoad = 1;
        $scope.eventsLoaded = true;
        $scope.eventLoaded = true;
        $scope.coursename = null;
        // $scope.duedate = null;
        $scope.dategraded = null;
        $scope.grademax = null;
        $scope.title = null;
        $scope.itemmodule = null;
        $scope.feedback = null;
        $scope.icon = null;

        function getAssignment() {
            switch ($stateParams.type) {
                case 'missing':
                    $mmaAssignments.getStudentMissingAssignments().then(function(e) {
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
                                    break;
                                }
                            }
                        }
                    });
                    break;
                case 'upcoming':
                    $mmaAssignments.getStudentUpcomingAssignments().then(function(e) {
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
                                    break;
                                }
                            }
                        }
                    });
                    break;
                case 'below':
                    $mmaAssignments.getStudentBelowGradesAssignments().then(function(e) {
                        for (var i = 0; i < e.length; i++) {
                            for (var j = 0; j < e[i].belowgrades.length; j++) {
                                if($stateParams.id == e[i].belowgrades[j].coursemoduleid) {
                                    $scope.coursename = e[i].coursename;
                                    //$scope.duedate = e[i].belowgrades[j].duedate;
                                    $scope.dategraded = e[i].belowgrades[j].dategraded;
                                    $scope.grademax = e[i].belowgrades[j].grademax;
                                    $scope.title = e[i].belowgrades[j].title;
                                    $scope.itemmodule = e[i].belowgrades[j].itemmodule;
                                    $scope.feedback = e[i].belowgrades[j].feedback;
                                    $scope.icon = e[i].belowgrades[j].icon;
                                    break;
                                }
                            }
                        }
                    });
                    break;
                default:
            }
        }
        // function refreshAssignmenst() {
        //     $mmaAssignments.getStudentMissingAssignments().then(function(e) {
        //         $scope.missingassignments=e;
        //
        //         $mmaAssignments.getStudentUpcomingAssignments().then(function(e) {
        //             $scope.upcomingassignments=e;
        //
        //             $mmaAssignments.getStudentBelowGradesAssignments().then(function(e) {
        //                 $scope.belowgradesassignments=e;
        //             });
        //         });
        //     }).finally(init());
        // }
        //
        // function init() {
        //     var found=false;
        //     if($stateParams.id) {
        //         if($scope.missingassignments.length>0) {
        //             var massign=$scope.missingassignments;
        //             for (var i = 0; i < massign.length; i++) {
        //                 for (var j = 0; j < massign[i].missingassignments.length; j++) {
        //                     if(assignmentid == massign[i].missingassignments[j].coursemoduleid) {
        //                         $scope.assignment = massign[i].missingassignments[j];
        //                         found=true;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //         if(!found && $scope.upcomingassignments.length>0) {
        //             var uassign=$mmaAssignments.upcomingassignments;
        //             for (var i = 0; i < uassign.length; i++) {
        //                 for (var j = 0; j < uassign[i].upcomingassignments.length; j++) {
        //                     if(assignmentid == uassign[i].upcomingassignments[j].coursemoduleid) {
        //                         $scope.assignment = uassign[i].upcomingassignments[j];
        //                         found=true;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //         if(!found && $scope.belowgradesassignments.length>0) {
        //             var uassign=$scope.belowgradesassignments;
        //             for (var i = 0; i < uassign.length; i++) {
        //                 for (var j = 0; j < uassign[i].belowgradesassignments.length; j++) {
        //                     if(assignmentid == uassign[i].belowgradesassignments[j].coursemoduleid) {
        //                         $scope.assignment = uassign[i].belowgradesassignments[j];
        //                         found=true;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     else {
        //         // if($scope.students.length > 0) {
        //         //     $scope.setCurrentStudentById($scope.students[0].id);
        //         // }
        //     }
        // }
        // refreshAssignmenst();
        //init();
        getAssignment();
    });
