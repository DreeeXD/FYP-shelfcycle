import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-10 border-t border-blue-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Branding */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-3">ShelfCycle</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Discover, exchange, and enjoy pre-loved books. Empowering the community one story at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li><a href="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Home</a></li>
            <li><a href="/exchanges" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Exchanges</a></li>
            <li><a href="/chat" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Chat</a></li>
            <li><a href="/signup" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Register</a></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Stay Connected</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Follow us on social media</p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"><FaFacebookF /></a>
            <a href="#" className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition"><FaInstagram /></a>
            <a href="#" className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition"><FaTwitter /></a>
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 border-t border-indigo-100 dark:border-gray-700 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} <span className="font-medium text-blue-600 dark:text-blue-400">ShelfCycle</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
