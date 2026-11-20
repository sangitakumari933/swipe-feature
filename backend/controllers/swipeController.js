import User from '../models/User.js';
import Swipe from '../models/Swipe.js';

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const mySwipes = await Swipe.find({ swiperId: currentUserId }).select('swipedId');
    const excludedIds = mySwipes.map((s) => s.swipedId);
    excludedIds.push(currentUserId);

    const feed = await User.find({
      _id: { $nin: excludedIds }
    });

    res.json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

export const recordSwipe = async (req, res) => {
  try {
    const { swipedId, action } = req.body;
    const swiperId = req.user._id;

    if (!swipedId || !['like', 'pass'].includes(action)) {
      return res.status(400).json({ error: 'Invalid swipedId or action' });
    }

    await Swipe.findOneAndUpdate(
      { swiperId, swipedId },
      { action },
      { upsert: true, new: true }
    );

    let isMatch = false;
    let matchedUser = null;

    if (action === 'like') {
      const reverseLike = await Swipe.findOne({
        swiperId: swipedId,
        swipedId: swiperId,
        action: 'like'
      });

      if (reverseLike) {
        isMatch = true;
        matchedUser = await User.findById(swipedId);
      }
    }
    res.json({ success: true, match: isMatch, matchedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
};

export const matches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const myLikes = await Swipe.find({
      swiperId: currentUserId,
      action: 'like'
    }).select('swipedId');

    const myLikedUserIds = myLikes.map((s) => s.swipedId);

    const mutualSwipes = await Swipe.find({
      swiperId: { $in: myLikedUserIds },
      swipedId: currentUserId,
      action: 'like'
    }).populate('swiperId');

    const matches = mutualSwipes.map((s) => s.swiperId);

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};