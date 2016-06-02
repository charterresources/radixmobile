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

angular.module('mm.addons.mod_folder', ['mm.core'])

.constant('mmaModFolderComponent', 'mmaModFolder')

.config(function($stateProvider) {

    $stateProvider

    .state('site.mod_folder', {
      url: '/mod_folder',
      params: {
        module: null,
        courseid: null,
        sectionid: null,
        path: null // For subfolders. Use the path instead of a boolean so Angular detects them as different states.
      },
      views: {
        'site': {
          controller: 'mmaModFolderIndexCtrl',
<<<<<<< HEAD
          templateUrl: 'addons/mod_folder/templates/index.html'
=======
          templateUrl: 'addons/mod/folder/templates/index.html'
>>>>>>> v3.1.0
        }
      }
    });

})

<<<<<<< HEAD
.config(function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModFolder', 'folder', '$mmaModFolderCourseContentHandler');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModFolder', 'folder', '$mmaModFolderPrefetchHandler');
=======
.config(function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModFolder', 'folder', '$mmaModFolderHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModFolder', 'folder', '$mmaModFolderPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModFolder', '$mmaModFolderHandlers.linksHandler');
>>>>>>> v3.1.0
});
