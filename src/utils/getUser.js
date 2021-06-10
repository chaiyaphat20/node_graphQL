import { config } from '../config'
import jwt from 'jsonwebtoken'
export const getUser = token =>{
  if(!token) return null
  const parsedToken = token.split(' ')[1]
  try {
    const decodedToken = jwt.verify(parsedToken,config.secret_jwt)
    return decodedToken.aud
  } catch (error) {
    return null
  }
}