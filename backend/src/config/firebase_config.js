import admin from "firebase-admin";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const configPath = path.join(__dirname, "../../config.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8"));


const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

let serviceAccount;

// Priority 1: Environment Variable (Best for Vercel)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Loaded Firebase credentials from environment variable.");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
  }
}

// Priority 2: File System (Fallback for local development)
if (!serviceAccount) {
  if (fs.existsSync(serviceAccountPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      console.log("Loaded Firebase credentials from local file.");
    } catch (error) {
      console.error("Failed to read/parse serviceAccountKey.json:", error);
    }
  } else {
    console.warn(`Service account file not found at: ${serviceAccountPath}`);
    // Optional: Try resolving from process.cwd() for debugging context
    console.warn(`Current working directory: ${process.cwd()}`);
  }
}

if (!serviceAccount) {
  console.error("CRITICAL: No valid Firebase service account credentials found. Firebase features will fail.");
 
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const auth = admin.auth();

export { admin, auth };