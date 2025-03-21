import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import logo1 from "../../../public/image/logo1.png";
import logo2 from "../../../public/image/logo2.png";

const Footer: React.FC = () => {
  return (
    <footer className="relative">
      <div className="bg-black text-white py-10 px-4 dark:bg-white dark:text-black">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li><Link href="/quizzes"><span className="hover:text-gray-400 dark:hover:text-gray-700">Question Bank</span></Link></li>
              <li><Link href="/quizzes"><span className="hover:text-gray-400 dark:hover:text-gray-700">Mock Exams</span></Link></li>
              <li><Link href="/community"><span className="hover:text-gray-400 dark:hover:text-gray-700">Community</span></Link></li>
              <li><Link href="/progress"><span className="hover:text-gray-400 dark:hover:text-gray-700">Progress</span></Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>Phone: 0712563653</p>
            <p>Email: pallegama hasitha.com</p>
            <p>Address: University of Moratuwa, Katubedda</p>
          </div>
          <div className="flex flex-col ml-20 items-center md:items-start">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4 mb-4">
              <Link href="https://facebook.com" target="_blank"><FaFacebookF className="text-white dark:text-black hover:text-gray-400 dark:hover:text-gray-700 text-2xl" /></Link>
              <Link href="https://instagram.com" target="_blank"><FaInstagram className="text-white dark:text-black hover:text-gray-400 dark:hover:text-gray-700 text-2xl" /></Link>
              <Link href="https://twitter.com" target="_blank"><FaTwitter className="text-white dark:text-black hover:text-gray-400 dark:hover:text-gray-700 text-2xl" /></Link>
              <Link href="https://linkedin.com" target="_blank"><FaLinkedinIn className="text-white dark:text-black hover:text-gray-400 dark:hover:text-gray-700 text-2xl" /></Link>
            </div>
            <div className="flex space-x-4 mt-5">
              <Image src={logo1} alt="Company Logo" width={80} height={40} />
              <Image src={logo2} alt="Owner Logo" width={80} height={40} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black py-2 text-center">
        <p className="text-black dark:text-white">&copy; 2025 H4X All rights reserved.</p>
      </div>
      <div className="bg-black dark:bg-white py-3"></div>
    </footer>
  );
};

export default Footer;
