"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";

const ArchivedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    const fetchArchivedProducts = async () => {
      try {
        const { data } = await axios.get("/api/product/archived-list");
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedProducts();
  }, []);

  const handleRestore = async (productId) => {
    setRestoringId(productId);
    try {
      const { data } = await axios.post("/api/product/unarchive", { productId });
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product restored successfully");
      } else {
        toast.error(data.message || "Failed to restore product");
      }
    } catch (error) {
      toast.error("Failed to restore product");
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 relative">
      <div className="p-6">
        <div className="mb-2"><BackButton /></div>
        <h1 className="text-2xl font-bold mb-6">Archived Products</h1>
        {products.length === 0 ? (
          <p className="text-gray-500">No archived products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRestore(product._id)}
                  disabled={restoringId === product._id}
                  className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {restoringId === product._id ? "Restoring..." : "Restore"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedProductsPage; 