const express = require("express");

const verifyJwt = require("../middlewares/verify");
const User = require("../models/User");
const Story = require("../models/Story");
const Notification = require("../models/Notification");
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require('multer');
require("dotenv").config();
const router = express.Router();
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "user-images",
        allowed_formats : ['jpg' , 'jpeg' , 'png']
    }
});
const upload = multer({storage});

router.post("/image", verifyJwt, upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file.path; // New uploaded image URL
        const publicId = req.file.filename; // Get the public ID of the uploaded image
        const id = req.user.userId;

        // Find the user in the database
        const user = await User.findById(id);

        // Delete the previous image if it exists
        if (user.profilePicture) {
            // Extract public ID of the previous image
            const oldPublicId = user.profilePicture.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`user-images/${oldPublicId}`);
        }

        // Save the new profile picture
        user.profilePicture = imageUrl;
        await user.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            url: imageUrl,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Image upload failed', error });
    }
});

//User Profile
router.get("/me" ,verifyJwt  , async(req,res)=>{
    try {
        const id = req.user.userId;
        const user = await User.findById(id).select('-password');
        if(!user){
            return res.status(404).json({"Message" : "User Not Found"})
        }
        return res.status(200).json({"User" : user});
    } catch (error) {
        return res.status(401).json({"Message" : "Login First"})
    }
});

//Creating A New Story

router.post("/story" , verifyJwt , async(req,res)=>{
    try {
        const {title , synopsis, tags } = req.body;
        const id = req.user.userId;
        const user = await User.findById(id).select('-password');
        const story = new Story({
            title : title,
            synopsis : synopsis,
            author : user._id,
            tags : tags,
        });
        
        await story.save();
        user.storiesCreated.push(story._id);
        user.storiesParticipated.push(story._id);
        await user.save();
        return res.status(200).json({"Message" : "Story Created" , "id" : story._id})
    } catch (error) {
        return res.status(404).json({"Message" : error})
    }
});

//Joining the Story

/*router.post("/join-story" , verifyJwt , async(req,res)=>{
    try {
        const {storyId} = req.body;
        const id = req.user;
        const user = await User.findById(id);
        const isStory = await Story.findById(storyId);
        if(!isStory){
            return res.status(404).json({"Message" : "Story Not Found"});
        }
        isStory.collaborators.push(user._id);
        user.storiesParticipated.push(isStory._id);
        await user.save();
        await isStory.save();
        return res.status(200).json({"Message" : "You are now a collaborator"})
    } catch (error) {
        return res.status(404).json({"Message" : "error occured"});
    }
});*/

//Inviting Collaborators

router.post("/invite", verifyJwt, async (req, res) => {
    try {
      const { storyId, userIds } = req.body;
      const id = req.user.userId;
      const user = await User.findById(id);
      
      // Check if the story exists
      const story = await Story.findById(storyId).populate('author', 'username');
      
      if (!story) {
        return res.status(404).json({ "Message": "Story not found." });
      }
      
      if (!story.author.equals(id)) {
        return res.status(403).json({ "Message": "You are not authorized to invite users to this story." });
      }
  
      const notifications = [];
      for (const userId of userIds) {
        notifications.push({
          message: `You have been invited by ${story.author.username} to collaborate on the story "${story.title}". Checkout your invite section to manage the invitations.`,
          userId,
        });
  
        // Check if the user already has the invite
        if (!user.invites.includes(storyId)) {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { invites: storyId },
          }, { new: true });
        }
      }
  
      await Notification.insertMany(notifications);
      return res.status(200).json({ "Message": "Invitations sent successfully" });
    } catch (error) {
      console.error("Error in /invite route:", error);
      return res.status(500).json({ "Message": error.message });
    }
  });
  

// Invitations
router.get("/invites", verifyJwt, async (req, res) => {
    try {
        const id = req.user.userId;

        // Fetch user with populated invites
        const user = await User.findById(id).populate("invites");

        if (!user) {
            return res.status(404).json({ "Message": "User not found" });
        }

        const invites = user.invites || []; // Default to an empty array if no invites

        if (invites.length > 0) {
            return res.status(200).json({ "Message": invites });
        } else {
            return res.status(404).json({ "Message": "No invites found" });
        }
    } catch (error) {
        console.error("Error in /invites route:", error);
        return res.status(500).json({ "Message": "An unexpected error occurred. Please try again." });
    }
});

