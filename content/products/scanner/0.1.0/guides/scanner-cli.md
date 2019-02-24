---
title: Scanner CLI | Scanner
description: Scanner CLI Guide
menu:
  product_scanner_0.1.0:
    identifier: scanner-cli-guides
    name: Scanner CLI
    parent: guides
    weight: 25
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: guides
---

> New to Scanner? Please start [here](/products/scanner/0.1.0/concepts/README).

# Scanner CLI Guide

This tutorial will show you how to use scanner-cli. Using `scanner-cli scan` command you can scan any image and any workload running in the cluster.

## Objectives

- Scan any image
- Scan any running workload

## Before you begin

- You must need Scanner to be run along with Clair. You can find procedures for it [here](/products/scanner/0.1.0/setup/install).
- You also need `scanner-cli` binary to be installed.

Once everything is set up, we are ready to go forward.

## Usage of Scanner CLI

### Scan Image

You can see what are inside of your image by running `scanner-cli scan` command following `"image"` as first argument. The output is an `ImageReview` object. You just need to provide the image name as the second argument.

To scan a private image you need to provide the secret information.

- `--namespace` is the secret namespace.
- `--secrets` contains the secret name for image to be scanned.

If the image has vulnerabilities, they will be listed in `response.features` field. Otherwise `response.features` will be `{}` (empty).

For example scan a public image:

```console
scanner-cli scan image nginx
```

Output is shown in [here](/products/scanner/0.1.0/examples/scan-results/public_image_output.json)

### Scan Workloads

You can see what are inside of your workloads by running `scanner-cli scan` command following the workload type as first argument.

- Use `"pods"` for Pod
- Use `"deployments"` for Deployment
- Use `"daemonsets"` for DaemonSet
- Use `"replicasets"` for ReplicaSet
- Use `"replicationcontrollers"` for ReplicationController
- Use `"statefulsets"` for StatefulSet
- Use `"jobs"` for Job
- Use `"cronjobs"` for CronJob

The output is a `WorkloadReview` object. You just need to provide the workload name as the second argument and the namespace as `--namespace` flag.

For example, scan a deployment:

 ```console
scanner-cli scan deployments kube-dns --namespace kube-system
 ```

Output is shown in [here](/products/scanner/0.1.0/examples/scan-results/deployment_output.json)
