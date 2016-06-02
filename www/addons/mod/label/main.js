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

angular.module('mm.addons.mod_label', ['mm.core'])

.config(function($stateProvider) {

    $stateProvider
    .state('site.mod_label', {
        url: '/mod_label',
        params: {
            description: null
        },
        views: {
            'site': {
<<<<<<< HEAD
                templateUrl: 'addons/mod_label/templates/index.html',
=======
                templateUrl: 'addons/mod/label/templates/index.html',
>>>>>>> v3.1.0
                controller: 'mmaModLabelIndexCtrl'
            }
        }
    });

})

<<<<<<< HEAD
.config(function($mmCourseDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModLabel', 'label', '$mmaModLabelCourseContentHandler');
=======
.config(function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModLabel', 'label', '$mmaModLabelHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModLabel', '$mmaModLabelHandlers.linksHandler');
>>>>>>> v3.1.0
});
