let path = require("path");
let fixture = path.join(__dirname, "../.env");
let dotenv = require("dotenv").config({ path: fixture });
let config = dotenv.parsed;
module.exports = {
  EXPIRES_IN: process.env.EXPIRES_IN
    ? process.env.EXPIRES_IN
    : config?.EXPIRES_IN,
  WHITELIST: process.env.WHITELIST ? process.env.WHITELIST : config?.WHITELIST,
  PORT: process.env.PORT ? process.env.PORT : config?.PORT,
  HOST: process.env.HOST ? process.env.HOST : config?.HOST,
  NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : config?.NODE_ENV,
  USERNAME: process.env.USERNAME ? process.env.USERNAME : config.USERNAME,
  PASSWORD: process.env.PASSWORD ? process.env.PASSWORD : config.PASSWORD,
  REDIS_URL: process.env.REDIS_URL ? process.env.REDIS_URL : config.REDIS_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
    ? process.env.OPENAI_API_KEY
    : config.OPENAI_API_KEY,
};