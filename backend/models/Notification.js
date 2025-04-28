const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true, // Ensure the message is always present
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Ensure the notification is always associated with a user
    },
    status: {
        type: String,
        enum: ['read', 'unread'], // Only allow 'read' or 'unread' as valid values
        default: 'unread', // Default to 'unread' when a notification is created
    },
}, {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
