'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import PaymentUpdateModal from "@/components/PaymentUpdateModal";
import BackButton from "@/components/BackButton";
import axios from "axios";
import toast from "react-hot-toast";

const ArchivedOrders = () => {
    const { currency, user, getToken } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchArchivedOrders = async () => {
       try {
         const token = await getToken();
         const { data } = await axios.get('/api/order/seller-orders?archived=true',
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

    const unarchiveOrder = async (orderId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/order/archive', { orderId, archived: false }, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                toast.success('Order unarchived successfully! Products have been restored to the order. It will now appear in your active orders.');
                fetchArchivedOrders();
            } else {
                toast.error(data.message || 'Failed to unarchive order');
            }
        } catch (error) {
            console.error('Unarchive error:', error);
            toast.error('Failed to unarchive order');
        }
    };

    const openPaymentModal = (order) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    const handlePaymentUpdate = (updatedOrder) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    };

    const handleUnarchiveOrder = (orderId) => {
        unarchiveOrder(orderId);
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'text-green-600 bg-green-100';
            case 'Pending': return 'text-yellow-600 bg-yellow-100';
            case 'Failed': return 'text-red-600 bg-red-100';
            case 'Refunded': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        if(user){
            fetchArchivedOrders();
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm relative">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <div className="mb-2"><BackButton customText="Back to Orders" customHref="/seller/orders" /></div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-lg font-medium">Archived Orders</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {orders.length} archived order{orders.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            💡 Archived orders have their products removed to save space. Products will be restored when unarchiving.
                        </p>
                    </div>
                </div>
                
                {orders.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Archived Orders</h3>
                        <p className="text-gray-600">You haven't archived any orders yet. Archived orders have their products removed to save space.</p>
                    </div>
                ) : (
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
                                        <span className="font-medium text-gray-500">
                                            Products removed (archived)
                                        </span>
                                        <span className="text-sm text-gray-500">Order archived on {new Date(order.date).toLocaleDateString()}</span>
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
                                <div className="text-right">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-500">Subtotal: {currency}0 (reset)</span>
                                        <span className="text-sm text-gray-500">Tax: {currency}0 (reset)</span>
                                        <span className="text-sm text-gray-500">Shipping: {currency}0 (reset)</span>
                                        <span className="font-medium text-base text-gray-500">
                                            Total: {currency}0 (reset)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <p className="flex flex-col text-gray-900 dark:text-gray-100">
                                        <span>Method : {order.paymentMethod || 'COD'}</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus || 'Pending')}`}>
                                            Payment : {order.paymentStatus || 'Pending'}
                                        </span>
                                        {order.paymentMethod === 'Gcash' && order.paymentDetails?.gcashCustomerNumber && (
                                            <span className="mt-2 text-xs text-blue-700">Customer GCash #: {order.paymentDetails.gcashCustomerNumber}</span>
                                        )}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => openPaymentModal(order)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                                        >
                                            Update Payment
                                        </button>
                                        <button
                                            onClick={() => handleUnarchiveOrder(order._id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                                        >
                                            Unarchive Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>}

            {/* Payment Update Modal */}
            <PaymentUpdateModal
                isOpen={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onUpdate={handlePaymentUpdate}
            />

            <Footer />
        </div>
    );
};

export default ArchivedOrders; 