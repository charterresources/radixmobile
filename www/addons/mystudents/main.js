angular.module('mm.addons.mystudents', ['mm.core'])

    .constant('mmaMyStudentsPriority', 2300)

    .config(function($stateProvider, $mmSideMenuDelegateProvider, mmaMyStudentsPriority) {

        $stateProvider

            .state('site.mystudents', {
                url: '/mystudents',
                views: {
                    'site': {
                        templateUrl: 'addons/mystudents/templates/mystudents.html',
                        controller: 'mmaMyStudentsListCtrl'
                    }
                }
            });

        // Register side menu addon.
        $mmSideMenuDelegateProvider.registerNavHandler('mmaMyStudents', '$mmaMyStudentsHandlers.sideMenuNav', mmaMyStudentsPriority);
    })
    .run(function($log) {
        $log = $log.getInstance('mmaMyStudents');
    });