import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { calculateTax, calculateShippingFee, calculateTotal, getShippingZoneInfo, getTaxRatePercentage } from "@/lib/taxShipping";

const countries = [
  "Philippines",
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
];
const addressTypes = ["Home", "Work", "Other"];

const OrderSummary = ({ onOrderPlaced }) => {
    const { userData, userAddresses, getCartAmount, getToken, router, cartItems, products, clearCart, addNotification, deleteAddress, fetchUserAddresses } = useAppContext();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [taxAmount, setTaxAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [shippingInfo, setShippingInfo] = useState(null);
    const [gcashCustomerNumber, setGcashCustomerNumber] = useState("");

    // Calculate tax and shipping when address or cart changes
    useEffect(() => {
        if (selectedAddress) {
            const subtotal = getCartAmount();
            const tax = calculateTax(subtotal, selectedAddress);
            const shipping = calculateShippingFee(subtotal, selectedAddress);
            const total = calculateTotal(subtotal, selectedAddress);
            const zoneInfo = getShippingZoneInfo(selectedAddress);

            setTaxAmount(tax);
            setShippingFee(shipping);
            setTotalAmount(total);
            setShippingInfo(zoneInfo);
        } else {
            setTaxAmount(0);
            setShippingFee(0);
            setTotalAmount(getCartAmount());
            setShippingInfo(null);
        }
    }, [selectedAddress, cartItems, getCartAmount]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }
        if (paymentMethod === "Gcash" && !gcashCustomerNumber) {
            toast.error("Please provide your GCash number");
            return;
        }

        // Convert cart items to the format expected by the API
        const items = [];
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const product = products.find(p => p._id === itemId);
                if (product) {
                    // Validate product data
                    if (!product.offerPrice || product.offerPrice <= 0) {
                        toast.error(`Invalid price for ${product.name}`);
                        return;
                    }
                    if (product.stock < cartItems[itemId]) {
                        toast.error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                        return;
                    }
                    items.push({
                        product: itemId,
                        quantity: cartItems[itemId]
                    });
                } else {
                    toast.error(`Product not found: ${itemId}`);
                    return;
                }
            }
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate address data
        const requiredAddressFields = ['fullName', 'phone', 'pincode', 'area', 'city', 'state'];
        const missingAddressFields = requiredAddressFields.filter(field => !selectedAddress[field] || selectedAddress[field].trim() === '');
        
        if (missingAddressFields.length > 0) {
            toast.error(`Missing address fields: ${missingAddressFields.join(', ')}`);
            return;
        }

        // Debug logging
        console.log('Selected Address:', selectedAddress);
        console.log('Cart Items:', items);
        console.log('Payment Method:', paymentMethod);
        console.log('Tax Amount:', taxAmount);
        console.log('Shipping Fee:', shippingFee);
        console.log('Total Amount:', totalAmount);

        setLoading(true);
        try {
            const token = await getToken();
            const requestData = {
                address: selectedAddress,
                items: items,
                paymentMethod: paymentMethod,
                gcash: paymentMethod === "Gcash" ? {
                    customerNumber: gcashCustomerNumber
                } : undefined
            };
            console.log('Sending to API:', requestData);
            
            const { data } = await axios.post('/api/order/create', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('API Response:', data);

            if (data.success) {
                addNotification({ message: 'Order placed successfully!', link: '/my-orders' });
                // Clear the cart after successful order
                await clearCart();
                if (onOrderPlaced) {
                    onOrderPlaced(data.order);
                } else {
                    router.push('/order-placed');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address) => {
        return `${address.fullName}, ${address.area}, ${address.city}, ${address.state}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const handleDeleteAddress = async (addressIndex, e) => {
        e.stopPropagation();
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
                    fetchUserAddresses();
                    
                    // If the deleted address was selected, clear the selection
                    if (selectedAddress && userAddresses[addressIndex] === selectedAddress) {
                        setSelectedAddress(null);
                    }
                } else {
                    toast.error(data.message || 'Failed to delete address');
                }
            } catch (error) {
                console.error('Error deleting address:', error);
                toast.error(error.response?.data?.message || 'Failed to delete address');
            }
        }
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
                            {Array.isArray(userAddresses) && userAddresses.length > 0 ? (
                                userAddresses.map((address, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <button
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex-1 text-left"
                                        >
                                            {formatAddress(address)}
                                        </button>
                                        <div className="flex gap-2 ml-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/edit-address?index=${index}`);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteAddress(index, e)}
                                                className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-gray-500">
                                    <p>No addresses found.</p>
                                    <button
                                        onClick={() => router.push('/add-address')}
                                        className="mt-2 text-orange-600 hover:text-orange-700 text-sm underline"
                                    >
                                        Add your first address
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Shipping Zone Information */}
                {shippingInfo && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Shipping Zone: {shippingInfo.zone}</p>
                            <p>Estimated Delivery: {shippingInfo.estimatedDays}</p>
                            {shippingInfo.freeShippingThreshold > 0 && (
                                <p className="text-green-600 font-medium">
                                    Free shipping on orders over ₱{shippingInfo.freeShippingThreshold.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}
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
                            value="Gcash"
                            checked={paymentMethod === 'Gcash'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        Gcash
                    </label>
                </div>
                {paymentMethod === 'Gcash' && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                        <label className="block mb-2 font-medium">Your GCash Number</label>
                        <input
                            type="text"
                            value={gcashCustomerNumber}
                            onChange={e => setGcashCustomerNumber(e.target.value)}
                            className="w-full border rounded p-2 mb-2"
                            placeholder="Enter your GCash number"
                        />
                    </div>
                )}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(getCartAmount())}</span>
                </div>
                
                {selectedAddress && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">
                                Tax ({getTaxRatePercentage(selectedAddress)}%):
                            </span>
                            <span className="font-medium">{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Shipping:</span>
                            <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                                {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                            </span>
                        </div>
                    </>
                )}
                
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount)}</span>
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