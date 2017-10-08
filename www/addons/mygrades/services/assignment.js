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


angular.module('mm.addons.mygrades')

/**
 * Service to handle mygrades course current grading term assignment.
 *
 * @module mm.addons.mygrades
 * @ngdoc service
 * @name $mmaMyCoursesGradesAssignment
 */
    .factory('$mmaMyCoursesGradesAssignment', function($q, $log, $mmSite, $mmSitesManager) {

        $log = $log.getInstance('$mmaMyCoursesGradesAssignment');

        var self = {};

        /**
         * Get cache key for get Student Assignment WS call.
         *
         * @return {String}       Cache key.
         */
        function getStudentAssignmentCacheKey() {
            return 'mmaMyCoursesGradesAssignment:assignment';
        }

        /**
         * Get students' assignment from site.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGradesAssignment#getStudentAssignment
         * @param {Boolean} [refresh] True when we should not get the value from the cache.
         * @param {int} [sid] Student id.
         * @param {int} [gid] Unique id from table {grades_grade}, each assignment has unique gid.
         * @return {Promise}           Promise resolved with notifications.
         */
        self.getStudentAssignment = function(refresh, sid,  gid) {

            $log.debug('Get student assignment');

            var data = {
                sid: sid,
                gid: gid
            };

            var preSets = {
                cacheKey: getStudentAssignmentCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students missing assignments.
            return $mmSite.read('spark_get_assignment', data, preSets).then(function(response) {

                if (response) {
                    response.icon="img/mod/" + response.itemmodule + ".svg";
                    return response;
                } else {
                    return $q.reject();
                }
            });
        };

        /**
         * Invalidates Student Assignment WS call.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGradesAssignment#invalidateStudentAssignments
         * @param {String} [siteid] Site ID to invalidate. If not defined, use current site.
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateStudentAssignment = function(siteid) {
            return $mmSitesManager.getSite(siteid).then(function(site) {
                return site.invalidateWsCacheForKey(getStudentAssignmentCacheKey());
            });
        };

        return self;
    });