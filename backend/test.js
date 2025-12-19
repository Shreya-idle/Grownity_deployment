import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const BASE_URL = 'https://indian-community-beta.vercel.app//api/communities';

// Sample ZoneEnum values (adjust according to your app)
const zoneEnumValues = [
  'north_zone', 'south_zone', 'west_zone', 'central_zone'
];

// Sample domains to cycle through
const sampleDomains = ['technology', 'education', 'health', 'environment', 'sports'];

// Generate a single community data object for creation
function generateCommunityData(i) {
  return {
    _communityAdminid: new mongoose.Types.ObjectId().toString(), // Replace with a valid existing admin ID
    name: `Automated Test Community #${i}`,
    description: `Description for community #${i} created by script.`,
    zone: zoneEnumValues[i % zoneEnumValues.length],
    city: `Test City ${i}`,
    pincode: (100000 + i).toString(),
    domain: sampleDomains[i % sampleDomains.length],
    tagline: `Tagline for community #${i}`,
    social_links: {
      website: `https://www.testcommunity${i}.com`,
      linkedin: `https://linkedin.com/company/testcommunity${i}`,
      twitter: `https://twitter.com/testcommunity${i}`
    },
    members: [
      {
        name: `Founder ${i}`,
        role: 'Founder',
        isFounder: true,
        linkedin: `https://linkedin.com/in/founder${i}`,
        twitter: `@founder${i}`,
        email: `founder${i}@testcommunity.com`
      }
    ],
    status: 'pending'
  };
}

async function createCommunity(communityData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(communityData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create community: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function seedCommunities(count = 50) {
  console.log(`Starting to create ${count} communities via API...`);

  for (let i = 20; i <= count; i++) {
    const communityData = generateCommunityData(i);

    try {
      const result = await createCommunity(communityData);
      console.log(`Community #${i} created successfully. ID: ${result._id}`);
    } catch (error) {
      console.error(`Error creating community #${i}:`, error.message);
    }
  }

  console.log('Community creation process completed.');
}

seedCommunities();
