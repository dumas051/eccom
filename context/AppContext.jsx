'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const { user } = useUser()
    const { getToken } = useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [userAddresses, setUserAddresses] = useState([]);

    const addNewAddress = (newAddress) => {
        setUserAddresses(prevAddresses => [...prevAddresses, newAddress]);
    }

    const updateCartInDB = async (cartData) => {
        if (user) {
            try {
                const token = await getToken()
                await axios.post('/api/user/cart', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } catch (error) {
                console.error('Error updating cart:', error);
                toast.error(error.response?.data?.message || error.message || 'Failed to update cart')
            }
        }
    }

    const fetchUserAddresses = async () => {
        if (!user) return;
        
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/user/get-address', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setUserAddresses(data.address || [])
            } else {
                toast.error(data.message || 'Failed to fetch addresses')
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch addresses')
        }
    }

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products || [])
            } else {
                toast.error(data.message || 'Failed to fetch products')
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch products')
        }
    }

    const fetchUserData = async () => {
        if (!user) return;
        
        try {
            // Check if user has seller role
            if (user.publicMetadata?.role === 'seller') {
                setIsSeller(true)
            }

            const token = await getToken()

            const { data } = await axios.get('/api/user/data', { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            })

            if (data.success) {
                setUserData(data.user)
                setCartItems(data.user?.cartItems || {})
            } else {
                toast.error(data.message || 'Failed to fetch user data')
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch user data')
        }
    }

    const addToCart = async (itemId) => {
        if (!itemId) {
            toast.error('Invalid product ID')
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        await updateCartInDB(cartData);
        toast.success('Item added to cart')
    }

    const updateCartQuantity = async (itemId, quantity) => {
        if (!itemId) {
            toast.error('Invalid product ID')
            return;
        }

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
            toast.success('Item removed from cart')
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        await updateCartInDB(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            if (cartItems[items] > 0) {
                totalAmount += (itemInfo.offerPrice || 0) * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserAddresses()
        }
    }, [user])

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        userAddresses, fetchUserAddresses,
        addNewAddress
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
