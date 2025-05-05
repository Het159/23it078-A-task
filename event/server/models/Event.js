const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Academic',
            'Cultural',
            'Sports',
            'Technical',
            'Workshop',
            'Seminar',
            'Other',
        ],
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Please add maximum number of participants'],
    },
    currentParticipants: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Event', eventSchema); 