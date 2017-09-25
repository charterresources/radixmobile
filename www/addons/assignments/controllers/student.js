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
    .controller('mmaAssignmentsStudentCtrl', function($scope, $log, $stateParams,$mmaAssignmentsStudent, $mmaCalendar, $mmUtil, $mmCourse, $mmCourses, $translate,
                                                      $mmLocalNotifications) {

        // $scope.eventLoaded=true;
        // $scope.title="Student Name";
        // var studentid = parseInt($stateParams.id);
        // $scope.missingassignments=[];
        // $mmaAssignmentsStudent.getStudentAssignments(studentid).then(function(e) {
        //     $scope.missingassignments=e;
        // });
        $scope.eventLoaded=true;
        $scope.title="Student Name";
        // var studentid = parseInt($stateParams.id);
        $scope.missingassignments=[];
        $mmaAssignmentsStudent.getStudentAssignments().then(function(e) {
            $scope.missingassignments=e;
        });
    });
