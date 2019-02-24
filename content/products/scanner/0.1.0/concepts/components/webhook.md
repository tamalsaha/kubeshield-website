---
title: Validation Webhook | Scanner
description: Scanner Validation Webhook
menu:
  product_scanner_0.1.0:
    identifier: webhook-components
    name: Validation Webhook
    parent: components
    weight: 10
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: concepts
---

# Webhook

From 1.9 release, kubernetes supports [admission webhooks](https://kubernetes.io/docs/admin/extensible-admission-controllers/#admission-webhooks) that receive admission requests and do something with them which is in beta. You can define two types of admission webhooks, [validating admission Webhook](https://kubernetes.io/docs/admin/admission-controllers.md#validatingadmissionwebhook-alpha-in-18-beta-in-19) and [mutating admission webhook](https://kubernetes.io/docs/admin/admission-controllers.md#mutatingadmissionwebhook-beta-in-19). Using validating admission Webhooks, you may reject admission requests. In this case, scanner uses validating admission webhook to determine whether workload's container should be run or not.

To validate images used in workload's containers, the admission requests are sent to this webhook and response (whether these images have vulnerabilities or not) is returned. To make response for an image, scanner takes the help from clair. Clair analizes an image's layers for vulnerabilities.

Next, we will describe how clair helps us to meet our requirements using validating webhook admission controller in cluster.

## Validation Process

In follwing figure we have shown the validation process of creating/updating a workload.

![validation process](/products/scanner/0.1.0/images/validation-process.png)

To validate a workload we request to Clair through the Clair v3 api. Then by checking the response from clair we respond with a status (either allowed or not allowed).

Now, take a look at the request lifecycle when a user tries to create/update a workload in kubernetes cluster.

01. User makes a create/update request for a workload to the `kube-apiserver`.
02. `kube-apiserver` sends an admission request with the workload object as payload to the ValidatingWebhook of scanner.
03. Then ValidatingWebhook iterates over all images in the workload's PodSpec. For each image it pulls image manifests, makes a `PostAncestryRequest` and the a `GetAncestryRequest` to Clair using Clair v3 api.
04. For `PostAncestryRequest` Clair analyzes the image and for `GetAncestryRequest` Clair responds with the full featured image nammed `GetAncestryResponse`.
05. ValidatingWebhook then sends back an admission response with a status allowed true or false. The status is allowed true if no image has any vulnerability, otherwise false.
06. If status is false then the create/update request is rejected, otherwise accepted.