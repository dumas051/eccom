'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import { toast } from 'react-toastify';


const Orders = () => {

    const { currency, user, getToken } = useAppContext(); // Make sure getToken is here

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingForm, setTrackingForm] = useState({
        trackingNumber: '',
        estimatedDelivery: '',
        status: '',
        description: '',
        location: ''
    });

    const fetchSellerOrders = async () => {
       try {
         const token = await getToken();
         console.log("Token:", token);
         const { data } = await axios.get('/api/order/seller-orders',
            { headers: { Authorization: `Bearer ${token}` } });

            if(data.success){
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
            setLoading(false);
       } catch (error) {
        setLoading(false);
        toast.error("Something went wrong");
       }
    }

    const cancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            const { data } = await axios.post('/api/order/cancel', { orderId });
            
            if (data.success) {
                toast.success('Order cancelled successfully');
                // Refresh orders list
                fetchSellerOrders();
            } else {
                toast.error(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            toast.error('Failed to cancel order');
        } finally {
            setCancellingOrder(null);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.post('/api/order/update-status', { orderId, status: newStatus });
            if (data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                if (newStatus === 'Confirmed' || newStatus === 'Delivered') {
                    toast.success('Email notification sent to customer');
                }
                fetchSellerOrders();
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const updateTracking = async () => {
        try {
            const { data } = await axios.post('/api/order/update-tracking', {
                orderId: selectedOrder._id,
                trackingNumber: trackingForm.trackingNumber || undefined,
                estimatedDelivery: trackingForm.estimatedDelivery || undefined,
                trackingUpdate: trackingForm.status ? {
                    status: trackingForm.status,
                    description: trackingForm.description,
                    location: trackingForm.location
                } : undefined
            });
            
            if (data.success) {
                toast.success('Tracking information updated successfully');
                if (trackingForm.trackingNumber || trackingForm.status === 'Shipped') {
                    toast.success('Email notification sent to customer');
                }
                setShowTrackingModal(false);
                setSelectedOrder(null);
                setTrackingForm({
                    trackingNumber: '',
                    estimatedDelivery: '',
                    status: '',
                    description: '',
                    location: ''
                });
                fetchSellerOrders();
            } else {
                toast.error(data.message || 'Failed to update tracking');
            }
        } catch (error) {
            toast.error('Failed to update tracking information');
        }
    };

    const openTrackingModal = (order) => {
        setSelectedOrder(order);
        setTrackingForm({
            trackingNumber: order.trackingNumber || '',
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
            status: '',
            description: '',
            location: ''
        });
        setShowTrackingModal(true);
    };

    useEffect(() => {
        if(user){
        fetchSellerOrders();
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items
                                            .filter(item => item.product && item.product.name)
                                            .map((item) => item.product.name + ` x ${item.quantity}`)
                                            .join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address?.fullName || "N/A"}</span>
                                    <br />
                                    <span>{order.address?.area || "N/A"}</span>
                                    <br />
                                    <span>{(order.address?.city || "N/A") + ", " + (order.address?.state || "N/A")}</span>
                                    <br />
                                    <span>{order.address?.phone || "N/A"}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div className="flex flex-col gap-2 items-end">
                                <p className="flex flex-col text-gray-900 dark:text-gray-100">
                                    <span>Method : {order.paymentMethod || 'COD'}</span>
                                    <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                    <span>Payment : Pending</span>
                                </p>
                                {order.canCancel && order.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => cancelOrder(order._id)}
                                        disabled={cancellingOrder === order._id}
                                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                                {order.status === 'Cancelled' && (
                                    <span className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                                        Cancelled
                                    </span>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        disabled={order.status === 'Cancelled'}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    {order.status === 'Cancelled' && (
                                        <span className="text-xs text-red-600 dark:text-red-400">
                                            Cannot update cancelled orders
                                        </span>
                                    )}
                                </div>
                                {order.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => openTrackingModal(order)}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                                    >
                                        Update Tracking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>}

            {/* Tracking Modal */}
            {showTrackingModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Update Tracking - Order #{selectedOrder._id}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tracking Number
                                </label>
                                <input
                                    type="text"
                                    value={trackingForm.trackingNumber}
                                    onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                    placeholder="Enter tracking number"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Estimated Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={trackingForm.estimatedDelivery}
                                    onChange={(e) => setTrackingForm({...trackingForm, estimatedDelivery: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Add Tracking Update
                                </label>
                                <select
                                    value={trackingForm.status}
                                    onChange={(e) => setTrackingForm({...trackingForm, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white mb-2"
                                >
                                    <option value="">Select status</option>
                                    <option value="Order Confirmed">Order Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                
                                <input
                                    type="text"
                                    value={trackingForm.description}
                                    onChange={(e) => setTrackingForm({...trackingForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white mb-2"
                                    placeholder="Description (optional)"
                                />
                                
                                <input
                                    type="text"
                                    value={trackingForm.location}
                                    onChange={(e) => setTrackingForm({...trackingForm, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                    placeholder="Location (optional)"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={updateTracking}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                            >
                                Update Tracking
                            </button>
                            <button
                                onClick={() => {
                                    setShowTrackingModal(false);
                                    setSelectedOrder(null);
                                    setTrackingForm({
                                        trackingNumber: '',
                                        estimatedDelivery: '',
                                        status: '',
                                        description: '',
                                        location: ''
                                    });
                                }}
                                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Orders;