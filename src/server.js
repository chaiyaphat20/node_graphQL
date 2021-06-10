import fs from 'fs'
import path from 'path'

import {ApolloServer} from 'apollo-server-express'
// import {typeDefs} from './schema/typeDefs'
import {resolvers} from './resolvers/index.js'
import { getUser } from './utils/getUSer.js'

const typeDefs = fs.readFileSync(path.join(__dirname,'./schema',"/schema.graphql"),'utf-8').toString()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req}) =>{
    //check token from headers
    const token = req.headers.authorization || ''

    //Extract userID from token
    const userId = getUser(token) //ได้เป็นค่า context คือ argument ตัวที่3
    return {userId}
  }
})

export {server}

//creat server graphql