'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import Image from "next/image";

const ManageAddresses = () => {
  const { user, getToken, deleteAddress, fetchUserAddresses } = useAppContext();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setAddresses(Array.isArray(data.address) ? data.address : []);
      } else {
        toast.error(data.message || 'Failed to fetch addresses');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressIndex) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const token = await getToken();
        const { data } = await axios.delete('/api/user/delete-address', {
          headers: { Authorization: `Bearer ${token}` },
          data: { addressIndex }
        });
        
        if (data.success) {
          toast.success('Address deleted successfully!');
          deleteAddress(addressIndex);
          fetchAddresses();
        } else {
          toast.error(data.message || 'Failed to delete address');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error(error.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const formatAddress = (address) => {
    return `${address.fullName}, ${address.area}, ${address.city}, ${address.state}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading addresses...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        <div className="absolute top-4 left-4 z-20"><BackButton /></div>
        <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">Manage Addresses</h1>
                </div>
                <button
                  onClick={() => router.push('/add-address')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition"
                >
                  Add New Address
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses found.</p>
                  <button
                    onClick={() => router.push('/add-address')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition"
                  >
                    Add your first address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{address.fullName}</h3>
                          <p className="text-gray-600 text-sm mb-1">{address.area}</p>
                          <p className="text-gray-600 text-sm mb-1">{address.city}, {address.state}</p>
                          <p className="text-gray-600 text-sm mb-1">Pin Code: {address.pincode}</p>
                          <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => router.push(`/edit-address?index=${index}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push('/my-orders')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
          <Image
            className="md:mr-16 mt-16 md:mt-0"
            src={assets.my_location_image}
            alt="my_location_image"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageAddresses; 