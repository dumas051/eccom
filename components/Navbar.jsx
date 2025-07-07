"use client"
import React, { useEffect, useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const { isSeller, router, user, notifications, clearNotifications } = useAppContext();
  const {openSignIn} = useClerk()
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogoClick = () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSellerDashboardClick = () => {
    try {
      router.push('/seller');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <nav className={`flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 transition-all duration-300 ease-out ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
    }`}>
      <Image
        className="cursor-pointer w-28 md:w-32 transition-transform duration-200 ease-out hover:scale-105"
        onClick={handleLogoClick}
        src={assets.logo1}
        alt="Clicks & Types Logo"
        priority
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 text-transition relative group">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        </Link>
        <div className="relative group">
          <Link href="/all-products" className="hover:text-gray-900 text-transition relative">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
            <div className="py-2">
              <Link href="/all-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
                All Products
              </Link>
              <Link href="/mouse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
                Computer Mouse
              </Link>
              <Link href="/keyboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
                Keyboards
              </Link>
            </div>
          </div>
        </div>
        <Link href="/track-order" className="hover:text-gray-900 text-transition relative group">
          Track Order
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        </Link>
        <Link href="/about-us" className="hover:text-gray-900 text-transition relative group">
          About Us
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        </Link>
        <Link href="/contact" className="hover:text-gray-900 text-transition relative group">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        </Link>

        {isSeller && (
          <button 
            onClick={handleSellerDashboardClick} 
            className="text-xs border px-4 py-1.5 rounded-full button-transition hover:bg-orange-600 hover:text-white hover:border-orange-600"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <div className="flex items-center border rounded px-2 bg-white transition-all duration-200 ease-out focus-within:border-orange-600 focus-within:shadow-md">
          <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="outline-none px-2 py-1 text-sm bg-transparent w-48 focus-ring"
            aria-label="Search products"
          />
        </div>
        <li className="relative mr-4 list-none">
          <button
            className="relative transition-transform duration-200 ease-out hover:scale-110"
            onClick={() => setShowNotif((v) => !v)}
            aria-label="Show notifications"
          >
            <FaBell className="w-6 h-6 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-slide-down">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-semibold text-gray-800">Notifications</span>
                <button onClick={clearNotifications} className="text-xs text-orange-600 hover:underline transition-colors duration-200">Clear All</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b last:border-b-0 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200">
                      {notif.message}
                      {notif.link && (
                        <a href={notif.link} className="ml-2 text-blue-600 underline hover:text-blue-800 transition-colors duration-200">View</a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </li>
        <li>
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action 
                  label="Home" 
                  labelIcon={<HomeIcon />} 
                  onClick={() => router.push('/')} 
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action 
                  label="Products" 
                  labelIcon={<BoxIcon />} 
                  onClick={() => router.push('/all-products')} 
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action 
                  label="Cart" 
                  labelIcon={<CartIcon />} 
                  onClick={() => router.push('/cart')} 
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action 
                  label="Purchase History" 
                  labelIcon={<BagIcon />} 
                  onClick={() => router.push('/my-orders')} 
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button 
              onClick={openSignIn} 
              className="flex items-center gap-2 hover:text-gray-900 text-transition hover:scale-105 transition-transform duration-200"
              aria-label="Sign in to your account"
            >
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
          )}
        </li>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button 
            onClick={handleSellerDashboardClick} 
            className="text-xs border px-4 py-1.5 rounded-full button-transition hover:bg-orange-600 hover:text-white hover:border-orange-600"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
        <button 
          onClick={openSignIn} 
          className="flex items-center gap-2 hover:text-gray-900 text-transition hover:scale-105 transition-transform duration-200"
          aria-label="Sign in to your account"
        >
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;