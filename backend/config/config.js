let path = require("path");
const fs = require("fs");
let fixture = path.join(__dirname, "../.env");
let dotenv = require("dotenv").config({ path: fixture });
let config = dotenv.parsed;
module.exports = {
  local: {
    username: process.env.DBUSERNAME
      ? process.env.DBUSERNAME
      : config?.DBUSERNAME,
    password: process.env.DBPASSWORD
      ? process.env.DBPASSWORD
      : config?.DBPASSWORD,
    database: process.env.DBNAME ? process.env.DBNAME : config?.DBNAME,
    host: process.env.DBHOST ? process.env.DBHOST : config?.DBHOST,
    port: process.env.DBPORT ? process.env.DBPORT : config?.DBPORT,
    dialect: 'mysql',
    timezone: "+05:30",
    dialectOptions: {
      timezone: "+05:30",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  development: {
    username: process.env.DBUSERNAME
      ? process.env.DBUSERNAME
      : config?.DBUSERNAME,
    password: process.env.DBPASSWORD
      ? process.env.DBPASSWORD
      : config?.DBPASSWORD,
    database: process.env.DBNAME ? process.env.DBNAME : config?.DBNAME,
    host: process.env.DBHOST ? process.env.DBHOST : config?.DBHOST,
    port: process.env.DBPORT ? process.env.DBPORT : config?.DBPORT,
    dialect: 'mysql',
    ssl: true,
    timezone: "+05:30",
    dialectOptions: {
      bigNumberStrings: true,
      timezone: "+05:30",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  qa: {
    username: process.env.DBUSERNAME
      ? process.env.DBUSERNAME
      : config?.DBUSERNAME,
    password: process.env.DBPASSWORD
      ? process.env.DBPASSWORD
      : config?.DBPASSWORD,
    database: process.env.DBNAME ? process.env.DBNAME : config?.DBNAME,
    host: process.env.DBHOST ? process.env.DBHOST : config?.DBHOST,
    port: process.env.DBPORT ? process.env.DBPORT : config?.DBPORT,
    dialect: 'mysql',
    ssl: true,
    timezone: "+05:30",
    dialectOptions: {
      bigNumberStrings: true,
      timezone: "+05:30",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  production: {
    username: process.env.DBUSERNAME
      ? process.env.DBUSERNAME
      : config?.DBUSERNAME,
    password: process.env.DBPASSWORD
      ? process.env.DBPASSWORD
      : config?.DBPASSWORD,
    database: process.env.DBNAME ? process.env.DBNAME : config?.DBNAME,
    host: process.env.DBHOST ? process.env.DBHOST : config?.DBHOST,
    port: process.env.DBPORT ? process.env.DBPORT : config?.DBPORT,
    dialect: 'mysql',
    ssl: true,
    dialectOptions: {
      bigNumberStrings: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
};