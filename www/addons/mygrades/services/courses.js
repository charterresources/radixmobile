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
    .factory('$mmaMyCoursesGrades', function($q, $log, $mmSite,  $mmSitesManager) {

        $log = $log.getInstance('$mmaMyCoursesGrades');

        var self = {};

        /**
         * Get cache key for courses grade WS calls.
         *
         * @return {String}         Cache key.
         */
        function getMyCoursesGradesCacheKey() {
            return 'mmaMyGrades:coursesgrades';
        }

        /**
         * Invalidates courses grade data WS calls.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGrades#invalidateMyCoursesGradesData
         * @param {Number}  [siteId]   Site id (empty for current site).
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateMyCoursesGradesData = function(siteId) {
            return $mmSitesManager.getSite(siteId).then(function(site) {
                return site.invalidateWsCacheForKey(getMyCoursesGradesCacheKey());
            });
        };

        /**
         * Returns whether or not the plugin is enabled for a certain site.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGrades#isPluginEnabled
         * @param  {String} [siteId] Site ID. If not defined, current site.
         * @return {Boolean}         True if plugin is enabled, false otherwise.
         */
        self.isPluginEnabled = function() {
            return $mmSite.getInfo().isparentuser;
        };

        /**
         * Get the grades for a certain course.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyCoursesGrades#getMyGrades
         * @param {Boolean} [refresh] True when we should not get the value from the cache.
         * @return {Promise}        Promise to be resolved when the grades are retrieved.
         */
        self.getMyGrades = function(refresh) {

            $log.debug('Get courses and grades');

            var data = {
                userid: $mmSite.currentStudentIdForParent
            };

            var preSets = {
                cacheKey: getMyCoursesGradesCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students grades.
            return $mmSite.read('spark_get_student_grades', data, preSets).then(function(mygrades) {
                if (mygrades.courses) {
                    var grades = mygrades.courses;
                    angular.forEach(grades, function(grade) {
                        if(isNaN(grade.progress)) {
                            grade.progress = false;
                            grade.roundProgress = false;
                        }
                        else {
                            grade.roundProgress = true;
                        }
                    });
                    return grades;
                } else {
                    return $q.reject();
                }
            });
        };

        return self;
    });