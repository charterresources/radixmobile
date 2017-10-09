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
 * Controller to handle courses grades (side menu option).
 *
 * @module mm.addons.mygrades
 * @ngdoc controller
 * @name mmaMyGradesCoursesGradesCtrl
 */
.controller('mmaMyGradesCoursesGradesCtrl', function($scope, $mmSite, $ionicTabsDelegate, $stateParams, $log,
                                                     $mmaMyCoursesGrades, $mmaMyStudents, $q, $ionicScrollDelegate, $mmUtil) {

    $log = $log.getInstance('mmaMyGradesCoursesGradesCtrl');
    var scrollView = $ionicScrollDelegate.$getByHandle('mmaMyGradesCoursesGradesListScroll');
    $scope.students = [];
    $scope.currentStudent = null;
    $scope.mygradescoursesgrades = null;
    $scope.studentsLoaded = false;
    $scope.isparentuser = $mmSite.getInfo().isparentuser;

    $scope.setCurrentStudentById = function(studentId) {
        for (var i = 0; i < $scope.students.length; i++) {
            if ($scope.students[i].id === studentId) {
                $scope.currentStudent = $scope.students[i];
                if(!$mmSite.currentStudentIdForParent || $mmSite.currentStudentIdForParent !== studentId) {
                    $mmSite.setCurrentStudentId(studentId);
                }
                break;
            }
        }
        $scope.refreshMyGradesCoursesGrades();
    }

    $scope.mygradescoursesgradesToLoad = 1;

    $scope.isCurrent = function(studentId){
        return studentId === $mmSite.currentStudentIdForParent;
    }

    var getStudents = function() {
        return $mmaMyStudents.getMyStudents().then(function(students) {
            $scope.students = students;
        }).finally(function() {
            if($stateParams.sid) {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($stateParams.sid);
                }
            }
            else {
                if($scope.students.length > 0) {
                    $scope.setCurrentStudentById($scope.students[0].id);
                }
            }
        });
    };

    // Convenience function that fetches the mygradescoursesgrades and updates the scope.
    function fetchMyGradesCoursesGrades(refresh) {
        return  $mmaMyCoursesGrades.getMyGrades(refresh).then(function(e) {
            $scope.mygradescoursesgrades=e;
        }, function(error) {
            $mmUtil.showErrorModalDefault(error, 'mma.grades.nogradesreturned', true);
        }).finally(function () {
            // Resize the scroll view so infinite loading is able to calculate if it should load more items or not.
            scrollView.resize();
        });
    };

    // Pull to refresh.
    $scope.refreshMyGradesCoursesGrades = function() {
        var promises = [];
        promises.push($mmaMyCoursesGrades.invalidateMyCoursesGradesData());

        return $q.all(promises).finally(function() {
            return fetchMyGradesCoursesGrades(true);
        });
    };

    getStudents().then(function() {
        // Get first assignments.
        fetchMyGradesCoursesGrades().then(function() {
            $scope.mygradescoursesgradesToLoaded = true;
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });
});