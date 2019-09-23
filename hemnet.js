
const fs = require('fs');
var columns = require('./columns');

var id = '2019-09-20-1643'
var results = require(`./in/${id}.js`);
var properties = results['properties']

var addVisitingInfo = require('./visits')
properties = addVisitingInfo(id, properties)

var { addDistanceInfo } = require('./direction')
console.log(`>>> Requesting distance info...`)
addDistanceInfo(properties, (propertiesWithDistance) => {
  var header = columns.map(col => col.header).join(';')
  var body = propertiesWithDistance.map((property) => (
    columns.map(col => col.data(property)).join(';')
  ))
  var out = [header].concat(body).join('\n')
  
  fs.writeFile(`./out/${id}.csv`, out, () => {
    console.log(`>>> Done! ${propertiesWithDistance.length} records`)
  })

})


