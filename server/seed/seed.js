require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const schemesData = require('./seedData');

const seedDatabase = async () => {
  try {
    console.log('--- Seeding Indian Government Schemes Database ---');
    await connectDB();

    // Clear existing collections
    await Scheme.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing Schemes and Users.');

    // Seed Schemes
    const createdSchemes = await Scheme.insertMany(schemesData);
    console.log(`[Success]: Seeded ${createdSchemes.length} authentic Government Schemes.`);

    // Seed Admin User
    const adminUser = await User.create({
      name: 'National Admin Officer',
      email: 'admin@govscheme.nic.in',
      password: 'Admin@12345',
      phone: '9811001122',
      role: 'admin',
      state: 'Delhi',
      district: 'New Delhi',
      category: 'General',
      occupation: 'Salaried Employee',
      annualIncome: 1200000,
      education: 'Post Graduate'
    });
    console.log(`[Success]: Seeded Admin User (${adminUser.email} / Admin@12345)`);

    // Seed Demo Citizen User with sample profile
    const demoCitizen = await User.create({
      name: 'Rameshwar Lal Patel',
      email: 'citizen@example.com',
      password: 'Citizen@12345',
      phone: '9876543210',
      dateOfBirth: new Date('1988-06-15'),
      gender: 'Male',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      category: 'OBC',
      occupation: 'Farmer',
      annualIncome: 180000,
      education: '10th Pass',
      maritalStatus: 'Married',
      disabilityStatus: false,
      role: 'user',
      savedSchemes: [createdSchemes[0]._id, createdSchemes[1]._id]
    });
    console.log(`[Success]: Seeded Demo Citizen User (${demoCitizen.email} / Citizen@12345)`);

    console.log('--- Database Seeding Complete ---');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`[Seeding Failed]: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
