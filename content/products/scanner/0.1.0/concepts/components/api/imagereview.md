---
title: ImageReview | Scanner
description: Scanner ImageReview API
menu:
  product_scanner_0.1.0:
    identifier: imagereview-api-components
    name: ImageReview
    parent: api-components
    weight: 10
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# ImageReview

An `ImageReview` is an API resourse for EAS (Extension API Server) implemented in Scanner. Using it we can both scan an image and see the scan results.

- To scan an image, we have to make a `Create` request for an ImageReview object to kubernetes. We just need to provide image information (image name, secret namespace and secret names). Here Scanner doesn't store the object. By making this request, Scanner pulls the image manifests and sends it to Clair to analyze.
- To see the scan result, we have to make a `Get` request for ImageReview object to kubernetes. Since the ImageReview object isn't stored during `Create` request, we have to provide a `runtime.Object` as `getOption` containing the information (image name, secret namespace and secret names) about the image. By making this request, Scanner outputs the scan results of the analyzed image.

## ImageReview Object

As with all other Kubernetes objects, an ImageReview has `apiVersion`, `kind`, and `metadata` fields. It has two other fields `request` and `response`. Below is an example ImageReview object.

```yaml
apiVersion: scanner.soter.ac/v1alpha1
kind: ImageReview
metadata:
  creationTimestamp: null
  name: ignores
  selfLink: /apis/scanner.soter.ac/v1alpha1/imagereviews/ignores
request:
  image: tigerworks/labels
  namespace: default
  imagePullSecrets:
  - my-secret
response:
  features:
  - Name: apk-tools
    NamespaceName: alpine:v3.6
    Version: 2.7.2-r0
  - Name: scanelf
    NamespaceName: alpine:v3.6
    Version: 1.2.2-r0
  - Name: zlib
    NamespaceName: alpine:v3.6
    Version: 1.2.11-r0
  - Name: alpine-baselayout
    NamespaceName: alpine:v3.6
    Version: 3.0.4-r0
  - Name: libressl2.5-libcrypto
    NamespaceName: alpine:v3.6
    Version: 2.5.4-r0
  - Name: libressl2.5-libssl
    NamespaceName: alpine:v3.6
    Version: 2.5.4-r0
  - Name: alpine-keys
    NamespaceName: alpine:v3.6
    Version: 2.1-r1
  - Name: libc-utils
    NamespaceName: alpine:v3.6
    Version: 0.7.1-r0
  - Name: musl
    NamespaceName: alpine:v3.6
    Version: 1.1.16-r10
    vulnerabilities:
    - FixedBy: 1.1.16-r14
      Link: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-15650
      Name: CVE-2017-15650
      NamespaceName: alpine:v3.6
      Severity: Medium
      featureName: musl
  - Name: musl-utils
    NamespaceName: alpine:v3.6
    Version: 1.1.16-r10
  - Name: busybox
    NamespaceName: alpine:v3.6
    Version: 1.26.2-r5
    vulnerabilities:
    - FixedBy: 1.26.2-r9
      Link: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-15873
      Name: CVE-2017-15873
      NamespaceName: alpine:v3.6
      Severity: Medium
      featureName: busybox
    - FixedBy: 1.26.2-r9
      Link: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-16544
      Name: CVE-2017-16544
      NamespaceName: alpine:v3.6
      Severity: Medium
      featureName: busybox
```

### ImageReview.request

This field is required when we want to scan an image. We only need to provide the image name. If the image is private then we also need to provide necessary secrets along with namespace. Here is the information about what it contains.

- `ImageReview.request.image` is the name of the image we want to scan.
- `ImageReview.request.namespace` is the namespace for secrets listed in `ImageReview.request.imagePullSecrets`.
- `ImageReview.request.imagePullSecrets` is list of secret names.

The last two are needed if the image is private.

### ImageReview.response

We have to do nothing for this field. Because this field is auto filled when we want to see the scan result for an image.

- `ImageReview.response.features` is the only field in `ImageReview.response`. It is a list of features. For more about features, [this](https://github.com/coreos/clair/blob/master/Documentation/terminology.md) will be helpful.