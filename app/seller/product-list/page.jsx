'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import BackButton from "@/components/BackButton";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user, currency } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [archivingId, setArchivingId] = useState(null);

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
    setArchivingId(productId);
    try {
      const token = await getToken()
      const { data } = await axios.post('/api/product/delete', { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter(product => product._id !== productId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setArchivingId(null);
    }
  }

  const handleArchive = async (productId) => {
    setArchivingId(productId);
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/archive', { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success("Product archived successfully");
        setProducts(products.filter(product => product._id !== productId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setArchivingId(null);
    }
  };

  useEffect(() => {
    fetchSellerProduct();
  }, [])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between relative">
      <div className="absolute top-2 left-4 z-20"><BackButton customText="Back to Dashboard" customHref="/seller" /></div>
      {loading ? <Loading /> : <div className="w-full flex justify-center md:p-10 p-4">
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto overflow-x-auto rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full min-w-[900px] overflow-hidden">
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '22%' }} />
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
                      {product.archived && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold align-middle">Archived</span>
                      )}
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
                  <td className="px-4 py-3 flex flex-col md:flex-row items-start md:items-center gap-2">
                    <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md w-full md:w-auto">
                      <span className="hidden md:block">Visit</span>
                      <Image
                        className="h-3.5"
                        src={assets.redirect_icon}
                        alt="redirect_icon"
                      />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md w-full md:w-auto">
                      <span className="hidden md:block">Delete</span>
                    </button>
                    <button
                      onClick={() => handleArchive(product._id)}
                      disabled={archivingId === product._id}
                      className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-gray-600 text-white rounded-md w-full md:w-auto disabled:opacity-50"
                    >
                      <span className="hidden md:block">Archive</span>
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