router.post("/accept/:id" , verifyJwt , async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const story = await Story.findById(id);
        if(story){
            story.collaborators.push(userId);
            user.invites =  user.invites.filter(invite=>invite.toString() !==id);
            const notification = [
                {
                    message : `You have accepted the invitation for the story ${story.title}`,
                    userId : userId
                },
                {
                    message : `${user.username} has accepted your invitation for the story ${story.title}`,
                    userId : story.author
                }
            ];
            user.storiesParticipated.push(story._id);
            await Notification.insertMany(notification);
            await user.save();
            await story.save();
            res.status(200).json({ message: "Invitation accepted successfully" });

        }
    } catch (error) {
        console.error("Error accepting invite:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.post("/reject/:id", verifyJwt, async (req, res) => {
    try {
        // Get the story ID from params and the user ID from the JWT
        const { id } = req.params;  // Destructure id from params
        const userId = req.user.userId;

        // Fetch the user and story
        const user = await User.findById(userId);
        const story = await Story.findById(id);

        if (!user || !story) {
            return res.status(404).json({ message: "User or story not found" });
        }

        // Remove the rejected story ID from user's invites
        user.invites = user.invites.filter(invite => invite !== id);

        // Create rejection notifications
        const notifications = [
            {
                message: `You have rejected the invitation for the story ${story.title}`,
                userId: userId,
            },
            {
                message: `${user.username} has rejected your invitation for the story ${story.title}`,
                userId: story.author,
            },
        ];

        // Insert notifications into the Notification collection
        await Notification.insertMany(notifications);

        // Save the changes to the user
        await user.save();

        // Send success response
        res.status(200).json({ message: "Invitation rejected successfully" });

    } catch (error) {
        console.error("Error rejecting invite:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Getting the joined stories

router.get('/joined-stories', verifyJwt, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch user and populate the referenced story fields
        const user = await User.findById(userId)
            .populate('storiesParticipated','title content synopsis status')
            .populate('storiesCreated' , 'title content synopsis status');

        if (!user) {
            return res.status(404).json({ "Message": "User not found" });
        }

        // Return the joined stories
        const response = {
            storiesParticipated: user.storiesParticipated || [],
            storiesCreated: user.storiesCreated || [],
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching joined stories:', error);
        return res.status(500).json({ "Message": error.message });
    }
});


router.get("/find", verifyJwt, async (req, res) => {
    try {
      const { username } = req.query; // Extract the username query parameter
      const collaborator = await User.findOne({ username });
      if (collaborator) {
        res.status(200).json({
          "username": collaborator.username,
          "img": collaborator.profilePicture,
          "id": collaborator._id
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding user" });
    }
  });
  
  router.get("/notification", verifyJwt, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch notifications based on userId
        const notifications = await Notification.find({ userId: userId ,status : 'unread'});

        // Check if notifications exist
        if (notifications.length > 0) {
            // Map to extract necessary data from notifications
            const notificationMessages = notifications.map(notification => notification.message);
            res.status(200).json({ "Notifications": notificationMessages });
        } else {
            res.status(404).json({ message: "Notifications not found", userId });
        }
    } catch (error) {
        console.error("Error finding notifications:", error);
        res.status(500).json({ message: "Error finding notifications" });
    }
});


router.put("/mark-as-read", verifyJwt, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Update notifications for the user to mark them as 'read'
        const result = await Notification.updateMany(
            { userId: userId, status: 'unread' }, // Filter unread notifications
            { $set: { status: 'read' } }          // Set status to 'read'
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Notifications marked as read", modifiedCount: result.modifiedCount });
        } else {
            res.status(404).json({ message: "No unread notifications to mark as read" });
        }
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ message: "Error updating notifications" });
    }
});

router.get('/user', verifyJwt, async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'ID is required' });
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  });
  

// Follow a user
router.post("/follow/:id", verifyJwt, async (req, res) => {
    try {
        const currentUserId = req.user.userId; // Extract current user's ID from the token
        const targetUserId = req.params.id; // The ID of the user to follow

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        // Fetch users
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        // Check if both users exist
        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found." });
        }
        if (!targetUser) {
            return res.status(404).json({ message: "Target user not found." });
        }

        // Check if already following
        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You already follow this user." });
        }

        // Add the follow relationship
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        // Save the updates
        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: "User followed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred.", error });
    }
});


// Unfollow a user
router.post("/unfollow/:id", verifyJwt, async (req, res) => {
    try {
        const currentUserId = req.user.userId; // Extract current user's ID from the token
        const targetUserId = req.params.id; // The ID of the user to unfollow

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot unfollow yourself." });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You do not follow this user." });
        }

        currentUser.following = currentUser.following.filter(
            (userId) => userId.toString() !== targetUserId
        );
        targetUser.followers = targetUser.followers.filter(
            (userId) => userId.toString() !== currentUserId
        );

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error });
    }
});


// Get followers of a user
router.get("/followers/:id", verifyJwt, async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const targetUser = await User.findById(targetUserId).populate("followers", "username email profilePicture");
        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Followers retrieved successfully.",
            followers: targetUser.followers,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error });
    }
});

// Get following of a user
router.get("/following/:id", verifyJwt, async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const targetUser = await User.findById(targetUserId).populate("following", "username email profilePicture");
        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Following retrieved successfully.",
            following: targetUser.following,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error });
    }
});


module.exports = router;