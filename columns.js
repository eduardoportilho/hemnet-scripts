const toNumber = text => text.replace(/[^\d\.,]/gi, '')

var addressCol = {
  header: 'Address',
  data: property => `${property.address}, ${property.location_name}`
}
var distanceCol = {
  header: 'Dist. T-C min',
  data: property => {
    if (property.distanceSecs) {
      return Math.round(property.distanceSecs / 60)
    }
    return property.distanceText
  }
}
var priceCol = {
  header: 'Price',
  data: property => toNumber(property.price)
}
var roomsCol = {
  header: 'Rooms',
  data: property => toNumber(property.rooms)
}
var avgiftCol = {
  header: 'Avgift',
  data: property => property.fee ? toNumber(property.fee) : ''  
}
var areaCol = {
  header: 'Area',
  data: property => toNumber(property.living_space)
}
var linkCol = {
  header: 'Link',
  data: property => property.url
}

module.exports = [
  addressCol,
  distanceCol,
  priceCol,
  roomsCol,
  avgiftCol,
  areaCol,
  linkCol
]