import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim:true
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim:true
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    created_at:{
      type:Date,
      required:true,
      default:()=>Date.now()
    }
  },
  {
    collection: "Products",
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
