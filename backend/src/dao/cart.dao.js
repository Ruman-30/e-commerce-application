import cartModel from "../model/cart.model.js";

export async function increamentProductQuantity(userId, productId, quantity){
    return await cartModel.findOneAndUpdate(
        {user: userId, "items.product": productId},
        {$inc: {"items.$.quantity": quantity}},
        {new: true}
    )
}

export async function addNewProductToCart(userId, productId, quantity){
    return await cartModel.findOneAndUpdate(
        {user: userId},
        {$push: {items: {product: productId, quantity}}},
        {new: true, upsert: true}
    )
}

export async function findCartByUser(userId){
  return await cartModel.findOne({user: userId}).populate("items.product", "name images price")
}

export async function updateProductQuantity(userId, productId, quantity){
    if(quantity <= 0){
        return await cartModel.findOneAndUpdate(
            {user: userId},
            {$pull: {items: {product: productId}}},
            {new: true}
        )
    }

    return await cartModel.findOneAndUpdate(
        {user: userId, "items.product": productId},
        {$set: {"items.$.quantity": quantity}},
        {new: true}
    )
}

export async function removeProductFromCart(userId, productId){
    return await cartModel.findOneAndUpdate(
        {user: userId},
        {$pull: {items: {product: productId}}},
        {new: true}
    )
}

export async function clearCart(userId){
    return await cartModel.findOneAndUpdate(
        {user: userId},
        {$set: {items: []}},
        {new: true}
    )
}