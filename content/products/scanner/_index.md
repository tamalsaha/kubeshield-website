---
title: Scanner
description : Docker Image Scanner
menu:
  main:
    parent: product
    identifier: Scanner
    name: Scanner
    weight: 40
layout: root
product_name: scanner
docs_url: https://github.com/appscode/scanner/tree/master/docs
github_url: https://github.com/appscode/scanner
helm_url: https://github.com/appscode/scanner/tree/master/chart/scanner
---


   <section class="get-installation">
      <div class="container">
         <div class="row">
            <div class="col-md-4">
               <div class="installation-content">
                  <h2>Quick installation</h2>
                  <P>
                    Scanner can be installed using YAML files includes in the projects Github repository or using Helm chart.
                    <a href="/products/scanner/0.1.0/setup/install/" target="_blank" role="button">Learn more</a>
                  </P>
               </div>
            </div>
            <div class="col-md-8">
               <div class="installation-pre-area">
                  <ul class="nav nav-tabs tab-install" role="tablist">
                     <li class="active"><a href="#linux" aria-controls="linux" data-toggle="tab">Linux</a></li>
                     <li><a href="#helm" aria-controls="helm" data-toggle="tab">Helm Chart</a></li>
                  </ul>
                  <!-- Tab panes -->
                  <div class="tab-content tab-install-data">
                     <div class="tab-pane active" id="linux">
                        <textarea class="installation-pre-code">
curl -fsSL https://raw.githubusercontent.com/appscode/scanner/0.1.0/hack/deploy/scanner.sh | bash
                       </textarea>
                     </div>
                     <div class="tab-pane" id="helm">
                        <textarea class="installation-pre-code">
$ helm repo add appscode https://charts.appscode.com/stable/
$ helm repo update
$ helm install appscode/scanner --name scanner-operator --namespace kube-system
                       </textarea>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>

<section id="configuration">
   <div class="container">
      <div class="row">
         <div class="col-md-4">
            <div class="getting-started">
               <a href="/products/scanner/0.1.0/concepts/crds/restic/">
                  <div class="cc-icon">
                      <img src="/images/products/scanner/declarative-api.svg">
                  </div>
                  <div class="cc-content">
                     <h3>Declarative API</h3>
                     <p>Fast, secure, efficient backup and recovery of any Kubernetes volumes</p>
                  </div>
               </a>
            </div>
         </div>
         <div class="col-md-4">
            <div class="getting-started">
               <a href="/products/scanner/0.1.0/guides/workloads/">
                  <div class="cc-icon">
                     <img src="/images/products/scanner/kub-workload.svg">
                  </div>
                  <div class="cc-content">
                     <h3>Kubernetes Workload</h3>
                     <p>Works with Deployment, DaemonSet, StatefulSet, ReplicaSet & ReplicationController</p>
                  </div>
               </a>
            </div>
         </div>
         <div class="col-md-4">
            <div class="getting-started">
               <a href="https://restic.net">
                  <div class="cc-icon">
                     <img src="/images/products/scanner/restic.svg">
                  </div>
                  <div class="cc-content">
                     <h3>Restic</h3>
                     <p>Built-in on top of open source backup program Restic</p>
                  </div>
               </a>
            </div>
         </div>
      </div>
      <div class="row">
         <div class="col-md-4">
            <div class="getting-started">
               <a href="/products/scanner/0.1.0/guides/backends/">
                  <div class="cc-icon">
                     <img src="/images/products/scanner/platform-support.svg">
                  </div>
                  <div class="cc-content">
                     <h3>Platform Support</h3>
                     <p>Store backups in S3, GCS, Azure, OpenStack Swift, DigitalOcean Spaces and others</p>
                  </div>
               </a>
            </div>
         </div>
         <div class="col-md-4">
            <div class="getting-started">
               <a href="/products/scanner/0.1.0/guides/monitoring/">
                  <div class="cc-icon">
                     <img src="/images/products/scanner/prometheus.svg">
                  </div>
                  <div class="cc-content">
                     <h3>Prometheus</h3>
                     <p>Comes with built-in support for Prometheus</p>
                  </div>
               </a>
            </div>
         </div>
         <div class="col-md-4">
            <div class="getting-started">
               <a href="/products/scanner/0.1.0/guides/rbac/">
                  <div class="cc-icon">
                     <img src="/images/products/scanner/rback.svg">
                  </div>
                  <div class="cc-content">
                     <h3>RBAC</h3>
                     <p>Pre-defined ClusterRole for RBAC enabled clusters.</p>
                  </div>
               </a>
            </div>
         </div>
      </div>
   </div>
</section>
