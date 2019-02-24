---
title: Pre-scan | Scanner
description: Pre-scan
menu:
  product_scanner_0.1.0:
    identifier: pre-scan-components
    name: Pre-scan
    parent: components
    weight: 15
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# Pre-scan

When scanner is installed in cluster, it scans all the workloads already running in the cluster. The Pre-scan part performs this task. The whole procedure is as follows:

01. First it lists all running workloads.
02. For each workload item, Pre-scan iterates over all images in workload's PodSpec and performs the following operations.
    - It pulls image manifests.
    - Then it makes a `PostAncestryRequest` and the a `GetAncestryRequest` to Clair using Clair v3 api.
    - For `PostAncestryRequest` Clair analyzes the image and for `GetAncestryRequest` Clair responds with the full featured image nammed `GetAncestryResponse`.
    - It checks the returned image whether the image has any vulnerability with severity higher than the `highest-acceptable-severity` set by user during installing scanner.
    - If do, Pre-scan writes a warning event to the workload saying that **image has vulnerability**.
