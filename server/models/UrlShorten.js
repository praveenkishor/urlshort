const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlShortenSchema = new Schema({
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
  ipAddress: Object,
  region: Object,
  clickstotal: Number,
  present:Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

mongoose.model("UrlShorten", urlShortenSchema);
