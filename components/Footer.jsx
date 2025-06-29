import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-950">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500 dark:text-gray-300">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo1} alt="logo1" />
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-300">
           As we explore the realm of keyboard and mouse excellence, the innovations and advancements that enhance our digital interactions, making every click and keystroke a seamless part of our daily lives. Whether for work, play, or creative endeavors, investing in high-quality input devices is essential for achieving peak performance and satisfaction in today's digital world. With advanced connectivity options, long-lasting battery life, and sleek aesthetics, our wireless keyboard and mouse products are perfect for professionals, gamers, and casual users alike.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 dark:text-white mb-5">Company</h2>
            <ul className="text-sm space-y-2 text-gray-500 dark:text-gray-300">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 dark:text-white mb-5">Get in touch</h2>
            <div className="text-sm space-y-2 text-gray-500 dark:text-gray-300">
              <p>+63 991 182 8964</p>
              <p>clics&types@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center mt-4 text-sm text-gray-500">
        <a href="/about-us" className="hover:underline">About Us</a>
        <a href="/contact" className="hover:underline">Contact</a>
        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-gray-500 dark:text-gray-300">
      Copyright 2025 © Clicks&Types.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;