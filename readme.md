# Devops with kubernetes

https://devopswithkubernetes.com/

Apps:
* app1 - API and web front for pingpong thing
* app2 - Main project
* app3 - ping/pong app


## DBaaS vs DIY

### DBaaS
Pros:
* Easier to setup, maintain, backup and scale
* Likely more reliable
Cons:
* (Very likely) costs more
* Possible vendor lock-in
* Might not be as flexible. Might not allow tuning stuff to your liking.

### DIY DB
Pros:
* (Probably) costs less
* More flexible
* No vendor lock-in
Cons:
* Harder to setup, maintain, backup and scale
* Likely less reliable

### Exercise 3.07

I chose Postgres with PersistentVolumeClaims because it has already been setup and because it makes it easier to develop locally with k3d.

### Exercise 4.03

`count(kube_pod_info{namespace="prometheus",created_by_kind="StatefulSet"})`

### Exercise 5.06

Used technologies marked with green. Red for something I used was depending on.
https://github.com/FINDarkside/devops-with-kubernetes/blob/master/landscape.png

* etcd - Kubernetes
* k3s - k3d
* containerd - k3s
