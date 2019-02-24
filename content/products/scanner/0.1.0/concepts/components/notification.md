---
title: Notifications | Scanner
description: Notifications
menu:
  product_scanner_0.1.0:
    identifier: notifications-components
    name: Notifications
    parent: components
    weight: 20
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# Notifications

Notifications are an extensible component of Clair. Using it, Clair can inform an endpoint about the changes to tracked vulnerabiities. For more information, visit [here](https://github.com/coreos/clair/blob/master/Documentation/notifications.md).

In our case, the notification endpoint is the address of EAS (Extension Api Server) of Scanner following the path `/clair`.

When changes occur in tracked vulnerabilities, Clair notifies the endpoint. For example, when a new vulnerability has been found in a layer (Clair v2) or an image (Clair v3). Clair does this through a `POST` request with a `json` body having the notification name.

```json
{
  "Notification": {
    "Name": "6e4ad270-4957-4242-b5ad-dad851379573"
  }
}
```

## How to deal with noticifacations

After getting a notification, we have to read it's data and mark it as read using Clair's api. Here, we have used Cliar v3 api to deal with notifications.

### Reading notification data

To read the notification data, we have to make a `GetNotificationRequest` to Clair. Then Clair responses with `GetNotificationResponse`.

```go
type GetNotificationRequest struct {
	// if the vulnerability_page is empty, it implies the first page.
	OldVulnerabilityPage string
	NewVulnerabilityPage string
	Limit                int32
	Name                 string
}

type GetNotificationResponse struct {
	Notification *Notification
}

type Notification struct {
	Name     string
	Created  string
	Notified string
	Deleted  string
	Old      *PagedVulnerableAncestries
	New      *PagedVulnerableAncestries
}

type PagedVulnerableAncestries struct {
	CurrentPage string
	// if next_page is empty, it signals the end of all pages.
	NextPage      string
	Limit         int32
	Vulnerability *Vulnerability
	Ancestries    []*IndexedAncestryName
}

type IndexedAncestryName struct {
	// index is unique to name in all streams simultaneously streamed, increasing
	// and larger than all indexes in previous page in same stream.
	Index int32
	Name  string
}

type Vulnerability struct {
	Name          string
	NamespaceName string
	Description   string
	Link          string
	Severity      string
	Metadata      string
	// fixed_by exists when vulnerability is under feature.
	FixedBy string
	// affected_versions exists when vulnerability is under notification.
	AffectedVersions []*Feature
}

type Feature struct {
	Name          string
	NamespaceName string
	Version       string
	// version_format is the format used by installer package manager to store
	// package versions.
	VersionFormat   string
	Vulnerabilities []*Vulnerability
}
```

> **Note:** Notification data can require pagination.

Let's take look at some important points.

- The new and old vulnerabilities help users to differintiate the two in order to determine what exactly has changes in the Vulnerability database.
- When we request for notification data, Clair sends two tokens. These are for the next page of `Notification.Old` and `Notification.New` respectively. New next page tokens are provided on every query until we reach the last page. We are expected to stream process these results as they page through the Notification. After we have processed all of the results, we can mark the notification as read.
- The `PagedVulnerableAncestries.IndexedAncestryName` contains the SHA256 of the affected image's manifest and an integer that can be used to sort results. The index can act as a checkpoint as we processe the stream of results from the notification. If we have reached 500, we are guaranteed to never see an image with an index of less than 500.

While reading data, Scanner iterates over the list of affected images and writes a warning event to all workloads those have any of these images saying **"image has vulnerability"**.

### Marking notification

Once we have processed all of the data for a notification, we can mark the notification as read by making a `MarkNotificationAsReadRequest` to Clair. Then Clair marks (actually delete) that notification.

```go
type MarkNotificationAsReadRequest struct {
	Name string
}
```