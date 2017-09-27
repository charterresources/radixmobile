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
//commendation


angular.module('mm.addons.assignments')

/**
 * Service to handle notifications (messages).
 *
 * @module mm.addons.assignments
 * @ngdoc service
 * @name $mmaAssignments
 */
    .factory('$mmaAssignments', function($q, $log, $mmSite) {

        $log = $log.getInstance('$mmaAssignments');

        var self = {};

        /**
         * Get commendation from site.
         *
         * @module mm.addons.notifications
         * @ngdoc method
         * @name $mmaNotifications#getNotifications
         * @param {Boolean} read       True if should get read notifications, false otherwise.
         * @param {Number} limitFrom   Position of the first notification to get.
         * @param {Number} limitNumber Number of notifications to get.
         * @return {Promise}           Promise resolved with notifications.
         */
        // self.getMyStudents = function() {
        //
        //     $log.debug('Get student(s)');
        //
        //     var data = {
        //         userid: $mmSite.getUserId()
        //     };
        //     var preSets = {
        //         //cacheKey: getCommendationCacheKey()
        //     };
        //
        //     // Get unread notifications.
        //     return $mmSite.read('spark_dashboard_get_students', data, preSets).then(function(response) {
        //
        //         if (response.students) {
        //             var students = response.students;
        //             return students;
        //         } else {
        //             return $q.reject();
        //         }
        //     });
        // };

        self.getStudentMissingAssignments = function() {

            $log.debug('Get students for parent');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };
            var preSets = {
                //cacheKey: getCommendationCacheKey()
            };

            // Get unread notifications.
            return $mmSite.read('spark_get_student_missingassignments', data, preSets).then(function(response) {

                if (response) {

                    for (var i = 0; i < response.length; i++) {
                        for (var j = 0; j < response[i].missingassignments.length; j++) {
                            response[i].missingassignments[j].icon="img/mod/" + response[i].missingassignments[j].itemmodule + ".svg";
                        }
                    }
                    return response;
                } else {
                    return $q.reject();
                }
            });
        };

        self.getStudentUpcomingAssignments = function() {

            $log.debug('Get students for parent');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };
            var preSets = {
                //cacheKey: getCommendationCacheKey()
            };

            // Get unread notifications.
            return $mmSite.read('spark_get_student_upcomingassignments', data, preSets).then(function(response) {

                if (response) {

                    for (var i = 0; i < response.length; i++) {
                        for (var j = 0; j < response[i].upcomingassignments.length; j++) {
                            response[i].upcomingassignments[j].icon="img/mod/" + response[i].upcomingassignments[j].itemmodule + ".svg";
                        }
                    }
                    return response;
                } else {
                    return $q.reject();
                }
            });
        };

        self.getStudentBelowGradesAssignments = function() {

            $log.debug('Get students for parent');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };
            var preSets = {
                //cacheKey: getCommendationCacheKey()
            };

            // Get unread notifications.
            return $mmSite.read('spark_get_student_belowgradesassignments', data, preSets).then(function(response) {

                if (response) {

                    for (var i = 0; i < response.length; i++) {
                        for (var j = 0; j < response[i].belowgrades.length; j++) {
                            response[i].belowgrades[j].icon="img/mod/" + response[i].belowgrades[j].itemmodule + ".svg";
                        }
                    }
                    return response;
                } else {
                    return $q.reject();
                }
            });
        };

        return self;
    });
