import Product from "../models/Product";
import User from "../models/user";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {config} from '../config'
export const Query = {
  login:async(parent, args, context, info) =>{
    const {email , password} = args

    //find user in database
    const user = await User.findOne({email})

    if(!user) throw new Error("Email not found, please sign up")

    //Check if password is correct
    const comparePassword = bcrypt.compareSync(password ,user.password)
    if(!comparePassword) throw new Error("Email or password is invalid")

    //return access token
    const accessToken =  jwt.sign({},config.secret_jwt,{audience:user.id,expiresIn:60*5})
    const response = {
      userId:user.id,
      token:accessToken
    }
    return response
  } ,
  user: (parent, args, context, info) =>{
    // get value from context  in src/schema/schema.graphQl
    const {userId} = context

    //check if user login
    if(!userId) throw new Error("Please Login!")

    //find only owner userId
    if(userId !== args.id) throw new Error("Not for Authorized")

    //response data
    const response =  User.findById(args.id).populate({
      path: "products",
      populate: { path: "user"},
    }).populate({ path: "carts", populate: { path: "product" }})
    return response
  },

  users: (parent, args, context, info) =>
    User.find({}).populate({
      path: "products",
      populate: { path: "user" },
    }).populate({ path: "carts", populate: { path: "product" }}),
  product: (parent, args, context, info) =>
    Product.findById(args.id).populate({
      path: "user",
      populate: { path: "products" },
    }),
  products: (parent, args, context, info) =>
    Product.find().populate({
      path: "user",
      populate: { path: "products" },
    }),
};

// ex
// query{
//   product(id:"60bee5e5dce90016dc758e09"){
//     id
//     description
//     price
//     imageUrl
//     user{
//       id
//       name
//       email
//       products{
//         description
//       }
//     }
//   }
// }




// query{
//   user(id:"60beddd60358b50f9c6c2880"){
//     id
//     name
//     email
//     password
//     products{
//       id
//       description
//       price
//       user{
//         name
//         name
//         products{
//           description
//         }
//       }
//     }
//   }
// }