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
 * @module mm.addons.mystudents
 * @ngdoc service
 * @name $mmaMyStudents
 */
    .factory('$mmaMyStudents', function($q, $log, $mmSite, $mmSitesManager, $mmUser) {

        $log = $log.getInstance('$mmaMyStudents');

        var self = {};

        /**
         * Get students for parent from site.
         *
         * @module mm.addons.mystudents
         * @ngdoc method
         * @name $mmaMyStudents#getMyStudents
         * @param {Boolean} [refresh] True when we should not get the value from the cache.
         * @return {Promise}           Promise resolved with notifications.
         */
        self.getMyStudents = function(refresh) {

            $log.debug('Get students for parent');

            var data = {
                userid: $mmSite.getUserId()
            };

            var preSets = {
                cacheKey: getMyStudentsCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get unread notifications.
            return $mmSite.read('spark_dashboard_get_students', data, preSets).then(function(response) {

                if (response.students) {
                    angular.forEach(response.students, self.formatMyStudentData);
                    return response.students;
                } else {
                    return $q.reject();
                }
            });
        };

        /**
         * Get cache key for get my students WS call.
         *
         * @return {String}       Cache key.
         */
        function getMyStudentsCacheKey() {
            return 'mmaMyStudents:mystudents';
        }

        /**
         * Invalidates my students WS call.
         *
         * @module mm.addons.mystudents
         * @ngdoc method
         * @name $mmaMyStudents#invalidateMyStudents
         * @param {String} [siteid] Site ID to invalidate. If not defined, use current site.
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateMyStudents = function(siteid) {
            return $mmSitesManager.getSite(siteid).then(function(site) {
                return site.invalidateWsCacheForKey(getMyStudentsCacheKey());
            });
        };

        /**
         * Convenience function to format some student data to be rendered. Adds property student profile image
         *
         * @module mm.addons.mystudents
         * @ngdoc method
         * @name $mmaMyStudents#formatMyStudentData
         * @param {Object} e Student to format.
         */
        self.formatMyStudentData = function(e) {
            return $mmUser.getUserFromWS(e.id).then(function (student) {
                if (student.profileimageurl) {
                    e.profileimage = student.profileimageurl;
                }
                else {
                    e.profileimage = 'img/user-avatar.png';
                }
            });
        };

        return self;
    });