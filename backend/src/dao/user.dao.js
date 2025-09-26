import userModel from "../model/user.model.js";

export async function createUserRegister(data){
    const {name, email, password} = data
    const register = await userModel.create({
        name,
        email,
        password,
        role: "customer"
    })
    return register
}


export async function FindOneUser(data){
   return await userModel.findOne(data)
}

export async function findById(userId){
    return await userModel.findById(userId)
}

export async function createUserByGoogle({name, googleId, email}){
  return await userModel.create({
    name,
    googleId,
    email,
    role: "customer"
  })
}

export async function findUserByRefreshToken(token){
  return await userModel.findOne({refreshToken: token})
}

export async function saveRefreshToken(userId, token){
  const user = await userModel.findById(userId)
  // console.log("Saving new refresh token:", token);
  if(!user) return null
  user.refreshToken = token
  await user.save()
  return user
}

export async function clearRefreshToken(token){
 const user = await userModel.findOne({refreshToken: token})
 if(!user) return null
 user.refreshToken = null
 await user.save()
 return user
}