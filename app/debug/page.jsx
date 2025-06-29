'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

const DebugStockPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/product/debug-stock');
        if (data.success) {
          setAllProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug: Product Stock Information</h1>
      <p className="mb-4">Total products in database: {allProducts.length}</p>
      {allProducts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No products found in database.
        </div>
      ) : (
        <div className="space-y-4">
          {allProducts.map((product) => (
            <div key={product._id} className="border border-gray-300 p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">Seller ID: {product.sellerId}</p>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Price: ₱{product.price} | Offer: ₱{product.offerPrice}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                  product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock} | Status: {product.stockStatus}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  Threshold: {product.lowStockThreshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugStockPage; 