
const https = require('https');

const getOriginsString = (properties) => (
  properties.map(property => property.coordinate.join(',')).join('|')
)

const getNextWorkingDayAtHour = (hour) => {
  var date = new Date()
  date.setHours(hour, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  while (date.getDay() == 6 || date.getDay() == 0) date.setDate(date.getDate() + 1)
  return date.getTime() / 1000
}

const parseResult = (json) => {
  if (json.status !== 'OK') {
    console.log(`Error on request: status = ${json.status}`)
    return []
  }
  return json.rows.map((row, index) => {
    if (row.elements.length === 0) {
      console.log(`Error on row ${index}: no elements`)
      return {value: undefined, text: 'NO ELEMENTS'}
    }
    const element = row.elements[0]
    if (element.status !== 'OK') {
      console.log(`Error on row ${index}: status = ${element.status}`)
      return {value: undefined, text: element.status}
    }
    return element.duration
  })
}

const buildURL = (properties) => (
  'https://maps.googleapis.com/maps/api/distancematrix/json?'+
    `origins=${getOriginsString(properties)}&`+
    `destinations=Stockholms+Centralstation,+Centralplan,+Stockholm&` +
    'mode=transit&' +
    'region=se&' +
    'transit_mode=rail&' +
    'transit_routing_preference=fewer_transfers&' +
    `departure_time=${getNextWorkingDayAtHour(8)}&` +
    `key=${process.env.API_KEY}`
)

const getDistances = (properties, done) => {
  const url = buildURL(properties)
  https.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {

      const distances = parseResult(JSON.parse(data))
      done(distances);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    done([])
  });
}

const chunk = (array, chunkSize) => {
  const chunks = []
  let start = 0

  while (start < array.length) {
    chunks.push(array.slice(start, start+chunkSize))
    start += chunkSize
  }
  return chunks
}

const getDistancesInChunks = (chunkSize, properties, done) => {
  const chunks = chunk(properties, chunkSize)
  processChunk(chunks, 0, [], done)
}

const processChunk = (chunks, index, results, done) => {
  if (index >= chunks.length) {
    done(results)
    return
  }
  console.log(`Request ${index +1}...`)
  const chunk = chunks[index]
  getDistances(chunk, (chunkResult) => {
    const updatedResult = results.concat(chunkResult)
    processChunk(chunks, index + 1, updatedResult, done)
  })
}


const addDistanceInfo = (properties, done) => {
  getDistancesInChunks(60, properties, (distances) => {
    const withDistances = properties.map((property, index) => {
      return {
        ...property,
        distanceText: distances[index].text,
        distanceSecs: distances[index].value,

      }
    })
    done(withDistances)
  })

}


module.exports = { getDistances, addDistanceInfo }