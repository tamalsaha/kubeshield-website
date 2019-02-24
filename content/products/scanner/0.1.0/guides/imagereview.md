---
title: ImageReview | Scanner
description: ImageReview Guide
menu:
  product_scanner_0.1.0:
    identifier: imagereview-guides
    name: ImageReview
    parent: guides
    weight: 15
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: guides
---

> New to Scanner? Please start [here](/products/scanner/0.1.0/concepts/README).

# ImageReview Guide

This tutorial will show you how to use [ImageReview](/products/scanner/0.1.0/concepts/components/api/imagereview). Using it you can scan an image (public and private both) and see the scan results.

We have implemented a `rest.Creater` and a `rest.GetterWithOptions` interface to meet our needs.

## Objectives

- Create an `ImageReview` object to scan an image.
- Get `ImageReview` object to see scan results.

## Before you begin

You must need Scanner to be run along with Clair. You can find procedures for it [here](/products/scanner/0.1.0/setup/install).

Now you are ready to go forward.

## Usage of ImageReview

### Create

To scan an image, create an `ImageReview` object. You just need to provide image name. For private image, secret name and namespace will be needed.

[test_imagereview.yaml](docs/examples/image-review/test_imagereview.yaml), is an example.

```yaml
apiVersion: scanner.soter.ac/v1alpha1
kind: ImageReview
metadata:
  name: test
request:
   image: nginx
```

Run:

```console
$ kubectl create -f docs/examples/image-review/test_imagereview.yaml
imagereview.scanner.soter.ac "test" created
```

Here Scanner doesn't store the object. By making this request, Scanner pulls the image manifests and sends it to Clair to analyze.

### Get

To see the scan result, we have to make a `Get` request to kubernetes. Since the ImageReview object isn't stored during `Create` request, we have to provide a `runtime.Object` as `getOption` containing the information (image name, secret namespace and secret names) about the image. By making this request, Scanner outputs the scan results of the analyzed image.

As `kubectl` CLI doesn't support to pass a `runtime.Object` in `kubectl get` command. So, we developed a CLI named [scanner-cli](/products/scanner/0.1.0/guides/scanner-cli#Scan-Image) for it.

## Next

- See [how to use WorkloadRevie](/products/scanner/0.1.0/guides/workloadreview)
- See [how to use scanner-cli](/products/scanner/0.1.0/guides/scanner-cli)