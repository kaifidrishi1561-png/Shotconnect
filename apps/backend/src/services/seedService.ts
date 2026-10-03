import mongoose from 'mongoose';
import { User } from '../models/User';
import { BrandProfile } from '../models/BrandProfile';
import { PhotographerProfile } from '../models/PhotographerProfile';
import { StylistProfile } from '../models/StylistProfile';
import { Portfolio } from '../models/Portfolio';
import { Project } from '../models/Project';
import { Review } from '../models/Review';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  const counts = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Portfolio.countDocuments(),
    Review.countDocuments()
  ]);

  if (counts.some((count) => count > 0)) {
    return;
  }

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const brandPassword = await bcrypt.hash('Brand@123', 10);
  const photographerPassword = await bcrypt.hash('Photo@123', 10);
  const stylistPassword = await bcrypt.hash('Style@123', 10);

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@shotmatch.com',
    password: adminPassword,
    role: 'ADMIN',
    status: 'ACTIVE',
    isEmailVerified: true
  });

  const brands = await User.insertMany(
    Array.from({ length: 10 }, (_, index) => ({
      firstName: `Brand${index + 1}`,
      lastName: 'Owner',
      email: `brand${index + 1}@shotmatch.com`,
      password: brandPassword,
      role: 'BRAND',
      status: 'ACTIVE',
      isEmailVerified: true,
      location: index % 2 === 0 ? 'Bengaluru' : 'Delhi'
    }))
  );

  const photographers = await User.insertMany(
    Array.from({ length: 20 }, (_, index) => ({
      firstName: `Photographer${index + 1}`,
      lastName: 'Pro',
      email: `photo${index + 1}@shotmatch.com`,
      password: photographerPassword,
      role: 'PHOTOGRAPHER',
      status: 'ACTIVE',
      isEmailVerified: true,
      location: index % 3 === 0 ? 'Bengaluru' : index % 3 === 1 ? 'Mumbai' : 'Hyderabad'
    }))
  );

  const stylists = await User.insertMany(
    Array.from({ length: 10 }, (_, index) => ({
      firstName: `Stylist${index + 1}`,
      lastName: 'Style',
      email: `stylist${index + 1}@shotmatch.com`,
      password: stylistPassword,
      role: 'STYLIST',
      status: 'ACTIVE',
      isEmailVerified: true,
      location: index % 2 === 0 ? 'Bengaluru' : 'Pune'
    }))
  );

  await BrandProfile.insertMany(
    brands.map((brand) => ({
      user: brand._id,
      companyName: `${brand.firstName} Studio`,
      brandType: 'D2C',
      marketPlaces: ['Amazon', 'Shopify'],
      productCategories: ['Fashion', 'Home Decor']
    }))
  );

  await PhotographerProfile.insertMany(
    photographers.map((photographer, index) => ({
      user: photographer._id,
      location: photographer.location,
      experience: (index % 6) + 2,
      specializations: ['Product', 'Lifestyle'],
      equipment: ['Canon R5', 'Softbox', 'Tripod'],
      photographyStyles: ['Studio', 'Minimal'],
      pricing: { basePackage: 8000 + index * 300, perShot: 150, videoRate: 3000 },
      availability: ['Monday', 'Tuesday', 'Wednesday'],
      averageRating: 4.2 + (index % 5) * 0.2,
      totalProjects: 10 + index,
      portfolioCount: 8 + (index % 10),
      isVerified: true
    }))
  );

  await StylistProfile.insertMany(
    stylists.map((stylist, index) => ({
      user: stylist._id,
      location: stylist.location,
      stylingCategories: ['Fashion', 'Beauty'],
      pricing: { sessionRate: 5000 + index * 200, packageRate: 12000 },
      availability: ['Thursday', 'Friday'],
      isVerified: true
    }))
  );

  await Portfolio.insertMany(
    photographers.slice(0, 10).map((photographer, index) => ({
      user: photographer._id,
      title: `Portfolio ${index + 1}`,
      description: 'Example product photography project',
      category: index % 2 === 0 ? 'Fashion' : 'Home Decor',
      tags: ['studio', 'hero shot', 'ecommerce'],
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      clientType: 'Ecommerce'
    }))
  );

  await Project.insertMany(
    brands.slice(0, 5).map((brand, index) => ({
      brand: brand._id,
      title: `Campaign ${index + 1}`,
      category: index % 2 === 0 ? 'Fashion' : 'Home Decor',
      productName: 'Sample Product',
      numberOfProducts: 8,
      requiredPhotos: 40,
      photographyStyle: 'Studio',
      description: 'Need a sharp ecommerce shoot for launch',
      referenceImages: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518'],
      budget: 20000,
      location: brand.location,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      status: 'OPEN'
    }))
  );

  await Review.insertMany([
    {
      project: new mongoose.Types.ObjectId(),
      reviewer: brands[0]._id,
      targetUser: photographers[0]._id,
      rating: 5,
      comment: 'Excellent execution and fast turnaround.'
    }
  ]);

  await User.findByIdAndUpdate(admin._id, { isEmailVerified: true });
};
