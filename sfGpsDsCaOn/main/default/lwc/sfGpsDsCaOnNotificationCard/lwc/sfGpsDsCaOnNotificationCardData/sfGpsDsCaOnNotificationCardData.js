/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - Salesforce Apex import
import getNotificationsByType from "@salesforce/apex/SfGpsDsCaOnNotificationController.getNotificationsByType";
// @ts-ignore - Salesforce Apex import
import { refreshApex } from "@salesforce/apex";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnNotificationCardData";

const NOTIFICATION_TYPE_VALUES = ["action", "reminder", "status"];
const NOTIFICATION_TYPE_DEFAULT = "action";

/**
 * Data-connected Notification Card component for Ontario Design System.
 * Automatically fetches notification counts from Salesforce based on notification type.
 */
export default class SfGpsDsCaOnNotificationCardData extends SfGpsDsLwc {
    static renderMode = "light";

    // @ts-ignore
    @api
    notificationType;
    
    _notificationType = this.defineStringProperty("notificationType", {
        defaultValue: NOTIFICATION_TYPE_DEFAULT,
        validValues: NOTIFICATION_TYPE_VALUES
    });

    // Override properties - if set, these override the values from Apex
    // @ts-ignore
    @api
    headingOverride;
    
    // @ts-ignore
    @api
    descriptionOverride;
    
    // @ts-ignore
    @api
    urlOverride;

    // @ts-ignore
    @api
    className;

    _notificationData = null;
    _error = null;
    _isLoading = true;
    _wiredResult = null;

    /* Wire to fetch notification data */
    // @ts-ignore - LWC wire decorator
    @wire(getNotificationsByType, {
        notificationType: "$_notificationType.value"
    })
    wiredNotifications(result) {
        this._wiredResult = result;
        this._isLoading = false;
        
        if (result.data) {
            this._notificationData = result.data;
            this._error = null;
        } else if (result.error) {
            this._error = result.error.message || "Error loading notifications";
            this._notificationData = null;
        }
    }

    /* Computed Properties */
    get hasError() {
        return Boolean(this._error);
    }

    get hasData() {
        return Boolean(this._notificationData);
    }

    get computedHeading() {
        if (this.headingOverride) {
            return this.headingOverride;
        }
        return this._notificationData?.heading || this.getDefaultHeading();
    }

    get computedDescription() {
        if (this.descriptionOverride) {
            return this.descriptionOverride;
        }
        return this._notificationData?.description || this.getDefaultDescription();
    }

    get computedUrl() {
        if (this.urlOverride) {
            return this.urlOverride;
        }
        return this._notificationData?.url || '#';
    }

    get computedUnreadCount() {
        return this._notificationData?.unreadCount || 0;
    }

    get computedNotificationType() {
        return this._notificationType.value;
    }

    /* Helper methods for defaults */
    getDefaultHeading() {
        const type = this._notificationType.value;
        const headings = {
            action: 'Action required',
            reminder: 'Reminders',
            status: 'Status updates'
        };
        return headings[type] || 'Notifications';
    }

    getDefaultDescription() {
        const type = this._notificationType.value;
        const descriptions = {
            action: 'Check messages that need your attention.',
            reminder: 'View reminder notices for upcoming actions.',
            status: 'View messages about status updates.'
        };
        return descriptions[type] || 'View your notifications.';
    }

    /* Public methods */
    // @ts-ignore
    @api
    refresh() {
        if (this._wiredResult) {
            return refreshApex(this._wiredResult);
        }
        return Promise.resolve();
    }

    /* Lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("caon-scope");
    }
}
