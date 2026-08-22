import dns from 'node:dns';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

// Fix for Windows / ISP local DNS SRV resolution issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback if environment doesn't allow setting custom DNS
}

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    app.listen(config.port, () => {
      console.log(`🚀 Cleanix app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
