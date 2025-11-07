const redis = require('../config/redis');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
require('dotenv').config();

const shortenUrl = async (req, res) => {
  const { longUrl, customAlias } = req.body;
  const base = process.env.BASE_URL;

  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  try {
    // If custom alias provided, validate uniqueness
    if (customAlias) {
      const existingCustom = await Url.findOne({ shortId: customAlias });
      if (existingCustom) {
        return res.status(409).json({ error: 'Custom alias already in use' });
      }
    }

    // Check if longUrl already exists (without custom alias)
    let existing = await Url.findOne({ longUrl });
    if (existing && !customAlias) {
      return res.json({ shortUrl: `${base}/${existing.shortId}` });
    }

    // Generate short ID (custom or nanoid)
    const shortId = customAlias || nanoid(6);

    const newUrl = new Url({
      longUrl,
      shortId
    });

    await newUrl.save();

    return res.status(201).json({ shortUrl: `${base}/${shortId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Redirect handler
const redirectToLongUrl = async (req, res) => {
  const { shortId } = req.params;

  try {
    // 1. Try Redis cache first
    const cachedUrl = await redis.get(shortId);
    if (cachedUrl) {
      console.log(`Cache hit for ${shortId}`);

      // ✅ Increment click count in background (non-blocking)
      Url.findOneAndUpdate({ shortId }, { $inc: { clicks: 1 } }).exec();

      return res.redirect(cachedUrl);
    }

    // 2. Fallback to MongoDB
    const record = await Url.findOne({ shortId });

    if (record) {
      // ✅ Increment click count
      record.clicks += 1;
      await record.save();

      // ✅ Cache for future use
      await redis.set(shortId, record.longUrl, 'EX', 86400);

      return res.redirect(record.longUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  shortenUrl,       // already defined
  redirectToLongUrl // new
};

