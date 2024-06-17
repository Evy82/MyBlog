const mongoose = require('mongoose');
require('dotenv').config();
const winston = require('winston'); // Add winston for better logging

// Configure winston for logging
const logger = configureLogger();

const mongoURI = process.env.MONGODB_URI;
const options = getMongoOptions();

connectToMongoDB(mongoURI, options);

// Handles MongoDB connection events
setupConnectionEvents();

function configureLogger() {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/mongodb.log' })
        ]
    });
}

function getMongoOptions() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false, // Don't build indexes automatically
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
}

function connectToMongoDB(uri, options) {
    mongoose.connect(uri, options)
        .then(() => logger.info('MongoDB connected successfully!'))
        .catch(err => logger.error('MongoDB connection error:', err));
}

function setupConnectionEvents() {
    mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected!'));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected! Reconnecting...'));
    mongoose.connection.on('error', err => logger.error(`MongoDB error: ${err}`));
}

module.exports = mongoose.connection;