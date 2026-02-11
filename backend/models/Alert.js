const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  personName: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    // For now we'll store local path or S3 URL if implemented
  },
  location: {
    // GeoJSON format for MongoDB
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Longitude, Latitude
    }
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Resolved", "False Alarm"],
    default: "New",
  },
  riskScore: {
    type: Number,
    default: 0,
  }
});

// Index for geospatial queries
AlertSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Alert", AlertSchema);
