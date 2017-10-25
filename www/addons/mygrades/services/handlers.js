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
 * MyGrades handlers factory.
 *
 * @module mm.addons.mygrades
 * @ngdoc service
 * @name $mmaMyGradesHandlers
 */
    .factory('$mmaMyGradesHandlers', function($mmSite) {

        var self = {};



        /**
         * Side menu nav handler.
         *
         * @module mm.addons.mygrades
         * @ngdoc method
         * @name $mmaMyGradesHandlers#sideMenuNav
         */
        self.sideMenuNav = function() {

            var self = {};

            /**
             * Check if handler is enabled.
             *
             * @return {Promise|Boolean} If handler is enabled(only if parent user) returns a resolved promise. If it's not it can return a
             *                           rejected promise or false.
             */
            self.isEnabled = function() {
                return $mmSite.isParentUser;
            };

            /**
             * Get the controller.
             *
             * @return {Object} Controller.
             */
            self.getController = function() {

                /**
                 * Side menu nav handler controller.
                 *
                 * @module mm.addons.mygrades
                 * @ngdoc controller
                 * @name $mmaMyGradesHandlers#sideMenuNav:controller
                 */
                return function($scope) {
                    $scope.icon = 'ion-stats-bars';
                    $scope.title = 'mm.grades.grades';
                    $scope.state = 'site.mycoursesgrades';
                    $scope.class = 'mma-grades-coursesgrades';
                };
            };

            return self;
        };

        return self;
    });
