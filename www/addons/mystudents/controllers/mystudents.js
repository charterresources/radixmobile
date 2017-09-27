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
    .controller('mmaMyStudentsListCtrl', function($scope, $ionicTabsDelegate, $stateParams, $log,$mmaMyStudents, $state, $mmaCalendar, $mmUtil, $timeout, $mmEvents,
                                                  mmaCalendarDaysInterval, $ionicScrollDelegate, $mmLocalNotifications, $mmCourses, mmaCalendarDefaultNotifTimeChangedEvent,
                                                  $ionicPopover, $q, $translate, $ionicPlatform) {

        $log = $log.getInstance('mmaMyStudentsListCtrl');
        $scope.students = [];

        $mmaMyStudents.getMyStudents().then(function(students) {
            $scope.students = students;
        }).finally(function() {
            $scope.studentsLoaded = true;
        });

        $scope.selectTabWithIndex = function(index) {
            $ionicTabsDelegate.select(index);
            console.log(index);
        };
        $scope.clicker=function(){
            console.log('clicked');
            alert('clicked');
        };

        $scope.onStudentSelected=function(studentId){
            if(studentId) {
                $state.go('site.assignments', {sid: studentId});
            }
        };
    });