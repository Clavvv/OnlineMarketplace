import React, {useState, useEffect} from "react";
import ProductLoadingCard from "./ProductLoadingCard";


export default function ProductCard({product, isLoading}){

    return (
        <div className="w-64 h-56 p-4 border border-gray-300 rounded-lg shadow-md bg-slate-50">
            {isLoading ? (
                <ProductLoadingCard />
            ) : (
            <>
                <img className="w-full h-20 object-cover rounded-md" src = {product.image} alt= {product.product_name}/>
                <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-900">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-sm text-gray-600">{product.sizeID}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">${product.price ? product.price : 99.99}</p>
                </div>
            </>
        )}
        </div>
    )
}