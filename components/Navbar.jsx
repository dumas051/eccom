"use client"
import React, { useEffect, useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const {openSignIn} = useClerk()
  const [search, setSearch] = useState("");

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
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={handleLogoClick}
        src={assets.logo1}
        alt="Clicks & Types Logo"
        priority
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition-colors duration-200">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition-colors duration-200">
          Shop
        </Link>
        <Link href="/track-order" className="hover:text-gray-900 transition-colors duration-200">
          Track Order
        </Link>
        <Link href="/about-us" className="hover:text-gray-900 transition-colors duration-200">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition-colors duration-200">
          Contact
        </Link>

        {isSeller && (
          <button 
            onClick={handleSellerDashboardClick} 
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <div className="flex items-center border rounded px-2 bg-white">
          <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="outline-none px-2 py-1 text-sm bg-transparent w-48"
            aria-label="Search products"
          />
        </div>
        {user ? (
          <>
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
                  label="My orders" 
                  labelIcon={<BagIcon />} 
                  onClick={() => router.push('/my-orders')} 
                />
              </UserButton.MenuItems>
            </UserButton>
          </>
        ) : (
          <button 
            onClick={openSignIn} 
            className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200"
            aria-label="Sign in to your account"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button 
            onClick={handleSellerDashboardClick} 
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
        <button 
          onClick={openSignIn} 
          className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200"
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