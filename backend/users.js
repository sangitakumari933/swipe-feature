import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './models/User.js';
import Swipe from './models/Swipe.js';
import dotenv from 'dotenv';
dotenv.config();

async function fillUsers() {
  try {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Swipe.deleteMany({});

  // 1. Create Demo User
  const demoUser = await User.create({
    name: 'Demo User',
    age: 23,
    photo: faker.image.personPortrait({ size: 512 }),
    bio: 'Just exploring Coy!',
    city: 'Bangalore',
    isDemoUser: true
  });
  const dummyUsers = Array.from({ length: 30 }, (_, i) => ({
    name: faker.person.firstName(),
    age: faker.number.int({ min: 19, max: 28 }),
    photo: `https://i.pravatar.cc/600?img=${i + 1}`,
    bio: faker.person.bio(),
    city: faker.location.city(),
    isDemoUser: false
  }));

  const createdUsers = await User.insertMany(dummyUsers);

   const likes = [0, 2, 4, 6, 9, 12, 15, 20].map((idx) => ({
    swiperId: createdUsers[idx]._id,
    swipedId: demoUser._id,
    action: 'like'
  }));
  
  await Swipe.insertMany(likes);
  console.log('Database filled with demo and dummy users.');
} catch (error) {
  console.error('Error filling database:', error);
}
  process.exit(0);
}

fillUsers();