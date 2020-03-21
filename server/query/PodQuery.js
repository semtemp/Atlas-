// constructor function for first pod
function PodQuery(data) {
  // assign all variables as empty array
  this.name = [];
  this.namespace = [];
  this.status = [];
  this.podIP = [];
  this.createdAt = [];

  // loop through body.items length
  for (let i = 0 ; i < data.body.items.length; i++) {
    (this.name[i] = data.body.items[i].metadata.name),
    (this.namespace[i] = data.body.items[i].metadata.namespace),
    (this.status[i] = data.body.items[i].status.phase),
    (this.podIP[i] = data.body.items[i].status.podIP),
    (this.createdAt[i] = data.body.items[i].status.startTime);  
  }
  // console.log('data.body.items', data.body.items);
  // (this.name = data.body.items[0].metadata.name),
  // (this.namespace = data.body.items[0].metadata.namespace),
  // (this.status = data.body.items[0].status.phase),
  // (this.podIP = data.body.items[0].status.podIP),
  // (this.createdAt = data.body.items[0].status.startTime);
}

module.exports = { PodQuery };

/*
 data.body.items [
[1]   V1Pod {
[1]     metadata: V1ObjectMeta {
[1]       annotations: [Object],
[1]       clusterName: undefined,
[1]       creationTimestamp: 2020-03-16T20:54:44.000Z,
[1]       deletionGracePeriodSeconds: undefined,
[1]       deletionTimestamp: undefined,
[1]       finalizers: undefined,
[1]       generateName: 'megamarkets-58c64cc5b5-',
[1]       generation: undefined,
[1]       initializers: undefined,
[1]       labels: [Object],
[1]       managedFields: undefined,
[1]       name: 'megamarkets-58c64cc5b5-kmhxr',
[1]       namespace: 'default',
[1]       ownerReferences: [Array],
[1]       resourceVersion: '1005162',
[1]       selfLink: '/api/v1/namespaces/default/pods/megamarkets-58c64cc5b5-kmhxr',
[1]       uid: '5d99d461-67c8-11ea-a618-42010aa80044'
[1]     },
[1]     spec: V1PodSpec {
[1]       activeDeadlineSeconds: undefined,
[1]       affinity: undefined,
[1]       automountServiceAccountToken: undefined,
[1]       containers: [Array],
[1]       dnsConfig: undefined,
[1]       dnsPolicy: 'ClusterFirst',
[1]       enableServiceLinks: true,
[1]       hostAliases: undefined,
[1]       hostIPC: undefined,
[1]       hostNetwork: undefined,
[1]       hostPID: undefined,
[1]       hostname: undefined,
[1]       imagePullSecrets: undefined,
[1]       initContainers: undefined,
[1]       nodeName: 'gke-megamarkets-default-pool-b8d7d8f9-59c8',
[1]       nodeSelector: undefined,
[1]       preemptionPolicy: undefined,
[1]       priority: 0,
[1]       priorityClassName: undefined,
[1]       readinessGates: undefined,
[1]       restartPolicy: 'Always',
[1]       runtimeClassName: undefined,
[1]       schedulerName: 'default-scheduler',
[1]       securityContext: [V1PodSecurityContext],
[1]       serviceAccount: 'default',
[1]       serviceAccountName: 'default',
[1]       shareProcessNamespace: undefined,
[1]       subdomain: undefined,
[1]       terminationGracePeriodSeconds: 30,
[1]       tolerations: [Array],
[1]       volumes: [Array]
[1]     },
[1]     status: V1PodStatus {
[1]       conditions: [Array],
[1]       containerStatuses: [Array],
[1]       hostIP: '10.168.0.48',
[1]       initContainerStatuses: undefined,
[1]       message: undefined,
[1]       nominatedNodeName: undefined,
[1]       phase: 'Running',
[1]       podIP: '10.56.1.2',
[1]       qosClass: 'Burstable',
[1]       reason: undefined,
[1]       startTime: 2020-03-17T07:37:11.000Z
[1]     }
[1]   }
[1] ]
*/