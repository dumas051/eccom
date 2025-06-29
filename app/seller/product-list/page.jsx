'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user, currency } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/product/seller-list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post('/api/product/delete', { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        toast.success(data.message)
        setProducts(products.filter(product => product._id !== productId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchSellerProduct();
  }, [])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full flex justify-center md:p-10 p-4">
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full overflow-hidden">
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">Price</th>
                <th className="px-4 py-3 font-medium truncate">Stock</th>
                <th className="px-4 py-3 font-medium truncate">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.filter(product => product && product.name).map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.images[0].url}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full text-gray-900 dark:text-gray-100">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">{currency}{product.offerPrice}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                        product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stockStatus || 'Out of Stock'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.stock || 0} units
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden flex items-center gap-2">
                    <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md">
                      <span className="hidden md:block">Visit</span>
                      <Image
                        className="h-3.5"
                        src={assets.redirect_icon}
                        alt="redirect_icon"
                      />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md">
                      <span className="hidden md:block">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;