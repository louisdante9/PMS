'use strict';

const Location = require('../models/location');

/**
 * Helper for constructing a response
 * @param status
 * @param data
 * @returns {{status: *, data: *}}
 */
module.exports.response = (status, data) => ({
  status,
  data
});

/**
* Return an error object.
* @param message Error message
* @param status Response status code.
* @returns {Error}
*/
module.exports.Error = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

/**
 * Save a location in the database
 * @param req
 * @returns {Promise<*>}
 */
module.exports.saveLocation = async (req) => {
  const {name, male, female} = req.body
  const location = new Location({
    name,
    male,
    female
  });
  return await location.save();
};

/**
 * Get a single location from the database
 * @param id
 * @returns {Promise<void>}
 */
module.exports.getOneLocation = async (id) => await Location.findOne({ _id: id }).exec();

/**
 * Get all the sub locations attached to a location.
 * @param locations
 * @returns {Promise<void>}
 */
module.exports.getSubLocations = async (locations) => {
  let subLocations = [];
  for (let id of locations) {
    const location = await this.getLocation(id);
    subLocations = [...subLocations, {
      id: location._id,
      name: location.name,
      female: location.female,
      male: location.male,
      total: location.total || 0,
      subLocations: location.subLocations,
    }];
  }
  return await subLocations;
};

/***
 * Return an object containing the location details.
 * @param location
 * @returns {{id: *, name: *, female: (*|female|{type, required}), male: (*|male|{type, required}), subLocations: (*|void|subLocations|{type, default})}}
 */
module.exports.getLocation = location => ({
    id: location.id,
    name: location.name,
    female: location.female,
    male: location.male,
    total: location.total || 0,
    subLocations: location.subLocations
});

/**
 * Format the locations to be returned.
 * @param locations
 * @returns {Array}
 */
module.exports.formatLocations = locations => {
  let formattedLocations = [];
  if (locations) {
    for (let locale of locations) {
      const location = this.getLocation(Object.assign(locale, { id: locale._id }));
      formattedLocations = [...formattedLocations, location]
    }
  }
  return formattedLocations
};