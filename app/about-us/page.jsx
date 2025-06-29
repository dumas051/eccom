"use client"
import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Clicks & Types</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner for premium gaming peripherals and professional input devices
          </p>
          <div className="flex justify-center">
            <Image
              src={assets.logo1}
              alt="Clicks & Types Logo"
              className="w-32 h-32 md:w-40 md:h-40"
            />
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 2024, Clicks & Types emerged from a simple yet powerful vision: to provide gamers, 
                  professionals, and enthusiasts with the highest quality gaming peripherals that enhance their 
                  digital experience.
                </p>
                <p>
                  What started as a passion project among friends who shared a love for competitive gaming and 
                  precision equipment has grown into a trusted destination for premium keyboards and mice.
                </p>
                <p>
                  We understand that every click, every keystroke matters. Whether you're a professional gamer 
                  competing at the highest level, a content creator crafting your next masterpiece, or a 
                  professional seeking reliable tools for your work, we're here to provide you with the 
                  equipment that performs when it matters most.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8">
                <Image
                  src={assets.Mouse1}
                  alt="Premium Gaming Mouse"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're committed to delivering excellence in every interaction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg">
              <div className="text-orange-600 text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To provide gamers and professionals with premium-quality gaming peripherals that enhance 
                performance, comfort, and precision. We strive to be the go-to destination for anyone 
                seeking reliable, high-performance input devices that make every interaction count.
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg">
              <div className="text-orange-600 text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the leading authority in gaming peripherals, known for our commitment to quality, 
                innovation, and customer satisfaction. We envision a future where every gamer and professional 
                has access to the tools they need to excel in their craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-orange-600 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Performance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in delivering products that perform at the highest level, meeting the demands 
                of competitive gaming and professional use.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-orange-600 text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every product we offer meets our rigorous quality standards, ensuring durability and 
                reliability for years to come.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-orange-600 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We build lasting relationships with our customers through transparency, honesty, and 
                exceptional service.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-orange-600 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We stay ahead of the curve, offering the latest technology and features that enhance 
                the gaming and working experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Clicks & Types?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover what makes us different
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg">
              <div className="text-orange-600 text-3xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gaming Expertise</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our team consists of passionate gamers who understand the importance of precision, 
                speed, and reliability in competitive gaming environments.
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg">
              <div className="text-orange-600 text-3xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Curated Selection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We carefully select only the best products from trusted brands, ensuring you get 
                quality equipment that meets your specific needs.
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg">
              <div className="text-orange-600 text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our knowledgeable team is here to help you find the perfect peripherals for your 
                setup, with personalized recommendations and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Product Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Specialized in gaming peripherals that elevate your experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Image
                  src={assets.Mouse1}
                  alt="Gaming Mouse"
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gaming Mice</h3>
                  <p className="text-gray-600 dark:text-gray-300">Precision and speed</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                From ultra-lightweight wireless mice to high-DPI gaming beasts, we offer a range of 
                options designed for competitive gaming and professional use.
              </p>
              <Link 
                href="/all-products" 
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Shop Mice
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Image
                  src={assets.Keyboard1}
                  alt="Gaming Keyboard"
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gaming Keyboards</h3>
                  <p className="text-gray-600 dark:text-gray-300">Responsive and durable</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Mechanical keyboards with premium switches, customizable RGB lighting, and ergonomic 
                designs for extended gaming and typing sessions.
              </p>
              <Link 
                href="/all-products" 
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Shop Keyboards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Elevate Your Gaming Experience?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust Clicks & Types for their gaming peripherals. 
            Start your journey to better performance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/all-products" 
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Shop Now
            </Link>
            <Link 
              href="/track-order" 
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition font-semibold"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Info</h3>
              <p className="text-gray-600 dark:text-gray-300">+63 991 182 8964</p>
              <p className="text-gray-600 dark:text-gray-300">clics&types@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/all-products" className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  Shop Products
                </Link>
                <Link href="/track-order" className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  Track Order
                </Link>
                <Link href="/my-orders" className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  My Orders
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  <Image src={assets.facebook_icon} alt="Facebook" className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  <Image src={assets.instagram_icon} alt="Instagram" className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">
                  <Image src={assets.twitter_icon} alt="Twitter" className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 