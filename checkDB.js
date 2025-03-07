const mongoose = require('mongoose');
require('dotenv').config({ path: './main.env' });

 // Load environment variables from .env file

const mongoURI = process.env.MONGO_URI; // Ensure your .env file has MONGO_URI

if (!mongoURI) {
  console.error("MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", async () => {
  console.log("✅ Connected to MongoDB!");

  try {
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log("📂 Available Databases:", dbs.databases);
  } catch (err) {
    console.error("❌ Error listing databases:", err);
  } finally {
    mongoose.connection.close();
  }
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
