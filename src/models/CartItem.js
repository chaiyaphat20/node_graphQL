import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    collection: "cartItems",
  }
);

const cartItem = mongoose.model("cartItem", cartItemSchema);
export default cartItem;
export {cartItem}
