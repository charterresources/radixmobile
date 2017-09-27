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
                                               $mmaAssignments, $mmaMyStudents) {

        $log = $log.getInstance('mmaAssignmentsCtrl');

        $scope.students = [];
        $scope.currentStudent = null;
        $scope.missingassignments = null;
        $scope.upcomingassignments = null;
        $scope.belowgradesassignments = null;
        $scope.studentsLoaded = false;
        $scope.isparentuser = $mmSite.getInfo().isparentuser;

        $scope.setCurrentStudentById = function(studentId) {
            $scope.eventsLoaded = false;
            for (var i = 0; i < $scope.students.length; i++) {
                if ($scope.students[i].id === studentId) {
                    $scope.currentStudent = $scope.students[i];
                    if($mmSite.currentStudentIdForParent!==studentId) {
                        $mmSite.setCurrentStudentId(studentId);
                    }
                    break;
                }
            }
            refreshAssignmenst();
            $scope.eventsLoaded = true;
        }

        $scope.eventToLoad = 1;
        $scope.eventsLoaded = false;



        $scope.isCurrent = function(studentId){
            return studentId === $mmSite.currentStudentIdForParent;
        }

        $scope.isActive1=true;

        var initialize=function() {
            if($stateParams.sid) {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($stateParams.sid);
                }
            }
            else {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($scope.students[0].id);
                }
            }
        };

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

        $mmaMyStudents.getMyStudents().then(function(students) {
            $scope.students = students;
        }).finally(function() {
            $scope.studentsLoaded = true;
            initialize();
        });

    });
