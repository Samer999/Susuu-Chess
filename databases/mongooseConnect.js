const dbURI = process.env.MONGODB_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

async function connectToMongo(mongoose) {
  try {
    await mongoose.connect(dbURI, options);
  } catch (err) {
    throw new Error('can not connect to mongodb');
  }
}

module.exports = connectToMongo;