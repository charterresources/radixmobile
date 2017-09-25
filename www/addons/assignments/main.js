angular.module('mm.addons.assignments', ['mm.core'])

    .constant('mmaAssignmentsPriority', 2200)

    .config(function($stateProvider, $mmSideMenuDelegateProvider, mmaAssignmentsPriority) {

        $stateProvider

            .state('site.assignments', {
                url: '/assignments',
                views: {
                    'site': {
                        templateUrl: 'addons/assignments/templates/assignments.html',
                        controller: 'mmaAssignmentsCtrl'
                    }
                },
                params: {
                    id: null
                }
            })
            .state('site.assignment-type', {
                url: '/assignment-type',
                views: {
                    'site': {
                        controller: 'mmaAssignmentCtrl',
                        templateUrl: 'addons/assignments/templates/assignment.html'
                    }
                },
                params: {
                    type: null,
                    id: null
                }
            })
            .state('site.assignments-student', {
                url: '/assignments-student/:id', // We need to add ID to the URL to make ng-href work.
                views: {
                    'site': {
                        controller: 'mmaAssignmentsStudentCtrl',
                        templateUrl: 'addons/assignments/templates/student.html',
                    }
                }
            });

        // Register side menu addon.
        $mmSideMenuDelegateProvider.registerNavHandler('mmaAssignments', '$mmaAssignmentsHandlers.sideMenuNav', mmaAssignmentsPriority);
    })
    .run(function($log) {
        $log = $log.getInstance('mmaAssignments');
    });