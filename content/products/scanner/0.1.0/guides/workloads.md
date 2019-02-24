---
title: Workloads | Scanner
description: workloads of Scanner | Guides
menu:
  product_scanner_0.1.0:
    identifier: workloads-guides
    name: Workloads
    parent: guides
    weight: 10
product_name: scanner
menu_name: product_scanner_0.1.0
section_menu_id: guides
---

> New to Scanner? Please start [here](/products/scanner/0.1.0/concepts/README).

# How Scanner Behaves

Scanner supports the following types of Kubernetes workloads.

- Deployment
- DaemonSet
- ReplicaSet
- ReplicationController
- StatefulSet
- Job
- CronJob
<!-- - Openshift DeploymentConfig -->

Scanner rejects a workload to be created if any of it's images has vulnerability with severity level higher than the `--highest-acceptable-severity`(default is `Low`) of scanner. Supported levels are,

- `Unknown`
- `Negligible`
- `Low`
- `Medium`
- `High`
- `Critical`
- `Defcon1`

Otherwise, the workload is free to be created.

## Objectives

This guide will help you to see how Scanner behaves during creating/updating a workload.

The examples we have used are [here](/products/scanner/0.1.0/examples/workloads).

## Before you begin

To go forward, you must need Scanner to be run along with Clair. You can find procedures for it [here](/products/scanner/0.1.0/setup/install).

Once everything is set up, we are ready to go forward.

## Deployments

### Create

#### With vulnerable image

If the deployment you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a deployment with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/deployment-vuln.yaml
Error from server (Forbidden): error when creating "docs/examples/workloads/deployment-vuln.yaml": admission webhook "deployment.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the deployment contains no vulnerable image, Scanner does nothing.

Try to create a deployment with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/deployment.yaml
deployment.apps "hello" created
```

Get the newly created deployment:

```console
$ kubectl get deployment hello --namespace=kube-system
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello     1         1         1            1           3m
```

### Update

After creating a deployment with non-vulnerable image, try to update an image with a vulnerable image.

```console
$ kubectl set image deployment/hello --namespace=kube-system hello=shudipta/labels-vuln
error: failed to patch image update to pod template: admission webhook "deployment.admission.scanner.soter.ac" denied the request: image has vulnerability
```

## DaemonSets

### Create

#### With vulnerable image

If the daemonset you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a daemonset with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/daemonset-vuln.yaml
Error from server (Forbidden): error when creating "docs/examples/workloads/daemonset-vuln.yaml": admission webhook "daemonset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the daemonset contains no vulnerable image, Scanner does nothing.

Try to create a daemonset with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/daemonset.yaml 
daemonset.apps "hello-daemonset" created
```

Get the newly created daemonset:

```console
$ kubectl get daemonset hello-daemonset --namespace=kube-system
NAME              DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
hello-daemonset   1         1         1         1            1           <none>          28s
```

### Update

After creating a daemonset with non-vulnerable image, try to update an image with a vulnerable image.

```console
$ kubectl set image daemonset/hello-daemonset --namespace=kube-system hello=shudipta/labels-vuln
error: failed to patch image update to pod template: admission webhook "daemonset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

## ReplicaSets

### Create

#### With vulnerable image

If the replicaset you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a replicaset with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/replicaset-vuln.yaml 
Error from server (Forbidden): error when creating "docs/examples/workloads/replicaset-vuln.yaml": admission webhook "replicaset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the replicaset contains no vulnerable image, Scanner does nothing.

Try to create a replicaset with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/replicaset.yaml 
replicaset.apps "hello-replicaset" created
```

Get the newly created replicaset:

```console
$ kubectl get replicaset hello-replicaset --namespace=kube-system
NAME               DESIRED   CURRENT   READY     AGE
hello-replicaset   1         1         1         18s
```

### Update

After creating a replicaset with non-vulnerable image, try to update an image with a vulnerable image.

```console
$ kubectl set image replicaset/hello-replicaset --namespace=kube-system hello=shudipta/labels-vuln
error: failed to patch image update to pod template: admission webhook "replicaset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

## ReplicationControllers

### Create

#### With vulnerable image

If the replicationcontroller you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a replicationcontroller with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/replicationcontroller-vuln.yaml 
Error from server (Forbidden): error when creating "docs/examples/workloads/replicationcontroller-vuln.yaml": admission webhook "replicationcontroller.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the replicationcontroller contains no vulnerable image, Scanner does nothing.

Try to create a replicationcontroller with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/replicationcontroller.yaml 
replicationcontroller "hello-replicationcontroller" created
```

