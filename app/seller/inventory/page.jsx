"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Loading from '@/components/Loading';
import Footer from '@/components/seller/Footer';
import BackButton from '@/components/BackButton';

const InventoryManagement = () => {
  const { user, currency, getToken, fetchProductData } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockForm, setStockForm] = useState({
    stock: 0,
    lowStockThreshold: 5
  });

  useEffect(() => {
    if (user) {
      fetchInventoryData();
      fetchProducts();
    }
  }, [user]);

  const fetchInventoryData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/product/inventory?sellerId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setInventoryData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const updateStock = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/update-stock', {
        productId: selectedProduct._id,
        stock: parseInt(stockForm.stock),
        lowStockThreshold: parseInt(stockForm.lowStockThreshold)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        toast.success('Stock updated successfully');
        setShowStockModal(false);
        setSelectedProduct(null);
        setStockForm({ stock: 0, lowStockThreshold: 5 });
        fetchInventoryData();
        fetchProducts();
        fetchProductData();
      } else {
        toast.error(data.message || 'Failed to update stock');
      }
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockForm({
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5
    });
    setShowStockModal(true);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status) => {
    switch (status) {
      case 'In Stock': return '✅';
      case 'Low Stock': return '⚠️';
      case 'Out of Stock': return '❌';
      default: return '📦';
    }
  };

  const fixStockInformation = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/fix-stock', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        fetchInventoryData();
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to fix stock information');
      }
    } catch (error) {
      toast.error('Failed to fix stock information');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="md:p-10 p-4 space-y-5">
        <div className="mb-2"><BackButton /></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-gray-900">Inventory Management</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fixStockInformation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Fix Stock Information
            </button>
            <button
              onClick={() => { fetchInventoryData(); fetchProducts(); fetchProductData(); }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        {inventoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-lg font-semibold">{inventoryData.summary.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-lg font-semibold">{inventoryData.summary.inStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-lg font-semibold">{inventoryData.summary.lowStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-lg font-semibold">{inventoryData.summary.outOfStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-lg font-semibold">{inventoryData.summary.totalStock}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {inventoryData && inventoryData.lowStockAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">⚠️ Low Stock Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryData.lowStockAlerts.map((product) => (
                <div key={product._id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-red-600">
                        Stock: {product.stock} (Threshold: {product.lowStockThreshold})
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusIcon(product.stockStatus)} {product.stockStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Inventory Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Product Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.images[0]?.url || assets.Mouse1}
                            alt={product.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                        {getStockStatusIcon(product.stockStatus)} {product.stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{currency}{product.offerPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openStockModal(product)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Update Stock - {selectedProduct.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={stockForm.stock}
                  onChange={(e) => setStockForm({...stockForm, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={stockForm.lowStockThreshold}
                  onChange={(e) => setStockForm({...stockForm, lowStockThreshold: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert will show when stock falls below this number
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={updateStock}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
              >
                Update Stock
              </button>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                  setStockForm({ stock: 0, lowStockThreshold: 5 });
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
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

export default InventoryManagement; 