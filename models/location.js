const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Location name is required"]
  },
  male: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "Male value must be an integer number"
    }
  },
  female: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "Female value must be an integer number"
    }
  },
  subLocations: {
    type : Array ,
    "default" : []
  },
  total: {
    type: Number,
    required:false,
    default: 0
  },
});

LocationSchema.method('update', function (updates, callback) {
  const location = this;
  if (updates.updateSubLocation) {
      Object.assign(location, { 
          subLocations: [...this.subLocations, updates.subLocation] 
      })
    } else {
    Object.assign(location, updates)
  }
  location.save(callback);
});

/**
 * Find the total for both male and female residents.
 */
LocationSchema.pre('save', function (next) {
  const location = this;
  this.total = location.male + location.female;
  next();
});

//model
const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;