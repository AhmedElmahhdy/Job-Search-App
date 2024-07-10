import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/Job-Search-App")
  .then(() => {
    console.log('Successfully connected to the MongoDB database');
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
}

