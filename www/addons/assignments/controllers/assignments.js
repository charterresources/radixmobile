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
    .controller('mmaAssignmentsCtrl', function($scope,$mmSite, $ionicTabsDelegate, $stateParams, $log,$mmaAssignments, $state,  $mmUtil, $timeout, $mmEvents,
                                               mmaCalendarDaysInterval, $ionicScrollDelegate, $mmLocalNotifications, $mmCourses, mmaCalendarDefaultNotifTimeChangedEvent,
                                               $ionicPopover, $q, $translate, $ionicPlatform
    ) {

        $log = $log.getInstance('mmaAssignmentsCtrl');

        $scope.students = [];
        $scope.currentStudent = null;
        $scope.missingassignments = null;
        $scope.upcomingassignments = null;
        $scope.belowgradesassignments = null;
        $scope.studentsLoaded = false;

        $scope.setCurrentStudentById = function(studentId) {
            for (var i = 0; i < $scope.students.length; i++) {
                if ($scope.students[i].id === studentId) {
                    $scope.currentStudent = $scope.students[i];
                    $mmSite.setCurrentStudentId(studentId);
                    break;
                }
            }
            refreshAssignmenst();
        }

        $scope.eventToLoad = 1;
        $scope.eventsLoaded = true;



        $scope.isCurrent = function(studentId){
            return studentId === $mmSite.currentStudentIdForParent;
        }

        $scope.isActive1=true;

        function init() {
            if($stateParams.id) {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($stateParams.id);
                }
            }
            else {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($scope.students[0].id);
                }
            }
        }

        function refreshAssignmenst() {
            $mmaAssignments.getStudentMissingAssignments().then(function(e) {
                $scope.missingassignments=e;
            });
            $mmaAssignments.getStudentUpcomingAssignments().then(function(e) {
                $scope.upcomingassignments=e;
            });
            $mmaAssignments.getStudentBelowGradesAssignments().then(function(e) {
                $scope.belowgradesassignments=e;
            });
        }

        $mmaAssignments.getMyStudents().then(function(students) {
            $scope.students = students;
        }).finally(function() {
            $scope.studentsLoaded = true;
            init();
        });

    });
