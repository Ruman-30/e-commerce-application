import userModel from "../model/user.model.js";

export async function createUserRegister(data){
    const {name, email, password, address: { street, city, state, postalCode, country } } = data
    const register = await userModel.create({
        name,
        email,
        password,
        address: {
            street,
            city,
            state,
            postalCode,
            country
        },
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