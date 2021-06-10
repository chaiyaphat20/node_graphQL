import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cartItem",
      },
    ],
    created_at: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    collection: "Users",
  }
);

const User = mongoose.model("User", userSchema);
export default User;
