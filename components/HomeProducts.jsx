import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router } = useAppContext()

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.filter(product => product && product.name).map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 text-gray-900">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default HomeProducts;
