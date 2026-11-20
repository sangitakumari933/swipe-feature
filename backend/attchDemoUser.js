import User from './models/User.js';

export const attachDemoUser = async (req, res, next) => {
  try {
    const demoUser = await User.findOne({ isDemoUser: true });
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found. Run node seed.js first.' });
    }
    req.user = demoUser;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to load demo user' });
  }
};