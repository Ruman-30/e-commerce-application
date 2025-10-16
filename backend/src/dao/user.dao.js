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

export async function searchUsers({ search, limit = 10, skip = 0 }) {
  const pipeline = [
    {
      $search: {
        index: "userSearch", 
        text: {
          query: search,
          path: ["name", "email", "role"],
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    { $skip: skip },
    { $limit: limit },
    { $project: { password: 0, refreshToken: 0 } },
  ];

  return await userModel.aggregate(pipeline);
}

// 🔹 Count total users matching search query
export async function countSearchUsers(search) {
  const result = await userModel.aggregate([
    {
      $search: {
        index: "userSearch",
        text: {
          query: search,
          path: ["name", "email", "role"],
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    { $count: "total" },
  ]);

  return result[0]?.total || 0;
}

// 🔹 Normal pagination (no search)
export async function getAllUsers({ limit = 10, skip = 0, sort } = {}) {
  return await userModel
    .find()
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select("-password -refreshToken");
}

// 🔹 Count total users (no search)
export async function countUsers() {
  return await userModel.countDocuments();
}
