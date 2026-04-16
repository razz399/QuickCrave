import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("Error: MONGO_URL is not defined in .env file.");
    process.exit(1);
  }
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch((err) => {
      console.error("DB Connection Error: ", err);
      process.exit(1);
    });
};