Get the newly created replicationcontroller:

```console
$ kubectl get replicationcontroller hello-replicationcontroller --namespace=kube-system
NAME                          DESIRED   CURRENT   READY     AGE
hello-replicationcontroller   1         1         1         30s
```

### Update

After creating a replicationcontroller with non-vulnerable image, try to update an image with a vulnerable image.

```console
$ kubectl set image replicationcontroller/hello-replicationcontroller --namespace=kube-system hello=shudipta/labels-vuln
error: failed to patch image update to pod template: admission webhook "replicationcontroller.admission.scanner.soter.ac" denied the request: image has vulnerability
```

## StatefulSets

### Create

#### With vulnerable image

If the statefulset you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a statefulset with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/statefulset-vuln.yaml 
service "hello-service" created
Error from server (Forbidden): error when creating "docs/examples/workloads/statefulset-vuln.yaml": admission webhook "statefulset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the statefulset contains no vulnerable image, Scanner does nothing.

Try to create a statefulset with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/statefulset.yaml 
statefulset.apps "hello-statefulset" created
```

Get the newly created statefulset:

```console
$ kubectl get statefulset hello-statefulset --namespace=kube-system
NAME                DESIRED   CURRENT   AGE
hello-statefulset   1         1         42s
```

### Update

After creating a statefulset with non-vulnerable image, try to update an image with a vulnerable image.

```console
$ kubectl set image statefulset/hello-statefulset --namespace=kube-system hello=shudipta/labels-vuln
error: failed to patch image update to pod template: admission webhook "statefulset.admission.scanner.soter.ac" denied the request: image has vulnerability
```

## Jobs

### Create

#### With vulnerable image

If the job you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a job with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/job-vuln.yaml 
Error from server (Forbidden): error when creating "docs/examples/workloads/job-vuln.yaml": admission webhook "job.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the job contains no vulnerable image, Scanner does nothing.

Try to create a job with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/job.yaml 
job.batch "hello-job" created
```

Get the newly created job:

```console
$ kubectl get job hello-job --namespace=kube-system
NAME        DESIRED   SUCCESSFUL   AGE
hello-job   1         0            27s
```

## CronJobs

### Create

#### With vulnerable image

If the cronjob you want to create contains any vulnerable image, Scanner should reject it and generate an error message.

Try to create a cronjob with vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/cronjob-vuln.yaml  
Error from server (Forbidden): error when creating "docs/examples/workloads/cronjob-vuln.yaml": admission webhook "cronjob.admission.scanner.soter.ac" denied the request: image has vulnerability
```

#### With non-vulnerable image

If the cronjob contains no vulnerable image, Scanner does nothing.

Try to create a cronjob with non-vulnerable image:

```console
$ kubectl create -f docs/examples/workloads/cronjob.yaml 
cronjob.batch "hello-cronjob" created
```

Get the newly created cronjob:

```console
$ kubectl get cronjob hello-cronjob --namespace=kube-system
NAME            SCHEDULE      SUSPEND   ACTIVE    LAST SCHEDULE   AGE
hello-cronjob   */1 * * * *   False     0         <none>          29s
```

## Clean up

Now you can clean up the resources you created in your cluster:

```console
$ kubectl delete deployments hello --namespace=kube-system
deployment.extensions "hello" deleted

$ kubectl delete daemonset hello-daemonset --namespace=kube-system
daemonset.extensions "hello-daemonset" deleted

$ kubectl delete replicaset hello-replicaset --namespace=kube-system
replicaset.extensions "hello-replicaset" deleted

$ kubectl delete replicationcontroller hello-replicationcontroller --namespace=kube-system
replicationcontroller "hello-replicationcontroller" deleted

$ kubectl delete service hello-service --namespace=kube-system
service "hello-service" deleted
$ kubectl delete statefulset hello-statefulset --namespace=kube-system
statefulset.apps "hello-statefulset" deleted

$ kubectl delete job hello-job --namespace=kube-system
job.batch "hello-job" deleted

$ kubectl delete cronjob hello-cronjob --namespace=kube-system
cronjob.batch "hello-cronjob" deleted
```

## Next Steps

- See [how to use ImageReview](/products/scanner/0.1.0/guides/imagereview)
- See [how to use WorkloadRevie](/products/scanner/0.1.0/guides/workloadreview)
- See [how to use scanner cli](/products/scanner/0.1.0/guides/scanner-cli)