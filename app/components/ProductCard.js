
export default function ProductCard({product}){

    return (
        <div className="w-64 p-4 border border-gray-300 rounded-lg shadow-md bg-slate-50">
            <>
                <img className="w-full h-20 object-cover rounded-md" src = {product.image} alt= {product.product_name}/>
                <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-900">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-sm text-gray-600">{product.sizeID}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">${product.price ? product.price : 99.99}</p>
                    <p className="text-lg text-gray-900 mt-2 pb-1">product_id = {product.product_id}</p>
                </div>
            </>
        </div>
    )
}