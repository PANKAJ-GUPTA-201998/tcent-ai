/**
 * Seed Script — CareerPersonalityMatch
 * ------------------------------------
 * Inserts 5 career profiles with realistic Indian salary ranges.
 *
 * Run from the auth-service directory:
 *   node scripts/seedCareers.js
 *
 * Safe to re-run — uses updateOne + upsert on title so no duplicates.
 */

require('dotenv').config(); // loads .env from auth-service root
const mongoose = require('mongoose');
const CareerPersonalityMatch = require('../src/models/CareerPersonalityMatch');

// ── Seed Data ────────────────────────────────────────────────────────────────

const careers = [
  {
    title: 'Product Manager',
    description:
      'Product Managers define product vision, prioritise features, and align engineering, design, and business teams to deliver user value. They act as the bridge between customer needs and technical execution.',
    industry: 'technology',
    idealProfile: {
      riasecCodes: ['E', 'I', 'S'],          // Enterprising → Investigative → Social
      workValuesPriority: ['impact', 'growth', 'autonomy'],
      bigFiveIdeal: {
        openness:          'high',
        conscientiousness: 'high',
        extraversion:      'high',
        agreeableness:     'medium',
        neuroticism:       'low'
      }
    },
    salaryRange: {
      entry:  { min: 800000,  max: 1400000, currency: 'INR' }, // 8–14 LPA
      mid:    { min: 1500000, max: 2800000, currency: 'INR' }, // 15–28 LPA
      senior: { min: 3000000, max: 6000000, currency: 'INR' }  // 30–60 LPA
    },
    demandTrend: 'high_growth'
  },

  {
    title: 'UX Designer',
    description:
      'UX Designers craft intuitive, accessible user experiences through research, wireframing, prototyping, and usability testing. They ensure products are not just functional but delightful to use.',
    industry: 'design',
    idealProfile: {
      riasecCodes: ['A', 'I', 'S'],          // Artistic → Investigative → Social
      workValuesPriority: ['creativity', 'impact', 'growth'],
      bigFiveIdeal: {
        openness:          'high',
        conscientiousness: 'medium',
        extraversion:      'medium',
        agreeableness:     'high',
        neuroticism:       'low'
      }
    },
    salaryRange: {
      entry:  { min: 500000,  max: 900000,  currency: 'INR' }, // 5–9 LPA
      mid:    { min: 1000000, max: 2000000, currency: 'INR' }, // 10–20 LPA
      senior: { min: 2200000, max: 4500000, currency: 'INR' }  // 22–45 LPA
    },
    demandTrend: 'growing'
  },

  {
    title: 'Data Scientist',
    description:
      'Data Scientists extract insights from large datasets using statistics, machine learning, and visualisation. They build predictive models and help organisations make data-driven decisions.',
    industry: 'technology',
    idealProfile: {
      riasecCodes: ['I', 'C', 'R'],          // Investigative → Conventional → Realistic
      workValuesPriority: ['growth', 'autonomy', 'creativity'],
      bigFiveIdeal: {
        openness:          'high',
        conscientiousness: 'high',
        extraversion:      'low',
        agreeableness:     'any',
        neuroticism:       'low'
      }
    },
    salaryRange: {
      entry:  { min: 700000,  max: 1200000, currency: 'INR' }, // 7–12 LPA
      mid:    { min: 1400000, max: 2500000, currency: 'INR' }, // 14–25 LPA
      senior: { min: 2800000, max: 5500000, currency: 'INR' }  // 28–55 LPA
    },
    demandTrend: 'high_growth'
  },

  {
    title: 'Software Engineer',
    description:
      'Software Engineers design, build, and maintain software systems — from backend APIs and databases to frontend interfaces. They solve complex technical problems and collaborate closely with product and design teams.',
    industry: 'technology',
    idealProfile: {
      riasecCodes: ['I', 'R', 'C'],          // Investigative → Realistic → Conventional
      workValuesPriority: ['growth', 'autonomy', 'stability'],
      bigFiveIdeal: {
        openness:          'high',
        conscientiousness: 'high',
        extraversion:      'any',
        agreeableness:     'medium',
        neuroticism:       'low'
      }
    },
    salaryRange: {
      entry:  { min: 600000,  max: 1200000, currency: 'INR' }, // 6–12 LPA
      mid:    { min: 1400000, max: 2800000, currency: 'INR' }, // 14–28 LPA
      senior: { min: 3000000, max: 7000000, currency: 'INR' }  // 30–70 LPA
    },
    demandTrend: 'high_growth'
  },

  {
    title: 'Marketing Manager',
    description:
      'Marketing Managers develop and execute campaigns that grow brand awareness, generate leads, and drive revenue. They blend creative storytelling with data analytics to reach the right audience at the right time.',
    industry: 'marketing',
    idealProfile: {
      riasecCodes: ['E', 'S', 'A'],          // Enterprising → Social → Artistic
      workValuesPriority: ['creativity', 'impact', 'growth'],
      bigFiveIdeal: {
        openness:          'high',
        conscientiousness: 'medium',
        extraversion:      'high',
        agreeableness:     'high',
        neuroticism:       'low'
      }
    },
    salaryRange: {
      entry:  { min: 450000,  max: 800000,  currency: 'INR' }, // 4.5–8 LPA
      mid:    { min: 900000,  max: 1800000, currency: 'INR' }, // 9–18 LPA
      senior: { min: 2000000, max: 4000000, currency: 'INR' }  // 20–40 LPA
    },
    demandTrend: 'growing'
  }
];

// ── Run ──────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    let inserted = 0;
    let updated  = 0;

    for (const career of careers) {
      const result = await CareerPersonalityMatch.updateOne(
        { title: career.title },   // match on title
        { $set: career },          // upsert full document
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount) {
        console.log(`  ➕ Inserted: ${career.title}`);
        inserted++;
      } else {
        console.log(`  ♻️  Updated:  ${career.title}`);
        updated++;
      }
    }

    console.log(`\n✅ Seed complete — ${inserted} inserted, ${updated} updated`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

seed();
