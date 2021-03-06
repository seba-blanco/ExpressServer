require('dotenv').config()

module.exports = {
  MONGO_URI: process.env.MONGO_URI || '',
  FIRESTORE_FILE: process.env.FIRESTORE_FILE || '',
  DEFAULTSTORE:process.env.DEFAULTSTORE,
  EXPIRATION_TIME: process.env.EXPIRATION_TIME || 3000
}
