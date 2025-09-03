import userModel from "../model/user.model.js";

export async function createAdmin(data){
     const {name, email, password, address: { street, city, state, postalCode, country } } = data
    const admin = await userModel.create({
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
        role: "admin"
    })
    return admin
}

export async function findOneAdmin(data){
    return await userModel.findOne(data)
}