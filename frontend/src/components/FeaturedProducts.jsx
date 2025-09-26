import React from 'react'


const featuredProducts = [
  {
    name: "AirPods Max",
    price: "₹59,900",
    img: "https://m.media-amazon.com/images/I/71RJCexaxiL._UF1000,1000_QL80_.jpg",
    rating: 4.5,
  },
  {
    name: "I phone 17 Pro max",
    price: "₹1,49,999",
    img: "https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/317434_0_iUBrKWxfg.png?updatedAt=1757529567127",
    rating: 4.8,
  },
  {
    name: "Macbook Pro 14",
    price: "₹2,29,999",
    img: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp-14-digitalmat-gallery-1-202410?wid=728&hei=666&fmt=png-alpha&.v=dmVFbEEyUXJ6Q0hEd1FjMFY3bE5FczNWK01TMHBhR0pZcm42OHQ2ODBjVVZYRUFzTnU5dXpMeUpXTHdIdkp5VDRob044alBIMUhjRGJwTW1yRE1oUG9oQ20zUjdkYWFQM0VDcG9EZ0J2dDMrNmVjbmk5c1V4VVk2VEt3TGcxekg",
    rating: 4.7,
  },
  {
    name: "Samsung 4K TV",
    price: "₹1,19,999",
    img: "https://goodluckafrica.com/wp-content/uploads/2024/10/UA98DU9000-frt.jpg",
    rating: 4.6,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden relative"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-58 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-yellow-400 font-bold">{product.price}</p>
                <button className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}

export default FeaturedProducts
