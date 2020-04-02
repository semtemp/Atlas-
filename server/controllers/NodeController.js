const { kube } = require('../kubeconfig');
const { NodeQuery } = require('../query/NodeQuery');
const cmd = require('node-cmd');

const NodeController = {};

NodeController.getNodes = (req, res, next) => {
  // console.log('test from inside NodeController');
  //get data from kube api
  kube.listNode('default').then(data => {
    const result = new NodeQuery(data);
    const nodeArray = [];
    for (let i = 0; i < result.name.length; i++) {
      let obj = {
        name: result.name[i],
        cpu: result.cpu[i],
      };
      nodeArray.push(obj);
    }
    // console.log('nodeArr', nodeArray);
    res.locals.nodes = nodeArray;
    return next();
  });
};

//middleware to get cpu usage info of nodes
NodeController.getNodeUsage = (req, res, next) => {
  cmd.get(
    `kubectl top node`,
    function(err, data){
      if (!err) {
        console.log('nodeController getNodeUsage data :\n', data)
        return next();
      } else {
        return next(error);
      }
    }
  );
};

module.exports = NodeController;
