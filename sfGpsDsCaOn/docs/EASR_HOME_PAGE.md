# EASR Home Page - Implementation Guide

This guide explains how to build the Environmental Permissions Platform (EASR) home page using Ontario Design System components in a Salesforce Digital Experience site.

---

## Overview

The EASR home page consists of 5 main sections:

1. **Header** - Application title with navigation
2. **Services** - 4 feature cards for main service navigation
3. **Manage Account** - 5 feature cards for account management
4. **Notifications** - 3 notification cards for user alerts
5. **Related Links** - 3 link cards for external resources

---

## Component Mapping

| Section | Component | Experience Builder Name |
|---------|-----------|------------------------|
| Header | `sfGpsDsCaOnHeaderComm` | Ontario DS Header |
| Services | `sfGpsDsCaOnFeatureCardComm` | Ontario DS Feature Card |
| Manage Account | `sfGpsDsCaOnFeatureCardComm` | Ontario DS Feature Card |
| Notifications | `sfGpsDsCaOnNotificationCardComm` | Ontario DS Notification Card |
| Related Links | `sfGpsDsCaOnLinkCardComm` | Ontario DS Link Card |
| Back to Top | `sfGpsDsCaOnBackToTopComm` | Ontario DS Back To Top |

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Environmental Permissions Platform                       │
│ [Home] [Profile] [Menu]                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ SERVICES                                                         │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ 🖼️ Pre-screening            │ │ 🖼️ Apply or register        │ │
│ │   Find out what permissions │ │   Apply, renew or register  │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ 🖼️ Pre-submission           │ │ 🖼️ Manage permissions       │ │
│ │   Get guidance, prepare...  │ │   Update your applications  │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ MANAGE ACCOUNT                                                   │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ 🖼️ Manage business profile  │ │ 🖼️ Manage payments          │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ 🖼️ Manage site information  │ │ 🖼️ Manage representatives   │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐                                  │
│ │ 🖼️ Manage reporting         │                                  │
│ └─────────────────────────────┘                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ NOTIFICATIONS                                                    │
│ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐│
│ │ ■ Action required │ │ ■ Reminders       │ │ ■ Status updates ││
│ │   Check messages  │ │   View reminder   │ │   View messages  ││
│ │   2 unread        │ │   1 unread        │ │   2 unread       ││
│ └───────────────────┘ └───────────────────┘ └──────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RELATED LINKS                                                    │
│ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐│
│ │ Access            │ │ Source protection │ │ Environmental    ││
│ │ environment       │ │ information atlas │ │ permissions      ││
│ │ Search and view...│ │ Check if a        │ │ Find out more... ││
│ └───────────────────┘ └───────────────────┘ └──────────────────┘│
│                                                                  │
│                                           [↑ Top]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Experience Builder Setup

### 1. Create the Page

1. Go to Experience Builder
2. Create a new page from template or Build Your Own
3. Set page URL path: `/home` or `/`

### 2. Apply Theme Layout

Configure the theme to include Ontario DS styles:
- Add `sfGpsDsCaOnGlobalStyles` static resource to head
- Configure header with Ontario DS Header component

### 3. Add Sections

Create the following layout regions:
- **2-column grid** for Services (2x2)
- **2-column grid** for Manage Account (2+2+1)
- **3-column grid** for Notifications
- **3-column grid** for Related Links

---

## Component Configuration

**IMPORTANT**: When configuring components in Experience Builder, use the full static resource URL path. Replace `/YOUR_SITE_PATH` with your actual site URL prefix (e.g., `/EASR`).

> **Note**: Visualforce merge fields like `{!$Resource.sfGpsDsCaOnGlobalStyles}` do NOT work in LWR Experience Builder property panels.

### Image Setup

The `sfGpsDsCaOnGlobalStyles` static resource does **not** include service images by default. You have several options:

1. **Add images to the static resource**: Create an `images/services/` folder in the static resource and add your images:
   - Path format: `/YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/images/services/pre-screening.jpg`
   - You'll need to redeploy the static resource after adding images

2. **Use Salesforce CMS**: Upload images to CMS and reference them via CMS URLs

3. **Use external URLs**: Reference publicly accessible images hosted elsewhere

The examples below use option 1 with placeholder paths. Update these to match your actual image locations.

### Services Section

| Property | Value |
|----------|-------|
| **Heading** | Pre-screening |
| **Description** | Find out what environmental permissions you or your business requires. |
| **URL** | /pre-screening |
| **Image** | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/images/services/pre-screening.jpg |
| **Heading Level** | h2 |

| Property | Value |
|----------|-------|
| **Heading** | Apply or register |
| **Description** | Apply, renew or register for environmental permissions. |
| **URL** | /apply-register |
| **Image** | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/images/services/apply.jpg |
| **Heading Level** | h2 |

| Property | Value |
|----------|-------|
| **Heading** | Pre-submission |
| **Description** | Get guidance, prepare your documents, and receive a pre-submission clearance number. |
| **URL** | /pre-submission |
| **Image** | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/images/services/pre-submission.jpg |
| **Heading Level** | h2 |

