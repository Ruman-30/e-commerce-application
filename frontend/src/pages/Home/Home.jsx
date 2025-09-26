
import Navbar from "../../components/Navbar";
import HeroBanner from "../../components/HeroBanner";
import CategorySlider from "../../components/CategorySlider";
import BestDeals from "../../components/BestDeals";
import FeaturedProducts from "../../components/FeaturedProducts";
import FeaturedBrands from "../../components/FeaturedBrands";
import Appliances from "../../components/Appliances";


const Home = () => {
  return (
    <div className="bg-gray-50">
     <Navbar />
     <div className="w-full h-24"></div>
      {/* Hero Section */}
      <HeroBanner />
      {/* Product Categories Section */}
     <CategorySlider />
      {/* Product best deals Section */}
     <BestDeals />
      {/* Featured Products / Deals */}
       <FeaturedProducts />
       {/* Featured Brands */}
       <FeaturedBrands />
       {/* Appliances Section */}
       <Appliances />
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <p>UrbanCart is your go-to online store for the latest products at great prices.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Customer Support</h3>
            <ul>
              <li>FAQ</li>
              <li>Contact Us</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>FB</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Payment Methods</h3>
            <ul className="flex space-x-2">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>PayPal</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          &copy; {new Date().getFullYear()} UrbanCart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;

