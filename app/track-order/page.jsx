"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const TrackOrder = () => {
  const { currency } = useAppContext();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      trackOrderById(urlOrderId);
    }
  }, [searchParams]);

  const trackOrderById = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/order/track', { orderId: id });
      
      if (data.success) {
        setTrackingData(data.order);
        toast.success('Order found!');
      } else {
        toast.error(data.message || 'Order not found');
        setTrackingData(null);
      }
    } catch (error) {
      toast.error('Failed to track order');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }
    await trackOrderById(orderId.trim());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Confirmed': return '✅';
      case 'Delivered': return '📦';
      case 'Cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h1>
          <p className="text-gray-600 dark:text-gray-300">Enter your order ID to track your package</p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
            {/* Order Summary */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order #{trackingData._id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                  {getStatusIcon(trackingData.status)} {trackingData.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Order Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(trackingData.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currency}{trackingData.amount}
                  </p>
                </div>
                {trackingData.trackingNumber && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tracking Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {trackingData.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
              <div className="space-y-3">
                {trackingData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.product?.images?.[0]?.url || assets.Mouse1}
                        alt={item.product?.name || 'Product'}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.product?.name || 'Product'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {currency}{item.product?.offerPrice || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tracking Timeline</h3>
              {trackingData.trackingHistory && trackingData.trackingHistory.length > 0 ? (
                <div className="space-y-4">
                  {trackingData.trackingHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{entry.status}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>
                        {entry.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">📍 {entry.location}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No tracking updates available yet.</p>
                </div>
              )}
            </div>

            {/* Estimated Delivery */}
            {trackingData.estimatedDelivery && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📅 Estimated Delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder; 