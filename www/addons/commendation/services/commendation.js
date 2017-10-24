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


angular.module('mm.addons.commendation')

/**
 * Service to handle notifications (messages).
 *
 * @module mm.addons.commendation
 * @ngdoc service
 * @name $mmaCommendation
 */
.factory('$mmaCommendation', function($q, $log, $mmSite, $mmSitesManager, mmaCommendationListLimit) {
    
    $log = $log.getInstance('$mmaCommendation');

    var self = {};

    // Function to format Commendation data.
    function formatCommendationData(commendation) {
        angular.forEach(commendation, function(commendation) {
            // Set message to show.
            if (commendation.contexturl && commendation.contexturl.indexOf('/mod/forum/')) {
                commendation.mobiletext = commendation.smallmessage;
            } else {
                commendation.mobiletext = commendation.fullmessage;
            }

            // Try to set courseid the notification belongs to.
            var cid = commendation.match(/course\/view\.php\?id=([^"]*)/);
            if (cid && cid[1]) {
                commendation.courseid = cid[1];
            }
        });
    }

    /**
     * Get cache key for notification list WS calls.
     *
     * @return {String} Cache key.
     */
    function getCommendationCacheKey() {
        return 'mmaCommendation:list';
    };

    /**
     * Get commendation from site.
     *
     * @module mm.addons.notifications
     * @ngdoc method
     * @name $mmaNotifications#getNotifications
     * @param {Boolean} read       True if should get read notifications, false otherwise.
     * @param {Number} limitFrom   Position of the first notification to get.
     * @param {Number} limitNumber Number of notifications to get.
     * @return {Promise}           Promise resolved with notifications.
     */
    self.getCommendation = function(read, limitFrom, limitNumber) {
        limitFrom = limitFrom || 0;
        limitNumber = limitNumber || mmaCommendationListLimit;

        $log.debug('Get ' + (read ? 'read' : 'unread') + ' commendation from ' + limitFrom + '. Limit: ' + limitNumber);

        var data = {
            useridto: $mmSite.getUserId(),
            useridfrom: 0,
            type: 'commendation',
            read: read ? 1 : 0,
            newestfirst: 1,
            limitfrom: limitFrom,
            limitnum: limitNumber
        };
        var preSets = {
            cacheKey: getCommendationCacheKey()
        };

        // Get unread notifications.
        return $mmSite.read('core_message_get_messages', data, preSets).then(function(response) {
            console.log(response);          

            if (response.res_commendation) {
                var commendation = response;           
                return commendation;
            } else {
                return $q.reject();
            }
        });
    };

    /**
     * Get read notifications from site.
     *
     * @module mm.addons.notifications
     * @ngdoc method
     * @name $mmaNotifications#getReadNotifications
     * @param {Number} limitFrom   Position of the first notification to get.
     * @param {Number} limitNumber Number of notifications to get.
     * @return {Promise}           Promise resolved with notifications.
     
    self.getReadCommendation = function(limitFrom, limitNumber) {
        return self.getCommendation(true, limitFrom, limitNumber);
    };
*/
    /**
     * Get unread notifications from site.
     *
     * @module mm.addons.notifications
     * @ngdoc method
     * @name $mmaNotifications#getUnreadNotifications
     * @param {Number} limitFrom   Position of the first notification to get.
     * @param {Number} limitNumber Number of notifications to get.
     * @return {Promise}           Promise resolved with notifications.
     
    self.getUnreadCommendation = function(limitFrom, limitNumber) {
        return self.getCommendation(false, limitFrom, limitNumber);
    };

    /**
     * Invalidates Commendation list WS calls.
     *
     * @module mm.addons.commendation
     * @ngdoc method
     * @name $mmaNotifications#invalidateNotificationsList
     * @return {Promise} Promise resolved when the list is invalidated.
     */
    self.invalidateCommendationList = function() {
        return $mmSite.invalidateWsCacheForKey(getCommendationCacheKey());
    };

    /**
     * Check if plugin is available.
     *
     * @module mm.addons.notifications
     * @ngdoc method
     * @name $mmaNotifications#isPluginEnabled
     * @return {Boolean} True if plugin is available, false otherwise.
     */
    self.isPluginEnabled = function() {
        return $mmSite.wsAvailable('core_message_get_messages') && !$mmSite.isParentUser;
    };

    /**
     * Check if plugin is available for a certain site.
     *
     * @module mm.addons.notifications
     * @ngdoc method
     * @name $mmaNotifications#isPluginEnabledForSite
     * @param {String} siteid Site ID.
     * @return {Promise}      Resolved when enabled, otherwise rejected.
     */
    self.isPluginEnabledForSite = function(siteid) {
        return $mmSitesManager.getSite(siteid).then(function(site) {
            if (!site.wsAvailable('core_message_get_messages')) {
                return $q.reject();
            }
        });
    };

    return self;
});
