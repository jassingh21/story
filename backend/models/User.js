const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  profilePicture: {
    type: String, // URL or file path to the profile picture
    default: "https://res.cloudinary.com/dj2udhdml/image/upload/v1733168211/profile_s6lfkp.png"
  },
  bio: {
    type: String,
    maxlength: 500
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  storiesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  storiesParticipated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  invites : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Story'
  }]
});

// Pre-save hook to hash the password before saving to DB
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next(); // Only hash the password if it has been modified
  }
  
  try {
    // Hash the password with a salt rounds of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password


const User = mongoose.model('User', UserSchema);

module.exports = User;
