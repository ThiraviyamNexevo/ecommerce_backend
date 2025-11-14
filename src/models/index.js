"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

/**
 * ✅ SAFETY CHECK:
 * Loads only true Sequelize model files.
 * Ignores any accidental controller or route files.
 */
fs.readdirSync(__dirname)
  .filter((file) => {
    // skip hidden files, index.js, and non-JS files
    if (
      file.indexOf(".") === 0 ||
      file === basename ||
      !file.endsWith(".js")
    ) {
      return false;
    }

    // skip route or controller files accidentally placed in /models
    const lower = file.toLowerCase();
    if (lower.includes("route") || lower.includes("controller")) {
      return false;
    }

    return true;
  })
  .forEach((file) => {
    const filePath = path.join(__dirname, file);

    try {
      // Dynamically import and initialize the model
      const modelFactory = require(filePath);

      if (typeof modelFactory === "function") {
        const model = modelFactory(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        console.log(`✅ Model loaded: ${model.name}`);
      } else {
        console.warn(`⚠️ Skipped non-model file: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Error loading model file: ${file}`, err.message);
    }
  });

/**
 * ✅ Run associations after all models are loaded
 */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ All models initialized:", Object.keys(db));

module.exports = db;
