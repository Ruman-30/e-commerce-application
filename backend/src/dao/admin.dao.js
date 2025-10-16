import userModel from "../model/user.model.js";

export async function createAdmin(data){
     const {name, email, password } = data
    const admin = await userModel.create({
        name,
        email,
        password,
        role: "admin"
    })
    return admin
}

export async function findOneAdmin(data){
    return await userModel.findOne(data)
}