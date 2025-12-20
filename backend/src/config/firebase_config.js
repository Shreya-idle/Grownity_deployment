import admin from "firebase-admin";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 
const configPath = path.join(__dirname, "../../config.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8"));

 
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.js");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

 
const auth = admin.auth();

export { admin, auth };