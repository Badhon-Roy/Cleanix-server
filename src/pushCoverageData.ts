import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Fix for Windows / ISP local DNS SRV resolution issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

dotenv.config({ path: path.join(process.cwd(), '.env') });

const ATLAS_URL = process.env.DB_URL || 'mongodb+srv://cleanix:HLDtGJM3m2JBVEA7@cluster0.wj0pjif.mongodb.net/cleanix?retryWrites=true&w=majority&appName=Cluster0';

const coverageAreaSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true },
    district: { type: String, required: true, default: 'Dhaka' },
    areasIncluded: { type: [String], required: true, default: [] },
    zipCodes: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CoverageArea = mongoose.models.CoverageArea || mongoose.model('CoverageArea', coverageAreaSchema);

const sampleCoverageData = [
  {
    zoneName: "Gulshan 1 & 2 VIP Zone",
    district: "Dhaka",
    areasIncluded: ["Gulshan 1", "Gulshan 2", "Diplomatic Zone", "Embassy Area"],
    zipCodes: ["1212"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Banani & DOHS Tech Hub",
    district: "Dhaka",
    areasIncluded: ["Banani", "Banani DOHS", "Corporate IT Hub", "Block 11"],
    zipCodes: ["1213"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Uttara Model Town (Sec 1-14)",
    district: "Dhaka",
    areasIncluded: ["Uttara Sector 1-7", "Uttara Sector 8-14", "Airport Road", "Turnover Hub"],
    zipCodes: ["1230"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Dhanmondi & Lalmatia Zone",
    district: "Dhaka",
    areasIncluded: ["Dhanmondi 27", "Dhanmondi 32", "Lalmatia", "Medical Zone"],
    zipCodes: ["1209"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Bashundhara R/A Villa & Condo Zone",
    district: "Dhaka",
    areasIncluded: ["Bashundhara Block A-D", "Bashundhara Block E-I", "Luxury Villa Hub"],
    zipCodes: ["1229"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Mohammadpur & Adabor Housing",
    district: "Dhaka",
    areasIncluded: ["Mohammadpur", "Adabor", "Japan Garden City", "Housing Society"],
    zipCodes: ["1207"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Badda, Rampura & Progoti Sarani",
    district: "Dhaka",
    areasIncluded: ["Middle Badda", "North Badda", "Rampura", "Pragati Sarani"],
    zipCodes: ["1212"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Motijheel & Dilkusha Financial District",
    district: "Dhaka",
    areasIncluded: ["Motijheel C/A", "Dilkusha", "Banking Sector", "Paltan"],
    zipCodes: ["1000"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Mirpur & Pallabi Housing Hub",
    district: "Dhaka",
    areasIncluded: ["Mirpur 1-14", "Pallabi", "Rupnagar", "Housing Colony"],
    zipCodes: ["1216"],
    isActive: true,
    isDeleted: false,
  },
  {
    zoneName: "Mohakhali & Tejgaon Commercial Zone",
    district: "Dhaka",
    areasIncluded: ["Mohakhali DOHS", "Tejgaon Industrial Area", "Commercial Showroom Hub"],
    zipCodes: ["1208", "1215"],
    isActive: true,
    isDeleted: false,
  },
];

async function pushCoverageToDB() {
  try {
    console.log('Connecting to MongoDB Atlas database...');
    await mongoose.connect(ATLAS_URL);
    console.log('Connected to MongoDB Atlas successfully!');

    console.log('Inserting 10 real coverage areas into CoverageArea collection...');
    for (const item of sampleCoverageData) {
      await CoverageArea.updateOne(
        { zoneName: item.zoneName },
        { $set: item },
        { upsert: true }
      );
      console.log(`Pushed Zone: ${item.zoneName}`);
    }

    console.log('SUCCESS! All 10 coverage areas pushed to MongoDB collection!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to push coverage data:', error);
    process.exit(1);
  }
}

pushCoverageToDB();
