import mongoose from 'mongoose';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const yml = load(readFileSync(path.resolve(__dirname, '../../config.yaml'), 'utf8'));
const uri = yml.db_url;

 
const connectDB = async () => {
  try {
 
    await mongoose.connect(uri, {
      serverApi: {
        version: '1',  
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log("Successfully established a persistent connection to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

export default connectDB;