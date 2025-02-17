const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

class MongoDBConnection {
    static async connect(url) {
        try {
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }
}

module.exports = MongoDBConnection;