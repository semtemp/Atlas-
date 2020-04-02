const { kube } = require('../kubeconfig');
const { PodQuery } = require('../query/PodQuery');
const { PodUsageQuery } = require('../query/PodUsageQuery');
const cmd = require('node-cmd');

const PodController = {};

// middleware to get pods upon loading the home page
PodController.getPods = (req, res, next) => {
  // grabbing data from kube api
  kube.listNamespacedPod('default').then(data => {
    // create new object with retrieved data - result will now containe pod name, namespace, status, ip address, and createdAt
    const result = new PodQuery(data);
    const podArray = [];
    for (let i = 0; i < result.name.length; i++) {
      let obj = {
        name: result.name[i],
        namespace: result.namespace[i],
        status: result.status[i],
        podIP: result.podIP[i],
        createdAt: result.createdAt[i].toString(),
        nodeName: result.nodeName[i],
        labels: result.labels[i],
      };
      podArray.push(obj);
    }
    // console.log('podArr', podArray);
    // store in res.locals
    res.locals.pod = podArray;
    return next();
  });
};

//middleware to get cpu usage info of pods
PodController.getPodUsage = (req, res, next) => {
  //get pod's usage info using CLI
  cmd.get(
    `kubectl top pod`,
    function(err, data){
      if (!err) {
        // console.log('podController getPodUsage data :\n', data)
        const result = new PodUsageQuery(data);
        console.log('podUsage data', result);
        return next();
      } else {
        return next(err);
      }
    }
  );
}

PodController.getPodUsage2 = (req, res, next) => {
  cmd.get(
    `curl http://localhost:8081/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/`,
    (err, data, stderr) => {
      if (err) return next(err);
      
      //no error
      const res = JSON.parse(data);
      // console.log('data from curl, json parsed', res);
      const podArr = res.items;
      const resArr = [];
      // const podName, usageCPU, usageMemory;
      for (let i = 0; i < podArr.length; i++) {
        const podObj = {};
        podObj.podName = podArr[i].metadata.name;
        podObj.usageCPU = podArr[i].containers[0].usage.cpu;
        podObj.usageMemory = podArr[i].containers[0].usage.memory;
        resArr.push(podObj);
      }
      console.log('resArr in podCont podUsage2', resArr)

      return next();
    }
  )
}


module.exports = PodController;

/////
/*
data from curl {
[1]   "kind": "PodMetricsList",
[1]   "apiVersion": "metrics.k8s.io/v1beta1",
[1]   "metadata": {
[1]     "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/"     
[1]   },
[1]   "items": [
[1]     {
[1]       "metadata": {
[1]         "name": "megamarkets-58c64cc5b5-j28vv",
[1]         "namespace": "default",
[1]         "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/megamarkets-58c64cc5b5-j28vv",
[1]         "creationTimestamp": "2020-04-02T08:26:34Z"
[1]       },
[1]       "timestamp": "2020-04-02T08:26:10Z",
[1]       "window": "30s",
[1]       "containers": [
[1]         {
[1]           "name": "megamarkets",
[1]           "usage": {
[1]             "cpu": "0",
[1]             "memory": "167804Ki"
[1]           }
[1]         }
[1]       ]
[1]     },
[1]     {
[1]       "metadata": {
[1]         "name": "megamarkets-58c64cc5b5-4vblk",
[1]         "namespace": "default",
[1]         "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/megamarkets-58c64cc5b5-4vblk",
[1]         "creationTimestamp": "2020-04-02T08:26:34Z"
[1]       },
[1]       "timestamp": "2020-04-02T08:26:10Z",
[1]       "window": "30s",
[1]       "containers": [
[1]         {
[1]           "name": "megamarkets",
[1]           "usage": {
[1]             "cpu": "0",
[1]             "memory": "166288Ki"
[1]           }
[1]         }
[1]       ]
[1]     },
[1]     {
[1]       "metadata": {
[1]         "name": "megamarkets-58c64cc5b5-c52zt",
[1]         "namespace": "default",
[1]         "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/megamarkets-58c64cc5b5-c52zt",
[1]         "creationTimestamp": "2020-04-02T08:26:34Z"
[1]       },
[1]       "timestamp": "2020-04-02T08:26:15Z",
[1]       "window": "30s",
[1]       "containers": [
[1]         {
[1]           "name": "megamarkets",
[1]           "usage": {
[1]             "cpu": "0",
[1]             "memory": "169708Ki"
[1]           }
[1]         }
[1]       ]
[1]     },
[1]     {
[1]       "metadata": {
[1]         "name": "megamarkets-58c64cc5b5-kmhxr",
[1]         "namespace": "default",
[1]         "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/megamarkets-58c64cc5b5-kmhxr",
[1]         "creationTimestamp": "2020-04-02T08:26:34Z"
[1]       },
[1]       "timestamp": "2020-04-02T08:25:57Z",
[1]       "window": "30s",
[1]       "containers": [
[1]         {
[1]           "name": "megamarkets",
[1]           "usage": {
[1]             "cpu": "0",
[1]             "memory": "167240Ki"
[1]           }
[1]         }
[1]       ]
[1]     },
[1]     {
[1]       "metadata": {
[1]         "name": "megamarkets-58c64cc5b5-5xjwf",
[1]         "namespace": "default",
[1]         "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/megamarkets-58c64cc5b5-5xjwf",
[1]         "creationTimestamp": "2020-04-02T08:26:34Z"
[1]       },
[1]       "timestamp": "2020-04-02T08:26:24Z",
[1]       "window": "30s",
[1]       "containers": [
[1]         {
[1]           "name": "megamarkets",
[1]           "usage": {
[1]             "cpu": "0",
[1]             "memory": "172748Ki"
[1]           }
[1]         }
[1]       ]
[1]     }
[1]   ]
[1] }
*/