const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const cors = require('cors');

const PodController = require('./controllers/PodController');

app.use(cors());
app.use(express.json());

// testing to get pods from api
app.get('/getPods', PodController.getPods, (req, res) => {
  res.status(200).json(res.locals.pod);
});

/////testing code from spek8
//////////////////////////////////////////
const { kube } = require('./kubeconfig');

app.get('/service', (req, res) => {
  kube.listNamespacedService('default')
    .then((re) => {
      console.log('service body', re.body);
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

app.get('/ingress', (req, res) => {
  kube.listNamespacedIngress('default')
    .then((re) => {
      console.log('ingress body', re.body);
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

app.get('/deployment', (req, res) => {
  kube.listNamespacedDeployment('default')
    .then((re) => {
      console.log('deployment body', re.body);
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

app.get('/daemonset', (req, res) => {
  console.log('daemonset body', re.body);
  kube.listNamespacedDaemonSet('default')
    .then((re) => {
      res.json(re.body);
    });
});
///////////////////////////////////////



// serve html
app.use('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html'));
});
// catch all
app.use('/', (req, res) => {
  res.sendStatus(404);
});
// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}...`);
});
