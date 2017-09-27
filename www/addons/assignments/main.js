angular.module('mm.addons.assignments', ['mm.core'])

    .constant('mmaAssignmentsPriority', 1000)

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
                    sid: null
                }
            })
            .state('site.assignment-type', {
                url: '/assignment-type/:type/:id',
                views: {
                    'site': {
                        controller: 'mmaAssignmentCtrl',
                        templateUrl: 'addons/assignments/templates/assignment.html'
                    }
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