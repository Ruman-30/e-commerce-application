import Navbar from "../../components/Navbar";
import HeroBanner from "../../components/HeroBanner";
import CategorySlider from "../../components/CategorySlider";
import BestDeals from "../../components/BestDeals";
import FeaturedProducts from "../../components/FeaturedProducts";
import FeaturedBrands from "../../components/FeaturedBrands";
import Appliances from "../../components/Appliances";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="w-full h-20"></div>
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
      <Footer />
    </div>
  );
};

export default Home;
