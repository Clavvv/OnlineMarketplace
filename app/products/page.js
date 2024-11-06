'use client'
import {useState, useEffect} from 'react'
import ProductLoadingCard from '../components/ProductLoadingCard'
import ProductCard from '../components/ProductCard'

export default function products(){

    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])

    useEffect(() => {

        fetch('/products_sample.json')
            .then((response) => response.json())
            .then((jsonData) => {

                let data = jsonData.map((product) => {
                    return {
                        ...product,
                        image: `/sample_product_image.png`
                    }
                })
                data = [...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data]
                setProducts(data)
                setIsLoading(false)
            })
            .catch((error) => console.error('json no load: ', error))
    }, [])

    return (
        <div>
            <h1 className ='text-xl mb-10 pr-10 py-10 ml-[220px]'>Products</h1>
            <div className = 'grid ml-[220px] grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-6'>
            {products.map((product, index) => (
                    <div
                        className = 'w-full'
                        id={index === products.length - 1? 'last-product' : ''}
                    >
                        <ProductCard product={product} isLoading={isLoading}/>
                    </div>
            ))}
            </div>
        </div>
    )
}