| Property | Value |
|----------|-------|
| **Heading** | Manage permissions |
| **Description** | Update your applications and registrations, assign representatives and request removals. |
| **URL** | /manage-permissions |
| **Image** | /YOUR_SITE_PATH/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/images/services/manage.jpg |
| **Heading Level** | h2 |

### Notifications Section

You have two options for displaying notifications:

#### Option A: Data-Connected (Recommended)

Use the **Ontario DS Notification Card (Data Connected)** component for automatic notification counts from Salesforce.

| Property | Value |
|----------|-------|
| **Notification Type** | action |
| **Heading Override** | (optional - leave empty for default) |
| **Description Override** | (optional - leave empty for default) |
| **URL Override** | /notifications?type=action |

| Property | Value |
|----------|-------|
| **Notification Type** | reminder |
| **URL Override** | /notifications?type=reminder |

| Property | Value |
|----------|-------|
| **Notification Type** | status |
| **URL Override** | /notifications?type=status |

The data-connected component automatically queries Salesforce Tasks:
- **action**: High-priority Tasks (`Priority = 'High'`) that are due today or overdue
- **reminder**: Tasks due within the next 7 days
- **status**: Tasks updated in the last 24 hours by someone other than the current user

To customize the data source, modify the `SfGpsDsCaOnNotificationController` Apex class.

#### Option B: Static Configuration

Use the **Ontario DS Notification Card** component with manually configured values.

| Property | Value |
|----------|-------|
| **Heading** | Action required |
| **Description** | Check messages that need your attention, including profile linkage requests, requests for more information or additional fees. |
| **Notification Type** | action |
| **Unread Count** | 2 |
| **URL** | /notifications?type=action |

| Property | Value |
|----------|-------|
| **Heading** | Reminders |
| **Description** | View reminder notices for upcoming actions you may need to take, such as renewals, reporting requirements and more. |
| **Notification Type** | reminder |
| **Unread Count** | 1 |
| **URL** | /notifications?type=reminder |

| Property | Value |
|----------|-------|
| **Heading** | Status updates |
| **Description** | View messages about updates to the status of your application or registration. |
| **Notification Type** | status |
| **Unread Count** | 2 |
| **URL** | /notifications?type=status |

### Related Links Section

Use the **Ontario DS Link Card** component for each external link.

| Property | Value |
|----------|-------|
| **Heading** | Access environment |
| **Description** | Search and view detailed information about environmental permissions across Ontario. |
| **URL** | https://access.environment.ontario.ca |
| **Is External** | true |

| Property | Value |
|----------|-------|
| **Heading** | Source protection information atlas |
| **Description** | Check if a specific location in Ontario falls within a source protection vulnerable area. |
| **URL** | https://www.ontario.ca/page/source-protection |
| **Is External** | true |

| Property | Value |
|----------|-------|
| **Heading** | Environmental permissions |
| **Description** | Find out more information about different types of environmental permissions. |
| **URL** | https://www.ontario.ca/page/environmental-permissions |
| **Is External** | true |

---

## CSS Grid Layout

Add custom CSS for grid layouts:

```css
/* Services section - 2 column grid */
.easr-services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Notifications/Related Links - 3 column grid */
.easr-three-column-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Responsive - stack on mobile */
@media (max-width: 768px) {
  .easr-services-grid,
  .easr-three-column-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Dynamic Data Integration

### Notification Counts

The **Ontario DS Notification Card (Data Connected)** component uses the `SfGpsDsCaOnNotificationController` Apex class to fetch notification counts. By default, it queries Tasks:

```apex
// Located in: sfGpsDsCaOn/main/default/classes/SfGpsDsCaOnNotificationController.cls

// Action: High-priority Tasks due today or overdue
SELECT COUNT() FROM Task 
WHERE OwnerId = :userId AND IsClosed = false 
AND Priority = 'High' AND ActivityDate <= TODAY

// Reminder: Tasks due within the next 7 days
SELECT COUNT() FROM Task 
WHERE OwnerId = :userId AND IsClosed = false 
AND ActivityDate >= :today AND ActivityDate <= :nextWeek

// Status: Tasks updated in last 24 hours by others
SELECT COUNT() FROM Task 
WHERE OwnerId = :userId 
AND LastModifiedDate >= :last24Hours 
AND LastModifiedById != :userId
```

To customize the data source (e.g., add Cases or custom objects), modify the `SfGpsDsCaOnNotificationController` class.

---

## Accessibility Considerations

1. **Heading Hierarchy**: Use `h2` for section headings, `h3` for card headings within sections
2. **Link Purpose**: All cards have descriptive text explaining the destination
3. **External Links**: Show external link icon and open in new tab with `rel="noopener noreferrer"`
4. **Focus Management**: All interactive elements receive visible focus indicators
5. **Screen Reader**: Cards include `role="article"` for semantic structure

---

## Related Documentation

- [COMPONENT_API.md](./COMPONENT_API.md) - Component API reference
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
