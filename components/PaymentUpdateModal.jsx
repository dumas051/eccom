import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentUpdateModal = ({ isOpen, onClose, order, onUpdate }) => {
    const { getToken } = useAppContext();
    const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'Pending');
    const [paymentDetails, setPaymentDetails] = useState({
        transactionId: order?.paymentDetails?.transactionId || '',
        paymentGateway: order?.paymentDetails?.paymentGateway || '',
        paymentNotes: order?.paymentDetails?.paymentNotes || '',
        collectedBy: order?.paymentDetails?.collectedBy || '',
        paymentAmount: order?.amount || 0
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();
            const { data } = await axios.post('/api/order/update-payment', {
                orderId: order._id,
                paymentStatus,
                paymentDetails: {
                    ...paymentDetails,
                    paymentAmount: parseFloat(paymentDetails.paymentAmount)
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Payment status updated successfully');
                onUpdate(data.order);
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <Modal onClose={onClose}>
            <div className="p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Update Payment Status</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Order #{order._id} - {order.paymentMethod}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Payment Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Payment Status</label>
                        <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>

                    {/* Payment Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Payment Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={paymentDetails.paymentAmount}
                            onChange={(e) => setPaymentDetails({...paymentDetails, paymentAmount: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    {/* Conditional fields based on payment method */}
                    {order.paymentMethod === 'COD' ? (
                        <>
                            {/* COD specific fields */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Collected By</label>
                                <input
                                    type="text"
                                    value={paymentDetails.collectedBy}
                                    onChange={(e) => setPaymentDetails({...paymentDetails, collectedBy: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Delivery person name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Notes</label>
                                <textarea
                                    value={paymentDetails.paymentNotes}
                                    onChange={(e) => setPaymentDetails({...paymentDetails, paymentNotes: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    rows={3}
                                    placeholder="Any notes about the payment collection"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Online payment specific fields */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Transaction ID</label>
                                <input
                                    type="text"
                                    value={paymentDetails.transactionId}
                                    onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Payment gateway transaction ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Gateway</label>
                                <input
                                    type="text"
                                    value={paymentDetails.paymentGateway}
                                    onChange={(e) => setPaymentDetails({...paymentDetails, paymentGateway: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="e.g., Stripe, PayPal, Razorpay"
                                />
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PaymentUpdateModal; 