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
        return next(error);
      }
    }
  );
}

PodController.getPodUsage2 = (req, res, next) => {

  cmd.get(
    `curl http://localhost:8081/apis/metrics.k8s.io/v1beta1/namespaces/default/pods/`,
    (err, data, stderr) => {
      if (err) return next(err);
      console.log('data from curl', data);
      return next();
    }
  )
  
}


module.exports = PodController;
