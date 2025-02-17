const express = require('express');
const { handleGenerateNewShortURL, handleAnalytics } = require('../controllers/url');
const router = express.Router();

const validateURL = (req, res, next) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    next();
};

router.post('/', validateURL, handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleAnalytics);

router.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;