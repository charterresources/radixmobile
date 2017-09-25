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


angular.module('mm.addons.mystudents')

/**
 * Service to handle notifications (messages).
 *
 * @module mm.addons.commendation
 * @ngdoc service
 * @name $mmaCommendation
 */
    .factory('$mmaMyStudents', function($q, $log, $mmSite) {

        $log = $log.getInstance('$mmaMyStudents');

        var self = {};

        /**
         * Get cache key for notification list WS calls.
         *
         * @return {String} Cache key.
         */
        function getCommendationCacheKey() {
            return 'mmaCommendation:list';
        };

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
        self.getMyStudents = function() {

            $log.debug('Get students for parent');

            var data = {
                parentid: $mmSite.getUserId()
                //studentid: studentid
            };
            var preSets = {
                //cacheKey: getCommendationCacheKey()
            };

            // Get unread notifications.
            return $mmSite.read('spark_dashboard_get_students', data, preSets).then(function(response) {

                if (response.students) {
                    var students = response.students;
                    return students;
                } else {
                    return $q.reject();
                }
            });
        };

        return self;
    });
