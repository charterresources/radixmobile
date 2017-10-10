angular.module('mm.addons.assignments', ['mm.core'])

    .constant('mmaAssignmentsPriority', 960)

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
            });

        // Register side menu addon.
        $mmSideMenuDelegateProvider.registerNavHandler('mmaAssignments', '$mmaAssignmentsHandlers.sideMenuNav', mmaAssignmentsPriority);
    })
    .run(function($log) {
        $log = $log.getInstance('mmaAssignments');
    });