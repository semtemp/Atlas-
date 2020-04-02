// constructor function for first pod
function PodUsageQuery(data) {
  // assign all variables as empty array
  this.name = [];
  this.cpuUse = [];
  this.memoryUse = [];

  //////////////
  // result is a string
  // need to check EACH CHAR in the string to get data we want, possibly using whitespaces
  // is it efficient to go through every char in the string we get???
  // using curl => CLI + URL, curl + whatever url we use to get json data on cluster to get data in json format

 
  let enter = 0;
  
  // loop through data
  for (let i = 0; i < data.length; i++) {
    //console.log('data[i]', data[i]);
    if (data[i] == `\n`) { console.log('enter here', i)}
  }
}
  
  module.exports = { PodUsageQuery };
  