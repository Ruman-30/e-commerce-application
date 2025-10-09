import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaRegHeart  } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">UrbanCart</h2>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            UrbanCart is your one-stop online store for electronics, clothing,
            books, and more. We bring you the best deals, premium quality, and
            fast delivery.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-white transition">
                Shop
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-white transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white">Customer Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/returns" className="hover:text-white transition">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-white transition">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>123 E-commerce St, New Delhi, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>support@UrbanCart.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} UrbanCart. All rights reserved. | Built
          with <FaRegHeart  className="inline text-white mx-1" /> by Ruman
        </p>
      </div>
    </footer>
  );
}
