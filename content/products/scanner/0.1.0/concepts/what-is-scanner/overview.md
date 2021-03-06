---
title: Scanner Overview
description: Scanner Overview
menu:
  product_scanner_0.1.0:
    identifier: overview-concepts
    name: Overview
    parent: what-is-scanner
    weight: 10
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# Scanner

Scanner by AppsCode is a Docker image scanner. It uses [Clair](https://github.com/coreos/clair) for the static analysis of vulnerabilities in Docker containers. Using Scanner, you can allow or reject following types of workloads to be run in cluster:

- Deployment
- DaemonSet
- ReplicaSet
- ReplicationController
- StatefulSet
- Pod
- Job
- CronJob
- Openshift DeploymentConfig

## Problems

First look at the following picture.
<p align="center">
  <img src="/products/scanner/0.1.0/images/traditional-deployment.png">
</p>

So this is how deployments used to look like. It has an ops team managing the operating system and a known set of dependencies on top of which applications are developed by developers. The responsibilities are well defined. So everything is smooth and easy. But let me think of a scenario here.

08:00 a.m.: Some developers have asked the ops to upgrade Python.
08:30 a.m.: the ops has noticed that their prod went down.
09:00 a.m.: Everything is back. Python has been rolled back.
10.00 a.m.: Another team request the bleeding edge version of java released just 12 hours ago.

Here, containers coped with that situation. So ops has installed container runtime on their machines and asked the developers to package applications into containers along with all their dependencies. Then every developer can get their very own dependencies with their very own versions regardless of the other developers and regardless of the ops team.

Though containers should be quite small, in pracitce they tend to be gigantic. This is because the base image (Ubuntu or CentOs or Debian) is used.
<p align="center">
  <img src="/products/scanner/0.1.0/images/containers-may-be-gigantic.png">
</p>

Eventually when more and more containers are created no one is sure anymore of what is actually shipping and running in prod. In practice this is look like,
<p align="center">
  <img src="/products/scanner/0.1.0/images/in-practice-what-is-running-in-container.png">
</p>

But there are some spooky things out there as well. Like,
- [CVE-2015-0235 aka Ghost](https://nvd.nist.gov/vuln/detail/CVE-2015-0235) is a **buffer overflow** bug affecting the `gethostbyname()` and `gethostbyname2()` function calls in the glibc library. This vulnerability allows a remote attacker that is able to make an application call to either of these functions to execute arbitrary code with the permissions of the user running the application.
- [CVE-2014-0160 aka Heartbleed](https://nvd.nist.gov/vuln/detail/CVE-2014-0160) is a vernerability that affects some implementation of Openssl and may lead too a private key leakage for instance. It allows attackers to steal information. For more info, you can go [here](http://heartbleed.com/).

There are thousands of vernerabilities listed on the National Vulnerability Database (NVD). As we just show you, some of them have become so famous that they have got their own brand, they have a logo and they have a name.

So, we can say that we have a lot of containers running in prod and nobody really knows what's running in them. Therefore, we have a lot of vernerabilties are waiting to exploited and leading to disasters. We need to stop/reject those containers which have vulnerabilities.

## What does scanner

Here scanner comes to solve the problems described above.

- It checks the containers of workloads for vulnerabilities and can reject or allow containers to be run.
- It writes a warning event for running workloads with vulnerable images.
- It supports CLI to view the scan results (features of packages used in images along with vulnerabilities) for any image and running workloads.

## How scanner works

To understand how scanner works in kubernetes cluster, clair needs to be run along with scanner. Once clair is run, then scanner is ready to work.The following diagram represents the architecture of scanner. It shows how scanner works in the kubernetes cluster.

<p align="center"><img width="500" height="300" src="/products/scanner/0.1.0/images/scanner-architecture.png"></p>

Here, scanner has following four components,
01. Webhook (validation)
02. Pre-scan
03. Notification
04. API (ImageReview, WorkloadReview)

Now we will describe how each component works.

- See how Webhook works [here](/products/scanner/0.1.0/concepts/components/webhook)
- See how Pre-scan works [here](/products/scanner/0.1.0/concepts/components/pre-scan)
- See how Notification works [here](/products/scanner/0.1.0/concepts/components/notification)
- See how ImageReview works [here](/products/scanner/0.1.0/concepts/components/api/imagereview)
- See how WorkloadReview works [here](/products/scanner/0.1.0/concepts/components/api/workloadreview)
