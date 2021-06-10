import User from "../models/user";
import bcrypt from "bcrypt";
import Product from "../models/Product";
import {cartItem} from "../models/CartItem";

export const Mutation = {
  signup: async (parent, args, context, info) => {
    // args = name:String!,email:String!,password:String!  of signup(name:String!,email:String!,password:String!):User

    //Trim Lower case email password
    const emailTrim = args.email.trim().toLowerCase();
    const password = args.password.trim();

    //check email already in database
    const currentUser = await User.find({ email: emailTrim });
    if (currentUser.length) {
      throw Error("Email is already");
    }

    //check validate password
    if (password.length < 6) {
      throw Error("Password must be at least 6 character");
    }

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = bcrypt.hashSync(args.password, salt);

    // create new user
    const newUser = await User.create({
      ...args,
      password: passwordHashed,
      email: emailTrim,
    });
    return newUser;
  },
  createProduct: async (parent, args, {userId}, info) => {

    // NO have token
    if(!userId)  throw new Error("Please Login!")

    if (!args.description || !args.price || !args.imageUrl) {
      throw new Error("Please Provide a required fails.");
    }

    //product
    // const userId = "60bf3ce5dc7c61250c3ca7c6";
    const product = await Product.create({ ...args, user: userId });

    //creat user
    const user = await User.findById(userId);
    console.log("user",user)
    if (!user.products) {  //ถ้า user นั้นไม่มี product เลยมันจะสร้าง filed product ขึ้นมาแล้วใส่ ค่า product ใหม่ ไปใน  array เลย
      user.products = [product]; //มันจะเอาแค่ product id มาใส่ใน filed ของ user
    } else {
      //old user
      user.products.push(product);  
      //ถ้ามี field product นั้นให้ add ค่า product ที่เจอใหม่เข้าไปเลย
      //แต่เนื่องจาก Model ของ user มันมี files product ที่เป็น type:Object ไอดี มันเลยเอาแค่ ObjectIDของ productมา มา
    }

    await user.save()
    return Product.findById(product.id).populate({
      path:'user',
      populate:{path:'products'}
    })
  },

  updateProduct:async(parent, args, {userId}, info) =>{
    // get value form Frontend
    const {id , description , price, imageUrl} = args
    // NO have token
    if(!userId)  throw new Error("Please Login!")

    let product;
    try {
      //Find Product in database
      product = await Product.findById(id)
    } catch (error) {
      throw new Error("Not found product")
    }

    //TODO: check if user owner of the product
    // const userId = "60c0f03c44784824a87a7c3a"
    if(userId !== String(product.user)){
      throw new Error("You are not authorized")
    }

    //From Updated Information
    console.log(price)
    const updateInfo = {
      description:  description ? description : product.description,
      price: price || price ==0 ? price : product.price,  //ถ้า price เป็น 0 มันจะ false 
      imageUrl: imageUrl ? imageUrl : product.imageUrl,
    }

    //update product in database
    await Product.findByIdAndUpdate(id,updateInfo)

    //return product ที่ update แล้ว สามารถดู return ถึง user ได้
    const updateProduct = await Product.findById(id).populate({path:'user'})

    return updateProduct
  },
  addToCart:async(parent, args, {userId}, info) =>{
    // NO have token
    if(!userId)  throw new Error("Please Login!")
    
    //product id
    const {id} = args
    try {
      //find user who perform add to cart  ---> from logged

      // Check if the new addToCart item is already in user.carts  check ว่า items นั้นเป็นของใหม่ หรือไม่
      const user = await User.findById(userId).populate({path:"carts",populate:{path:"product"}})

      const findCartItemIndex = user.carts.findIndex(cartItem =>cartItem.product.id === id) //ถ้าเจอ return 0ขึ้นไป ถ้าไม่เจอ return -1
      
      // A. The new addToCart item is already in cart  มี items นั้น cartItem แล้ว
      if(findCartItemIndex > -1){
        //A.1 หา item นั้นใน cartItem เพื่อ update จำนวน  (find & update) 
        user.carts[findCartItemIndex].quantity +=1
        await cartItem.findByIdAndUpdate(user.carts[findCartItemIndex].id,{
          // A.2 update จำนวน ไอเท็มนั้น
          quantity:user.carts[findCartItemIndex].quantity
        })
        const updatedItem =  await cartItem.findById(user.carts[findCartItemIndex].id).populate({path:"product"}).populate({path:"user"})
        return updatedItem
      }else{
      // B. The new addToCart item is not in cart yet  เป็น item ใหม่
      // B.1 create array cartItem ขึ้นมา
        const cartItemValue = await cartItem.create({
          product:id,  //เพิ่ม product id เข้าไป
          quantity:1,
          user:userId
        })

         //B.2 find new cartItem
        const newCartItem = await cartItem.findById(cartItemValue.id).populate({path:"product"}).populate({path:"user"})

        // B.3 update cartItem นั้น 
        await User.findByIdAndUpdate(userId,{carts:[...user.carts,newCartItem]})
        return newCartItem
      }
      
    } catch (error) {
      console.log(error)
    }
  },
  
  deleteCart:async(parent, args, {userId}, info) =>{
     // NO have token
    if(!userId)  throw new Error("Please Login!")
    
    // get id form Frontend
    const {id } = args

    //find cart from given id
    const cart = await cartItem.findById(id)

    //TODO: Check if user logged in

    //TODO: user id from request --->find user
    if(userId !== String(cart.user)){
      throw new Error("You are not authorized")
    }


    //delete Cart
    const deletedCart =  await cartItem.findByIdAndRemove(id)
    
    //delete ID Cart in user
    const user = await User.findById(userId) 
    const updateUserCart = user.carts.filter(cardID => cardID.toString() !== deletedCart.id.toString())
    //save new updateCart to User
    await User.findByIdAndUpdate(userId,{carts:updateUserCart})

    //return Cart!
    return deletedCart
  }
};








// mutation{
//   createProduct(description:"descricxzczxption",price:999, 
//      imageUrl:"https://pbs.twimg.com/profile_images/378800000720529856/9ca8c5f8f2876746e4f3c5f0b53785c3_400x400.jpeg"){
//      id
//      description
//      price
//      imageUrl
//      user{
//        id
//        name
//        email
//      }
//    }
//  }



// mutation{
//   addToCart(id:"60bf5b7c180903262c8d9ff4"){
//     id
//     product{
//       description
//     }
//     quantity
//     user{
//       name
//     }
    
//   }
// }