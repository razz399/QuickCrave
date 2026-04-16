import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

// add food items

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Please upload an image" });
    }

    let image_url = req.file.path; // Cloudinary URL
    console.log("Image uploaded to Cloudinary:", image_url);
    
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url,
    });
    
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      console.log("Food added successfully:", food._id);
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.json({ success: false, message: error.message || "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error listing foods:", error.message);
    res.json({ success: false, message: error.message || "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      
      if (!food) {
        return res.json({ success: false, message: "Food not found" });
      }
      
      // Delete from Cloudinary
      if (food.image) {
        try {
          const publicId = food.image.split('/').pop().split('.')[0];
          const folder = "QuickCrave/foods";
          console.log("Deleting from Cloudinary:", `${folder}/${publicId}`);
          await cloudinary.uploader.destroy(`${folder}/${publicId}`);
        } catch (cloudinaryError) {
          console.error("Error deleting from Cloudinary:", cloudinaryError.message);
        }
      }
      
      await foodModel.findByIdAndDelete(req.body.id);
      console.log("Food removed successfully:", req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error("Error removing food:", error.message);
    res.json({ success: false, message: error.message || "Error" });
  }
};

export { addFood, listFood, removeFood };
