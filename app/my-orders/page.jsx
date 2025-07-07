'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import BackButton from "@/components/BackButton";

const MyOrders = () => {

    const { currency, getToken, user } = useAppContext();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnOrderId, setReturnOrderId] = useState(null);
    const [returnReason, setReturnReason] = useState("");
    const [refundMethod, setRefundMethod] = useState("");
    const [submittingReturn, setSubmittingReturn] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptOrder, setReceiptOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/list', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setOrders(data.orders);
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const cancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            const token = await getToken();
            const { data } = await axios.post('/api/order/cancel', { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                toast.success('Order cancelled successfully');
                // Refresh orders list
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            toast.error('Failed to cancel order');
        } finally {
            setCancellingOrder(null);
        }
    };

    const openReturnModal = (orderId) => {
        setReturnOrderId(orderId);
        setShowReturnModal(true);
    };
    const closeReturnModal = () => {
        setShowReturnModal(false);
        setReturnOrderId(null);
        setReturnReason("");
        setRefundMethod("");
    };
    const submitReturnRequest = async () => {
        setSubmittingReturn(true);
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/order/request-return', {
                orderId: returnOrderId,
                reason: returnReason,
                refundMethod
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                toast.success('Return/refund request submitted.');
                closeReturnModal();
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmittingReturn(false);
        }
    };

    const openReceiptModal = (order) => {
        setReceiptOrder(order);
        setShowReceiptModal(true);
    };
    const closeReceiptModal = () => {
        setShowReceiptModal(false);
        setReceiptOrder(null);
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    // Calculate total spent
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || order.amount || 0), 0);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
                <div className="absolute top-4 left-4 z-20"><BackButton /></div>
                <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6">
                    <div className="space-y-5">
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-medium">Purchase History</h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push('/manage-addresses')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition"
                                >
                                    Manage Addresses
                                </button>
                                <button
                                    onClick={() => router.push('/add-address')}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition"
                                >
                                    Add New Address
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-8 items-center mb-4">
                            <div className="text-sm text-gray-700">Total Orders: <span className="font-semibold">{orders.length}</span></div>
                            <div className="text-sm text-gray-700">Total Spent: <span className="font-semibold">{currency}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                        {loading ? <Loading /> : (<div className="max-w-5xl border-t border-gray-300 text-sm">
                            {orders
                                .slice()
                                .sort((a, b) => b.date - a.date)
                                .map((order, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                                        <div className="flex-1 flex gap-5 max-w-80">
                                            <Image
                                                className="max-w-16 max-h-16 object-cover"
                                                src={assets.box_icon}
                                                alt="box_icon"
                                            />
                                            <p className="flex flex-col gap-3">
                                                <span className="font-medium text-base">
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
                                        <div className="text-right">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-gray-600">Subtotal: {currency}{order.amount}</span>
                                                {order.tax > 0 && (
                                                    <span className="text-sm text-gray-600">Tax: {currency}{order.tax}</span>
                                                )}
                                                {order.shippingFee !== undefined && (
                                                    <span className="text-sm text-gray-600">
                                                        Shipping: {order.shippingFee === 0 ? 'FREE' : currency + order.shippingFee}
                                                    </span>
                                                )}
                                                <span className="font-medium text-base">
                                                    Total: {currency}{order.totalAmount || order.amount}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="flex flex-col text-gray-900 dark:text-gray-100">
                                                <span>Method : {order.paymentMethod || 'COD'}</span>
                                                <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    order.paymentStatus === 'Paid' ? 'text-green-600 bg-green-100' :
                                                    order.paymentStatus === 'Pending' ? 'text-yellow-600 bg-yellow-100' :
                                                    order.paymentStatus === 'Failed' ? 'text-red-600 bg-red-100' :
                                                    order.paymentStatus === 'Refunded' ? 'text-blue-600 bg-blue-100' :
                                                    'text-gray-600 bg-gray-100'
                                                }`}>
                                                    Payment : {order.paymentStatus || 'Pending'}
                                                </span>
                                                {order.paymentMethod === 'Gcash' && order.paymentDetails?.gcashReference && (
                                                    <span className="mt-2 text-xs text-blue-700">GCash Ref: {order.paymentDetails.gcashReference}</span>
                                                )}
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
                                            {order.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => router.push(`/track-order?orderId=${order._id}`)}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                                                >
                                                    Track Order
                                                </button>
                                            )}
                                            {order.status === 'Delivered' && (!order.returnRequest || order.returnRequest.status === 'None') && (
                                                <button
                                                    onClick={() => openReturnModal(order._id)}
                                                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition"
                                                >
                                                    Request Return/Refund
                                                </button>
                                            )}
                                            {order.returnRequest && order.returnRequest.status !== 'None' && (
                                                <div className="mt-2 px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-800">
                                                    Return/Refund Status: <b>{order.returnRequest.status}</b>
                                                    {order.returnRequest.reason && <><br />Reason: {order.returnRequest.reason}</>}
                                                    {order.returnRequest.message && <><br />Message: {order.returnRequest.message}</>}
                                                    {order.returnRequest.refundAmount && <><br />Refund: {currency}{order.returnRequest.refundAmount}</>}
                                                    {order.returnRequest.refundMethod && <><br />Method: {order.returnRequest.refundMethod}</>}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => openReceiptModal(order)}
                                                className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition"
                                            >
                                                View Receipt
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>)}
                    </div>
                </div>
            </div>
            {showReturnModal && (
                <Modal onClose={closeReturnModal}>
                    <div className="p-6 max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Request Return/Refund</h2>
                        <label className="block mb-2 font-medium">Reason for return/refund</label>
                        <textarea
                            className="w-full border rounded p-2 mb-4"
                            rows={3}
                            value={returnReason}
                            onChange={e => setReturnReason(e.target.value)}
                            placeholder="Describe the issue or reason..."
                        />
                        <label className="block mb-2 font-medium">Refund Method</label>
                        <select
                            className="w-full border rounded p-2 mb-4"
                            value={refundMethod}
                            onChange={e => setRefundMethod(e.target.value)}
                        >
                            <option value="">Select method</option>
                            <option value="Original Payment">Original Payment</option>
                            <option value="Cash, After returning the product">Cash, After returning the product</option>
                        </select>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={submitReturnRequest}
                                disabled={!returnReason || !refundMethod || submittingReturn}
                                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                            >
                                {submittingReturn ? 'Submitting...' : 'Submit Request'}
                            </button>
                            <button
                                onClick={closeReturnModal}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            {showReceiptModal && receiptOrder && (
                <Modal onClose={closeReceiptModal}>
                    <div className="p-6 max-w-lg w-full">
                        <h2 className="text-lg font-semibold mb-2">Order Receipt</h2>
                        <div className="mb-2 text-xs text-gray-500">Order ID: {receiptOrder._id}</div>
                        <div className="mb-2 text-xs text-gray-500">Date: {new Date(receiptOrder.date).toLocaleDateString()}</div>
                        <div className="mb-4 text-xs text-gray-500">Status: {receiptOrder.status}</div>
                        <div className="mb-4">
                            <h3 className="font-medium mb-1">Shipping Address</h3>
                            <div className="text-sm text-gray-700">
                                {receiptOrder.address?.fullName}<br/>
                                {receiptOrder.address?.area}, {receiptOrder.address?.city}, {receiptOrder.address?.state}<br/>
                                {receiptOrder.address?.phone}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-medium mb-1">Products</h3>
                            <table className="w-full text-xs border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-right">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receiptOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2">{item.product?.name || item.product}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>{currency}{receiptOrder.amount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax:</span>
                                <span>{currency}{receiptOrder.tax}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span>{receiptOrder.shippingFee === 0 ? 'FREE' : currency + receiptOrder.shippingFee}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base mt-2">
                                <span>Total:</span>
                                <span>{currency}{receiptOrder.totalAmount || receiptOrder.amount}</span>
                            </div>
                        </div>
                        <div className="mb-4 text-sm">
                            <span className="font-medium">Payment Method:</span> {receiptOrder.paymentMethod}<br/>
                            <span className="font-medium">Payment Status:</span> {receiptOrder.paymentStatus}
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        >
                            Print Receipt
                        </button>
                    </div>
                </Modal>
            )}
            <Footer />
        </>
    );
};

export default MyOrders;