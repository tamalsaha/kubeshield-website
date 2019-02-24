---
title: WorkloadReview | Scanner
description: Scanner WorkloadReview API
menu:
  product_scanner_0.1.0:
    identifier: workloadreview-api-components
    name: WorkloadReview
    parent: api-components
    weight: 15
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# WorkloadReview

An `WorkloadReview` is an API resourse for EAS (Extension API Server) implemented in Scanner. Using it, we can see the scan results for any workload running in the cluster. It supports the following types of workloads:

- Deployment
- DaemonSet
- ReplicaSet
- ReplicationController
- StatefulSet
- Pod
- Job
- CronJob
<!-- - Openshift DeploymentConfig -->

It shows the results for each of the images the workload contains.
We have to make a `Get` request for a workload (such as, Deployment) to kubernetes. We just have to provide the workload information (workload name, workload namespace)

## WorkloadReview Object

As with all other Kubernetes objects, an `WorkloadReview` has `apiVersion`, `kind`, and `metadata` fields. It has another field called `response`. Below is an example `WorkloadReview` object.

```yaml
apiVersion: scanner.soter.ac/v1alpha1
kind: WorkloadReview
metadata:
  creationTimestamp: null
  name: labels
  namespace: kube-system
  selfLink: /apis/scanner.soter.ac/v1alpha1/namespaces/kube-system/deployments/labels
response:
  images:
  - features:
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
    name: tigerworks/labels

```

### WorkloadReview.response

This field contains the scan results for a specific workload.

- `WorkloadReview.response.images` is the only field in `WorkloadReview.response`. It is a list of scan results for each image the workoad contains. Each of its items contains,

  - `WorkloadReview.response.images.name` is the name of  an image.
  - `WorkloadReview.response.images.features` is a list of features for an image. For more about features, [this](https://github.com/coreos/clair/blob/master/Documentation/terminology.md) will be helpful.