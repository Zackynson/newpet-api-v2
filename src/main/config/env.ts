export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/newpet',
  serverPort: process.env.PORT || 3333,
  bcryptSaltNumber: 12,
};