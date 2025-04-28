const mongoose = require('mongoose');
const { Schema } = mongoose;

// Story Schema
const storySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapters',
  }],
  synopsis : {
    type : String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  votes: {
    type: Map,
    of: Boolean, // true for upvote, false for downvote
    default: {},
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likes: {
    type: Number,
    default: 0,
  }
},{
  timestamps : true
});

storySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
