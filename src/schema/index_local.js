import { gql } from "apollo-server-core";

//Create, Read, Update, Delete
// rootType = Mutation(POST or Create ,PUT PATCH or Update , DELETE or Delete) , Query(GET or Read) , Subscribe (Realtime)
const typeDefs = gql`
  type Query {
    me: User!
    user(id: ID!): User
    users: [User]!
  }
  #  me:User!    //! หมายถึงห้าม null * *ถ้า user loginได้ยังไงก็มีข้อมูล   findOne({id:ID}) **me
  # user(id:ID):User  //user อาจจะล้อกอินผิดเลยมี null ได้ findOne({id:ID})
  #  users:[User]  //หมายถึงดู user ได้หลายคน     (find())
  # users:[User]! หมายถึง อย่าน้อยต้องมีข้อมูล คือ [] เลยใส่ null  ** ข้างไม่ใส่ ! เพราะ ถ้าใส่จะหมายถึงจะมี user อย่างน้อย 1 คน

  type User {
    id: ID!
    name: String!
  }
`;
//Fake Database
const users = [
  { id: "1", name: "jane" },
  { id: "2", name: "jane2" },
  { id: "3", name: "jane3" },
];

const me = users[0];

//resolver คือ คือการสร้าง function ให้ typedef มันทำงานได้ เช่น  me:User!  ต้องสร้าง logic ให้ได้ข้อมูลตัวเองมา
export const resolvers = {
  Query: {
    me: (parent, args, context, info) => me,
    user: (parent, args, context, info) => {
      const id = args.id;  //รับมาจาก fontend
      const user = users.find((u) => u.id === id);
      return user
    },
    users:(parent, args, context, info)=>users
  },
};
// me:()=>{}   ต้อง return ตัวแปรใน me เท่านั้น
export { typeDefs };
