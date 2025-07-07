'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { Suspense } from "react";

const EditAddress = () => {
  const { user, getToken, updateAddress, fetchUserAddresses } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressIndex = searchParams.get('index');
  
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (addressIndex === null) {
      toast.error("No address selected for editing");
      router.push("/my-orders");
      return;
    }
  }, [addressIndex, router]);

  // Fetch address data when component mounts
  useEffect(() => {
    const fetchAddressData = async () => {
      if (addressIndex === null) return;
      
      try {
        const token = await getToken();
        const { data } = await axios.get('/api/user/get-address', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.success && Array.isArray(data.address)) {
          const address = data.address[parseInt(addressIndex)];
          if (address) {
            setForm(address);
          } else {
            toast.error("Address not found");
            router.push("/my-orders");
          }
        } else {
          toast.error("Failed to fetch address data");
          router.push("/my-orders");
        }
      } catch (error) {
        console.error('Error fetching address data:', error);
        toast.error("Failed to fetch address data");
        router.push("/my-orders");
      }
    };

    fetchAddressData();
  }, [addressIndex, getToken, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/user/edit-address",
        { addressIndex: parseInt(addressIndex), address: form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Address updated successfully!");
        updateAddress(parseInt(addressIndex), form);
        fetchUserAddresses();
        router.push("/my-orders");
      } else {
        toast.error(data.message || "Failed to update address");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/my-orders");
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
          <div className="absolute top-4 left-4 z-20"><BackButton /></div>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-center flex-1">Edit Address</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pin Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address (Area and Street) *</label>
                <textarea
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City/District/Town *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
      <Footer />
    </>
  );
};

function EditAddressPage() {
  return <EditAddress />;
}

export default function EditAddressPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditAddressPage />
    </Suspense>
  );
} 