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

angular.module('mm.core.courses')

/**
 * Controller to handle the courses list.
 *
 * @module mm.core.courses
 * @ngdoc controller
 * @name mmCoursesListCtrl
 */
.controller('mmCoursesListCtrl', function($scope, $mmCourses, $mmCoursesDelegate, $mmUtil, $mmEvents, $mmSite, $q,
            mmCoursesEventMyCoursesUpdated, mmCoreEventSiteUpdated, $mmaMyCoursesGradesQuarter, $mmaMyCoursesGrades) {

    var updateSiteObserver,
        myCoursesObserver;

    $scope.searchEnabled = $mmCourses.isSearchCoursesAvailable() && !$mmCourses.isSearchCoursesDisabledInSite();
    $scope.filter = {};

    // Convenience function to fetch courses.
    function fetchCourses(refresh) {
        //spark
        $mmSite.setCurrentStudentId($mmSite.getUserId());
        return $mmaMyCoursesGrades.getMyGrades(refresh).then(function(e) {
            $scope.courseswithgrades = e;

            return $mmCourses.getUserCourses().then(function(courses) {
                $scope.filter.filterText = ''; // Filter value MUST be set after courses are shown.

                var courseIds = courses.map(function(course) {
                    return course.id;
                });

                return $mmCourses.getCoursesOptions(courseIds).then(function(options) {

                    angular.forEach(courses, function(course) {
                        //course.progress = isNaN(parseInt(course.progress, 10)) ? false : parseInt(course.progress, 10);

                        angular.forEach($scope.courseswithgrades, function(grade) {
                            if(grade.id == course.id) {
                                course.q1 = grade.q1;
                                course.q2 = grade.q2;
                                course.q3 = grade.q3;
                                course.q4 = grade.q4;
                                course.s1 = grade.s1;
                                course.s2 = grade.s2;
                                course.avg = grade.avg;

                                course.progress = grade.progress;
                                course.color = grade.color;
                                if(grade.isscale) {
                                    course.currentAvgShowInPie = grade.lettergrade;
                                }
                                else {
                                    if(grade.isgraded) {
                                        course.currentAvgShowInPie = grade.progress + '%';
                                    }
                                    else {
                                        course.currentAvgShowInPie = grade.lettergrade;
                                    }
                                }
                            }
                        });

                        course.navOptions = options.navOptions[course.id];
                        course.admOptions = options.admOptions[course.id];
                    });
                    $scope.courses = courses;
                });
            }, function(error) {
                $mmUtil.showErrorModalDefault(error, 'mm.courses.errorloadcourses', true);
            });
        });
    }

    fetchCourses().finally(function() {
        $scope.coursesLoaded = true;
    });

    $scope.refreshCourses = function() {
        var promises = [];

        promises.push($mmCourses.invalidateUserCourses());
        promises.push($mmCoursesDelegate.clearAndInvalidateCoursesOptions());

        $q.all(promises).finally(function() {

            fetchCourses(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };

    myCoursesObserver = $mmEvents.on(mmCoursesEventMyCoursesUpdated, function(siteid) {
        if (siteid == $mmSite.getId()) {
            fetchCourses();
        }
    });


    updateSiteObserver = $mmEvents.on(mmCoreEventSiteUpdated, function(siteId) {
        if ($mmSite.getId() === siteId) {
            $scope.searchEnabled = $mmCourses.isSearchCoursesAvailable() && !$mmCourses.isSearchCoursesDisabledInSite();
        }
    });

    $scope.$on('$destroy', function() {
        myCoursesObserver && myCoursesObserver.off && myCoursesObserver.off();
        updateSiteObserver && updateSiteObserver.off && updateSiteObserver.off();
    });
});
