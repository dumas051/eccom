"use client"
import React, { useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission (you can replace this with actual API call)
    setTimeout(() => {
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Get in touch with our team for support, inquiries, or feedback
          </p>
          <div className="flex justify-center">
            <Image
              src={assets.logo1}
              alt="Clicks & Types Logo"
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We're here to help with any questions or concerns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-gray-50 dark:bg-neutral-800 rounded-xl">
              <div className="text-orange-600 text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Phone Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Call us for immediate assistance
              </p>
              <a 
                href="tel:+639911828964" 
                className="text-orange-600 hover:text-orange-700 font-semibold text-lg"
              >
                +63 991 182 8964
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Available Mon-Fri, 9AM-6PM
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 dark:bg-neutral-800 rounded-xl">
              <div className="text-orange-600 text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Send us an email anytime
              </p>
              <a 
                href="mailto:clics&types@gmail.com" 
                className="text-orange-600 hover:text-orange-700 font-semibold text-lg"
              >
                clics&types@gmail.com
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                We respond within 24 hours
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 dark:bg-neutral-800 rounded-xl">
              <div className="text-orange-600 text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Chat with our support team
              </p>
              <button className="text-orange-600 hover:text-orange-700 font-semibold text-lg">
                Start Chat
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Available during business hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Support">Product Support</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can track your order by visiting our "Track Order" page and entering your order ID, 
                or by checking your order status in your account dashboard.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a 30-day return policy for all products in their original condition. 
                Contact our support team to initiate a return.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, we ship within the Philippines. We're working on expanding our 
                shipping options to other countries soon.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How long does shipping take?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Standard shipping takes 3-5 business days within the Philippines. 
                Express shipping is available for faster delivery.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept Cash on Delivery (COD) and various digital payment methods including 
                e-wallets and online banking transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & Location */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Business Hours
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Monday - Friday</span>
                  <span className="text-gray-600 dark:text-gray-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Saturday</span>
                  <span className="text-gray-600 dark:text-gray-300">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Sunday</span>
                  <span className="text-gray-600 dark:text-gray-300">Closed</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Emergency Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For urgent technical issues outside business hours, please email us and we'll respond as soon as possible.
                </p>
                <a 
                  href="mailto:clics&types@gmail.com" 
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  clics&types@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Connect With Us
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Image src={assets.facebook_icon} alt="Facebook" className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Facebook</h3>
                    <p className="text-gray-600 dark:text-gray-300">Follow us for updates and gaming content</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Image src={assets.instagram_icon} alt="Instagram" className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Instagram</h3>
                    <p className="text-gray-600 dark:text-gray-300">Check out our latest products and setups</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Image src={assets.twitter_icon} alt="Twitter" className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Twitter</h3>
                    <p className="text-gray-600 dark:text-gray-300">Stay updated with gaming news and announcements</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Image src={assets.youtube_icon} alt="YouTube" className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">YouTube</h3>
                    <p className="text-gray-600 dark:text-gray-300">Watch product reviews and gaming content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to help you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+639911828964" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Call Us Now
            </a>
            <a 
              href="mailto:clics&types@gmail.com" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition font-semibold"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 