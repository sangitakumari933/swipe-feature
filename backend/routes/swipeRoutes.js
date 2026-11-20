import express from 'express';
const router = express.Router();
import { getUsers, recordSwipe, matches } from '../controllers/swipeController.js';


router.get('/feed', getUsers);
router.post('/swipe', recordSwipe);
router.get('/matches', matches);

export default router;