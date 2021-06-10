// User

// query{
//   users{
//     id
//     name
//     email
//   }
// }


// {
//   "data": {
//     "users": [
//       {
//         "id": "60be5ba473ea852990637c95",
//         "name": "chaiyaphat",
//         "email": "chaiyaphat.b5922314"
//       },
//       {
//         "id": "60be5cdeaef0af05149628af",
//         "name": "chaiyaphat",
//         "email": "chaiyaphat.b5922314"
//       }
//     ]
//   }
// }



// Query

// query{
//   user(id:"60be5ba473ea852990637c95"){
//     id
//     name
//     email
//   }
// }

// {
//   "data": {
//     "user": {
//       "id": "60be5ba473ea852990637c95",
//       "name": "chaiyaphat",
//       "email": "chaiyaphat.b5922314"
//     }
//   }
// }



//MUtation
//  input

//  mutation{
//    signup(
//      name:"chaiyaphat"
//      email:"chaiyaphat.b5922314"
//      password:"123456"
//    ){
//      id
//      name
//      email
//    }
//  }



//  output

//  {
//    "data": {
//      "signup": {
//        "id": "60be5ba473ea852990637c95",
//        "name": "chaiyaphat",
//        "email": "chaiyaphat.b5922314"
//      }
//    }
//  }