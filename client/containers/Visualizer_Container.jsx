//traffic view of kubernetes clusters/individual pods
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RadialTree from '../components/visualizer/RadialTree.jsx';
import DashBoard from '../components/Dashboard.jsx';

const Visualizer = () => {
  let [data, setData] = useState([]);
  let [pod, setPod] = useState([]);
  let [podUsage, setPodUsage] = useState([]);
  let [node, setNode] = useState([]);
  let [service, setService] = useState([]);

  // getPods, getNodes, getServices:
  // helper functions for formating fetched info for d3 visualization
  function getPodUsage(name) {
    const obj = {};
    for (let i = 0; i < podUsage.length; i++) {
      //if pod name matches, include usage information 
      if (name == podUsage[i].podName) {
        obj.cpu = podUsage[i].usageCPU;
        obj.memory = podUsage[i].usageMemory;
      }
    }
    return obj;
  }

  function getPods(parent) {
    const podArr = [];
    for (let i = 0; i < pod.length; i++) {
      //check node name passed thru parameter against pod's nodeName
      if (parent == pod[i].nodeName) {
        const podObj = {};
        podObj.name = pod[i].name;
        podObj.namespace = pod[i].namespace;
        podObj.status = pod[i].status;
        podObj.podIP = pod[i].podIP;
        podObj.createdAt = pod[i].createdAt;
        podObj.parent = pod[i].nodeName;
        podObj.labels = pod[i].labels;
        podObj.usage = getPodUsage(pod[i].name); //object with cpu and memory properties
        podArr.push(podObj);
      }
    }
    return podArr;
  }

  function getNodes() {
    const nodeArr = [];
    for (let i = 0; i < node.length; i++) {
      const nodeObj = {};
      nodeObj.name = node[i].name;
      //pods/children related to the node
      nodeObj.children = getPods(node[i].name);
      nodeArr.push(nodeObj);
    }
    return nodeArr;
  }

  function getServices() {
    const serviceArr = [];
    for (let i = 0; i < service.length; i++) {
      //skip the clusterIP service for now
      if (service[i].type === 'ClusterIP') continue;

      const serviceObj = {};
      //copy all info from services into serviceObj
      serviceObj.name = service[i].name;
      serviceObj.type = service[i].type;
      serviceObj.namespace = service[i].namespace;
      serviceObj.port = service[i].port;
      serviceObj.clusterIP = service[i].clusterIP;
      //nodes/children related to the service
      serviceObj.children = getNodes();
      serviceArr.push(serviceObj);
    }
    return serviceArr;
  }

  useEffect(() => {
    // fetch service, node, pod info
    const fetchInfo = async () => {
      //array to store fetched data
      //initialized everytime
      service = [];
      node = [];
      pod = [];
      podUsage = [];

      const serviceReq = axios.get('/getServices');
      const nodeReq = axios.get('/getNodes');
      const podReq = axios.get('/getPods');

      //use axios.all to wait for returned data on all 3 calls
      const res = await axios.all([serviceReq, nodeReq, podReq]);

      //set returned data as constants - identify based on their index
      const serviceRes = res[0].data;
      const nodeRes = res[1].data;
      const podRes = res[2].data.pod; //data on pods
      const podUsageRes = res[2].data.usage; //data on pod usage

      setService(service.push(...serviceRes));
      setNode(node.push(...nodeRes));
      setPod(pod.push(...podRes));
      setPodUsage(podUsage.push(...podUsageRes));

      //const dataRes = getServices();
      //setData(data.push(...dataRes)); //doesn't work
      setData(getServices()); //set data
    };
    // fetchInfo();
    const fetchOnLoad = () => {
      if (!data[0]) {
        fetchInfo();
      }
      setInterval(() => {
        fetchInfo();
      }, 5000);
    };

    fetchOnLoad();
  }, []);

  return (
    <div className='appCont'>
      <DashBoard />
      <div className='visContainer'>
        <h4>Traffic Visualizer</h4>
        <RadialTree data={data} />
      </div>
    </div>
  );
};

export default Visualizer;
