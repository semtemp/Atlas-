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