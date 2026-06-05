require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Load models
const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Certification = require('./models/Certification');
const Social = require('./models/Social');

// Load seed data
const seedData = require('../seed-data.json');

const seed = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Clearing existing database entries...');

    // Delete existing records
    await Promise.all([
      Profile.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Certification.deleteMany({}),
      Social.deleteMany({})
    ]);

    console.log('Seeding portfolio details...');

    // Seed profile
    await Profile.create(seedData.profile);

    // Seed projects
    await Project.insertMany(seedData.projects);

    // Seed skills
    await Skill.insertMany(seedData.skills);

    // Seed experience
    await Experience.insertMany(seedData.experience);

    // Seed education
    await Education.insertMany(seedData.education);

    // Seed certifications
    await Certification.insertMany(seedData.certifications);

    // Seed social links
    await Social.create(seedData.social);

    // Seed admin account (if environment variables exist and not already seeded)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';

    if (process.env.NODE_ENV === 'production' && adminPassword === 'admin12345') {
      console.warn('⚠ WARNING: Using default admin password in production. Set ADMIN_PASSWORD in your environment.');
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Seeding Admin account: ${adminEmail}`);
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      
      await Admin.create({
        email: adminEmail,
        passwordHash
      });
      console.log('✓ Admin account created successfully.');
    } else {
      console.log('✓ Admin account already exists. Skipping...');
    }

    console.log('✓ Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(`✗ Error during database seeding: ${err.message}`);
    process.exit(1);
  }
};

seed();
