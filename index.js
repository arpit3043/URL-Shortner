const express = require('express');
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const { connectToMongoDB } = require('connect');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());

connectToMongoDB('mongodb://localhost:27017/short-urls')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the application if MongoDB connection fails
    });

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res, next) => {
    try {
        const { shortId } = req.params;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));