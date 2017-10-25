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

angular.module('mm.addons.mygrades')

/**
 * Service to handle courses grades.
 *
 * @module mm.addons.mygrades
 * @ngdoc service
 * @name $mmaMyCoursesGrades
 */
    .factory('$mmaMyCoursesGradesQuarter', function($q, $log, $mmSite,  $mmSitesManager) {

        $log = $log.getInstance('$mmaMyCoursesGradesQuarter');

        var self = {};

        /**
         * Get cache key for courses quarter grade WS calls.
         *
         * @return {String}         Cache key.
         */
        function getMyCoursesGradesQuarterCacheKey() {
            return 'mmaMyGradesQuarter:coursesgradesquarter';
        }

        /**
         * Invalidates courses quarter grade data WS calls.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGradesQuarter#invalidateMyCoursesGradesQuarterData
         * @param {Number}  [siteId]   Site id (empty for current site).
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateMyCoursesGradesQuarterData = function(siteId) {
            return $mmSitesManager.getSite(siteId).then(function(site) {
                return site.invalidateWsCacheForKey(getMyCoursesGradesQuarterCacheKey());
            });
        };

        /**
         * Returns whether or not the plugin is enabled for a certain site.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGradesQuarter#isPluginEnabled
         * @param  {String} [siteId] Site ID. If not defined, current site.
         * @return {Boolean}         True if plugin is enabled, false otherwise.
         */
        self.isPluginEnabled = function() {
            return $mmSite.isParentUser || $mmSite.isStudentUser;
        };

        /**
         * Get the quarter grades for a certain course.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGradesQuarter#getMyGradesQuarter
         * @param {Boolean} [refresh] True when we should not get the value from the cache.
         * @return {Promise}        Promise to be resolved when the grades are retrieved.
         */
        self.getMyGradesQuarter = function(refresh, sid, cid) {

            $log.debug('Get quarter courses and grades');

            var data = {
                sid: sid,
                cid: cid
            };

            var preSets = {
                cacheKey: getMyCoursesGradesQuarterCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students grades.
            return $mmSite.read('spark_get_course_quarter_average', data, preSets).then(function(quartergrades) {
                if (quartergrades) {
                    angular.forEach(quartergrades, function(grade) {
                        if(grade.categories) {
                            angular.forEach(grade.categories, function(category) {
                                if(category.assignments) {
                                    angular.forEach(category.assignments, function(assignment) {
                                        assignment.icon="img/mod/" + assignment.itemmodule + ".svg";
                                    });
                                }
                            });
                        }
                    });
                    return quartergrades;
                } else {
                    return $q.reject();
                }
            });
        };

        return self;
    });