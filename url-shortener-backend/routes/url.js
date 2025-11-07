const express = require('express');
const router = express.Router();
const { shortenUrl, redirectToLongUrl } = require('../controllers/urlController');

// Create short URL
router.post('/shorten', shortenUrl);

// Redirect to original URL
router.get('/:shortId', redirectToLongUrl);

// Default welcome route
router.get('/', (req, res) => {
  res.send('Welcome to URL Shortener API');
});

module.exports = router;
