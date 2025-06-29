import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const OrderSummary = ({ onOrderPlaced }) => {
    const { userData, userAddresses, getCartAmount, getToken, router } = useAppContext();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/order/create', {
                address: selectedAddress,
                paymentMethod: paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Order placed successfully!');
                onOrderPlaced(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address) => {
        return `${address.fullName}, ${address.area}, ${address.city}, ${address.state}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Delivery Address */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Address</h3>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full text-left p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {selectedAddress 
                            ? formatAddress(selectedAddress)
                            : 'Select delivery address'
                        }
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {userAddresses.length > 0 ? (
                                userAddresses.map((address, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        {formatAddress(address)}
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-gray-500">
                                    No addresses found. Please add an address first.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        Cash on Delivery (COD)
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Online"
                            checked={paymentMethod === 'Online'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        Online Payment
                    </label>
                </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₱{getCartAmount()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">₱0.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>₱{getCartAmount()}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
    );
};

export default OrderSummary;