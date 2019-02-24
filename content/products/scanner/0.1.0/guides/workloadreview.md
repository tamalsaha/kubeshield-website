---
title: WorkloadReview | Scanner
description: WorkloadReview Guide
menu:
  product_scanner_0.1.0:
    identifier: workloadreview-guides
    name: WorkloadReview
    parent: guides
    weight: 20
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: guides
---

> New to Scanner? Please start [here](/products/scanner/0.1.0/concepts/README).

# WorkloadReview Guide

This tutorial will show you how to use [WorkloadReview](/products/scanner/0.1.0/concepts/components/api/workloadreview). Using it you can scan any workload running in the cluster. The supported workloads are,

- Pod
- Deployment
- DaemonSet
- ReplicaSet
- ReplicationController
- StatefulSet
- Job
- CronJob

We have implemented a `rest.Getter` interface for each of the above workload kind to meet our needs.

## Objectives

Use `WorkloadReview` for any kind of supported workload running in the cluster to see what they contain inside their images.

## Before you begin

You must need Scanner to be run along with Clair. You can find procedures for it [here](/products/scanner/0.1.0/setup/install).

Now you are ready to go forward.

## Usage of WorkloadReview

You can use it for any kind of supported workload those are already running in the cluster. For example, here we have shown only for Deployment.

The output is a `WorkloadReview` object.

Run:

```console
$ kubectl get deployments kube-dns --namespace=kube-system
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kube-dns   1         1         1            1           23h
```

Here, kubernetes doesn't forward the get request to the EAS (Extension API Server) of Scanner. But we want it.

Run:

```console
$ kubectl get deployments kube-dns --namespace=kube-system -o json | jq '.metadata.selfLink'
"/apis/extensions/v1beta1/namespaces/kube-system/deployments/kube-dns"
```

Now just change this path to `"/apis/scanner.soter.ac/v1alpha1/namespaces/kube-system/deployments/kube-dns"` and use it as `--raw` flag in `kubectl get` command.

Run:

```console
kubectl get --raw="/apis/scanner.soter.ac/v1alpha1/namespaces/kube-system/deployments/kube-dns" | jq
```

The `jq` is used to present the output in standard json format in stdout.

Output:

```json
{
  "kind": "WorkloadReview",
  "apiVersion": "scanner.soter.ac/v1alpha1",
  "metadata": {
    "name": "kube-dns",
    "namespace": "kube-system",
    "selfLink": "/apis/scanner.soter.ac/v1alpha1/namespaces/kube-system/deployments/kube-dns",
    "creationTimestamp": null
  },
  "response": {
    "images": [
      {
        "name": "k8s.gcr.io/k8s-dns-dnsmasq-nanny-amd64:1.14.8",
        "features": [
          {
            "Name": "busybox",
            "NamespaceName": "alpine:v3.6",
            "Version": "1.26.2-r9"
          },
          {
            "Name": "alpine-keys",
            "NamespaceName": "alpine:v3.6",
            "Version": "2.1-r1"
          },
          {
            "Name": "apk-tools",
            "NamespaceName": "alpine:v3.6",
            "Version": "2.7.4-r0"
          },
          {
            "Name": "scanelf",
            "NamespaceName": "alpine:v3.6",
            "Version": "1.2.2-r0"
          },
          {
            "Name": "alpine-baselayout",
            "NamespaceName": "alpine:v3.6",
            "Version": "3.0.4-r0"
          },
          {
            "Name": "libc-utils",
            "NamespaceName": "alpine:v3.6",
            "Version": "0.7.1-r0"
          },
          {
            "Name": "musl",
            "NamespaceName": "alpine:v3.6",
            "Version": "1.1.16-r14"
          },
          {
            "Name": "zlib",
            "NamespaceName": "alpine:v3.6",
            "Version": "1.2.11-r0"
          },
          {
            "Name": "libressl2.5-libcrypto",
            "NamespaceName": "alpine:v3.6",
            "Version": "2.5.5-r0"
          },
          {
            "Name": "musl-utils",
            "NamespaceName": "alpine:v3.6",
            "Version": "1.1.16-r14"
          },
          {
            "Name": "libressl2.5-libssl",
            "NamespaceName": "alpine:v3.6",
            "Version": "2.5.5-r0"
          }
        ]
      },
      {
        "name": "k8s.gcr.io/k8s-dns-kube-dns-amd64:1.14.8",
        "features": [
          {
            "Name": "alpine-keys",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.1-r1"
          },
          {
            "Name": "alpine-baselayout",
            "NamespaceName": "alpine:v3.7",
            "Version": "3.0.5-r2"
          },
          {
            "Name": "musl-utils",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.1.18-r2"
          },
          {
            "Name": "scanelf",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.2.2-r1"
          },
          {
            "Name": "libressl2.6-libssl",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.6.3-r0"
          },
          {
            "Name": "apk-tools",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.8.1-r1"
          },
          {
            "Name": "libc-utils",
            "NamespaceName": "alpine:v3.7",
            "Version": "0.7.1-r0"
          },
          {
            "Name": "busybox",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.27.2-r6"
          },
          {
            "Name": "musl",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.1.18-r2"
          },
          {
            "Name": "zlib",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.2.11-r1"
          },
          {
            "Name": "libressl2.6-libcrypto",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.6.3-r0"
          }
        ]
      },
      {
        "name": "k8s.gcr.io/k8s-dns-sidecar-amd64:1.14.8",
        "features": [
          {
            "Name": "musl",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.1.18-r2"
          },
          {
            "Name": "musl-utils",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.1.18-r2"
          },
          {
            "Name": "libressl2.6-libcrypto",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.6.3-r0"
          },
          {
            "Name": "scanelf",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.2.2-r1"
          },
          {
            "Name": "libc-utils",
            "NamespaceName": "alpine:v3.7",
            "Version": "0.7.1-r0"
          },
          {
            "Name": "busybox",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.27.2-r6"
          },
          {
            "Name": "zlib",
            "NamespaceName": "alpine:v3.7",
            "Version": "1.2.11-r1"
          },
          {
            "Name": "libressl2.6-libssl",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.6.3-r0"
          },
          {
            "Name": "apk-tools",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.8.1-r1"
          },
          {
            "Name": "alpine-keys",
            "NamespaceName": "alpine:v3.7",
            "Version": "2.1-r1"
          },
          {
            "Name": "alpine-baselayout",
            "NamespaceName": "alpine:v3.7",
            "Version": "3.0.5-r2"
          }
        ]
      }
    ]
  }
}
```

You can see the other workloads in same way.

You can see the same thing using [scanner-cli](/products/scanner/0.1.0/guides/scanner-cli#Scan-Workloads)

## Next

- See [how to use scanner-cli](/products/scanner/0.1.0/guides/scanner-cli)