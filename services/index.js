const express = require('express');
const router = express.Router({});
const Location = require('../models/location');
const Utils = require('../helpers/utils');
console.log(router.param, 'hello there')

/**
 * Load a location on every request that needs it.
 */
router.param('id', async (req, res, next, id) => {
    try {
        const location = await Utils.getOneLocation(id);
      if (!location) return next(Utils.Error('Location not found', 404));
      req.location = location;
      next();
    }
    catch (error) {
      next(error)
    }
  });

/**
 * Get all locations
 * /api/v1/locations
 */
router.get('/locations', async (req, res, next) => {
    try {
      const locations = await Location.find({}).exec();
      return res.status(200)
        .send(Utils.response('success', Utils.formatLocations(locations)));
    } catch (error) {
      next(error)
    }
  
  });

/**
 * Adds a location
 */
router.post('/locations', async (req, res, next) => {
    if (Object.keys(req.body).length === 0){  
        return res.status(400).send({
            message: "Body payload cannot be empty" 
        });
    }
    try {
      const location = await Utils.saveLocation(req);
      await res.status(201)
      .send(Utils.response('success', Utils.getLocation(location)));
    } catch (error) {
      next(error)
    }
  });

/**
 * Return a location given the id
 * Also return the sublocations up to one level.
 * /api/v1/location/<id>
 */
router.get('/location/:id', async (req, res) => {
    const subLocations = req.location.subLocations;
    let subLocs = [];
    if (subLocations.length > 0){
      subLocs = await Utils.getSubLocations(subLocations);
    }
    const location = Object.assign({}, Utils.getLocation(req.location), { subLocations: subLocs });
    return res.status(200).send(Utils.getLocation(location));
  });


/**
 * Adds a sublocation to a location
 */
router.post('/location/:id/sub', async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400)
            .send({ 
                message: "Body payload cannot be empty" 
            });
    }
    try {
      const location = await Utils.saveLocation(req);
      req.location.update({ 
          subLocation: location._id,
          updateSubLocation: true
      }, async function (err, updatedLocation) {
        if (err) return next(err);
        const subLocations = await Utils.getSubLocations(updatedLocation.subLocations);
        return res.status(201).send(Utils.response('success',
            Utils.getLocation(Object.assign(updatedLocation, { subLocations, id: updatedLocation._id }))));
      })
    }
    catch (error) {
      next(error)
    }
  });


/**
 * Update a location
 */
router.put('/location/:id', (req, res, next) => {
    req.location.update(req.body, function (err, location) {
      if (err) return next(err);
      res.status(200).send(Utils.getLocation(location));
    })
  });

/**
 * Delete a location
 */
router.delete('/location/:id', (req, res, next) => {
    req.location.remove(function (err) {
      if (err) return next(Utils.Error('Error occured while deleting', 500));
      return res.status(200).send({ message: 'Location deleted successfully' });
    })
});

  module.exports = router;