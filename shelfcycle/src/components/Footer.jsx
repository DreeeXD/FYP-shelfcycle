import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-10 border-t border-indigo-200">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Branding */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-3">ShelfCycle</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Discover, exchange, and enjoy pre-loved books. Empowering the community one story at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/" className="hover:text-indigo-700 transition">Home</a></li>
            <li><a href="/exchanges" className="hover:text-indigo-700 transition">Exchanges</a></li>
            <li><a href="/chat" className="hover:text-indigo-700 transition">Chat</a></li>
            <li><a href="/signup" className="hover:text-indigo-700 transition">Register</a></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">Stay Connected</h3>
          <p className="text-sm text-gray-600 mb-3">Follow us on social media</p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="text-indigo-500 hover:text-indigo-700 transition"><FaFacebookF /></a>
            <a href="#" className="text-pink-500 hover:text-pink-600 transition"><FaInstagram /></a>
            <a href="#" className="text-sky-500 hover:text-sky-600 transition"><FaTwitter /></a>
            <a href="#" className="text-blue-600 hover:text-blue-800 transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 border-t border-indigo-100 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} <span className="font-medium text-indigo-600">ShelfCycle</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
