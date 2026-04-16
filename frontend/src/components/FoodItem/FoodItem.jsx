import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext); 

  // Handle broken images
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/400x300/f0f0f0/ff4c24?text=Food+Image";
  };

  // Use Cloudinary URL directly if it's a full URL, otherwise construct relative path
  const imageSource = image && image.startsWith("http") 
    ? image 
    : url + "/images/" + encodeURIComponent(image);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img 
          src={imageSource} 
          alt={name} 
          className="food-item-image" 
          onError={handleImageError}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
