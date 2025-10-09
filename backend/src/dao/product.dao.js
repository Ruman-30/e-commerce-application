import productModel from "../model/product.model.js";

export async function createProduct(data) {
  return await productModel.create(data);
}

export async function findProductById(productId) {
  return await productModel.findById(productId);
}

export async function deleteProductById(productId) {
  return await productModel.findByIdAndDelete(productId);
}

export async function updateProduct(productId, updateData) {
  return await productModel.findByIdAndUpdate(productId, updateData, {
    new: true,
  });
}

export async function getProductById(productId) {
  return await productModel.findById(productId);
}

export async function getProductPriceById(productId) {
  return await productModel.findById(productId).select("price name images");
}

export async function decrementProductStock(productId, quantity) {
  return await productModel.findByIdAndUpdate(
    productId,
    { $inc: { stock: -quantity } },
    { new: true }
  );
}

export async function getAllProducts({ filter, sort, skip, limit, search }) {
  if (search) {
    const pipeline = [
      {
        $search: {
          index: "product_search_index",
          text: {
            query: search,
            path: ["name", "description"],
            // fuzzy: { maxEdits: 2 },
          },
        },
      },
      {
        $set: {
          score: { $meta: "searchScore" },
        },
      },
      ...(Object.keys(filter).length ? [{ $match: filter }] : []),

      // Make sure fields exist for sorting
      {
        $addFields: {
          sortPrice: "$price",
          sortCreatedAt: "$createdAt",
        },
      },

      // Sort by score first, then user-specified field
      {
        $sort: {
          score: -1,
          ...(sort.sort === "price" ? { sortPrice: sort.price } : {}),
          ...(sort.sort === "createdAt" ? { sortCreatedAt: sort.createdAt } : {}),
        },
      },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          name: 1,
          price: 1,
          "images.url": 1,
          category: 1,
          subCategory: 1,
          score: 1,
          description: 1,
          averageRating: 1,
          numOfReviews: 1,
        },
      },
    ];

    return await productModel.aggregate(pipeline);
  }

  // Normal fetch without search
  return await productModel
    .find(filter)
    .sort(Object.keys(sort).length ? sort : { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "name price images.url category subCategory description averageRating numOfReviews"
    );
}


export async function countProduct({ filter, search }) {
  if (search) {
    const pipeline = [
      {
        $search: {
          index: "product_search_index",
          text: {
            query: search,
            path: ["name", "description"],
              fuzzy: { maxEdits: 2 },
          },
        },
      },
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $count: "total" },
    ];
    const result = await productModel.aggregate(pipeline);
    return result[0]?.total || 0;
  }
  return await productModel.countDocuments(filter);
}
