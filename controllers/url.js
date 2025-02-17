const shortid = require("shortid");
const URL = require("../models/url");

class URLController {
    static async handleGenerateNewShortURL(req, res) {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: "URL is required" });
            }

            const shortID = shortid.generate();
            await URL.create({
                shortId: shortID,
                redirectURL: url,
                visitHistory: [],
            });

            return res.json({ id: shortID });
        } catch (error) {
            console.error("Error generating short URL:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async handleAnalytics(req, res) {
        try {
            const { shortId } = req.params;
            const result = await URL.findOne({ shortId });
            if (!result) {
                return res.status(404).json({ error: "Short URL not found" });
            }

            return res.json({
                totalClicks: result.visitHistory.length,
                analytics: result.visitHistory,
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = URLController;