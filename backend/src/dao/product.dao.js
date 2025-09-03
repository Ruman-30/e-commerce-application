import productModel from "../model/product.model.js";

export async function createProduct(data){
    return await productModel.create(data)
}

export async function findProductById(productId){
    return await productModel.findById(productId)
}

export async function deleteProductById(productId){
    return await productModel.findByIdAndDelete(productId)
}

export async function updateProduct(productId, updateData){
    return await productModel.findByIdAndUpdate(productId, updateData, { new: true })
}

export async function getAllProducts(filter, sort, skip, limit){
    return await productModel.find(filter).sort(sort).skip(skip).limit(limit).select("name price images.url category")
}

export async function countProduct(filter){
    return await productModel.countDocuments(filter)
}

export async function getProductById(productId){
    return await productModel.findById(productId)
}

export async function getProductPriceById(productId){
    return await productModel.findById(productId).select("price name images")
}

export async function decrementProductStock(productId, quantity){
    return await productModel.findByIdAndUpdate(
        productId,
        {$inc: {stock: -quantity}},
        {new: true}
    )
}