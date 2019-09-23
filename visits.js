const addVisitingInfo = (id, properties) => {
  try {
    var weekendVisitsResults = require(`./in/${id}_we.js`);
    var ids = weekendVisitsResults.properties.map(property => property.id)
    return properties.map(property =>({
      ...property,
      weVisit: ids.indexOf(property.id) >=0
    }))
  } catch(e) {
    console.log(`>>> Couldn't find visit info (./in/${id}_we.js`)
    return properties
  }
}

module.exports = addVisitingInfo