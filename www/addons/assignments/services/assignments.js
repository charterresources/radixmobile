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
    .factory('$mmaAssignments', function($q, $log, $mmSite, $mmSitesManager) {

        $log = $log.getInstance('$mmaAssignments');

        var self = {};

        /**
         * Get cache key for get Student MissingAssignments WS call.
         *
         * @return {String}       Cache key.
         */
        function getStudentMissingAssignmentsCacheKey() {
            return 'mmaAssignments:missingassignments';
        }

        /**
         * Get cache key for get Student UpcomingAssignments WS call.
         *
         * @return {String}       Cache key.
         */
        function getStudentUpcomingAssignmentsCacheKey() {
            return 'mmaAssignments:upcomingassignments';
        }

        /**
         * Get cache key for get Student BelowGradesAssignments WS call.
         *
         * @return {String}       Cache key.
         */
        function getStudentBelowGradesAssignmentsCacheKey() {
            return 'mmaAssignments:belowgradesassignments';
        }

        /**
         * Get students' missing assignments from site.
         *
         * @module mm.addons.assignments
         * @ngdoc method
         * @name $mmaAssignments#getStudentMissingAssignments
         * @param {Boolean} [refresh] True when we should not get the value from the cache.
         * @return {Promise}           Promise resolved with notifications.
         */
        self.getStudentMissingAssignments = function(refresh) {

            $log.debug('Get students missing assignments');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };

            var preSets = {
                cacheKey: getStudentMissingAssignmentsCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students missing assignments.
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

        self.getStudentUpcomingAssignments = function(refresh) {

            $log.debug('Get students upcoming assignments');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };

            var preSets = {
                cacheKey: getStudentUpcomingAssignmentsCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students upcoming assignments.
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

        self.getStudentBelowGradesAssignments = function(refresh) {

            $log.debug('Get students below grades assignments');

            var data = {
                studentid: $mmSite.currentStudentIdForParent
            };

            var preSets = {
                cacheKey: getStudentBelowGradesAssignmentsCacheKey()
            };

            if(refresh) {
                preSets.getFromCache = false;
            }

            // Get students below grades assignments.
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

        /**
         * Invalidates Student Missing Assignments WS call.
         *
         * @module mm.addons.assignments
         * @ngdoc method
         * @name $mmaAssignments#invalidateStudentMissingAssignments
         * @param {String} [siteid] Site ID to invalidate. If not defined, use current site.
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateStudentMissingAssignments = function(siteid) {
            return $mmSitesManager.getSite(siteid).then(function(site) {
                return site.invalidateWsCacheForKey(getStudentMissingAssignmentsCacheKey());
            });
        };

        /**
         * Invalidates Student Upcoming Assignments WS call.
         *
         * @module mm.addons.assignments
         * @ngdoc method
         * @name $mmaAssignments#invalidateStudentUpcomingAssignments
         * @param {String} [siteid] Site ID to invalidate. If not defined, use current site.
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateStudentUpcomingAssignments = function(siteid) {
            return $mmSitesManager.getSite(siteid).then(function(site) {
                return site.invalidateWsCacheForKey(getStudentUpcomingAssignmentsCacheKey());
            });
        };

        /**
         * Invalidates Student Below Grades Assignments WS call.
         *
         * @module mm.addons.assignments
         * @ngdoc method
         * @name $mmaAssignments#invalidateStudentBelowGradesAssignments
         * @param {String} [siteid] Site ID to invalidate. If not defined, use current site.
         * @return {Promise}        Promise resolved when the data is invalidated.
         */
        self.invalidateStudentBelowGradesAssignments = function(siteid) {
            return $mmSitesManager.getSite(siteid).then(function(site) {
                return site.invalidateWsCacheForKey(getStudentBelowGradesAssignmentsCacheKey());
            });
        };

        return self;
    });