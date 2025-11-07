// models/Url.js
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 } // ✅ NEW FIELD
});

module.exports = mongoose.model('Url', UrlSchema);
