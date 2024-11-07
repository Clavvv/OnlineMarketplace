'use client'
import {useState, useEffect} from 'react'
import ProductCard from '../components/ProductCard'
import ProductLoadingCard from '../components/ProductLoadingCard'

/* 
need to handle isLoading skeleton stuff in this function and not in productCard
*/

export default function Products(){

    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])
    const fixedLoadingSize = 8
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    useEffect(() => {
        
        const getData = async () => {
            await fetch('/products_sample.json')
            .then((response) => response.json())
            .then((jsonData) => {

                let data = jsonData.map((product) => {
                    return {
                        ...product,
                        image: `/sample_product_image.png`
                    }
                })
                data = [...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data]     //multiplying sample data to populate more of the page
                setProducts(data)
                setIsLoading(false)
            })
            .catch((error) => console.error('json no load: ', error))
        }

        getData()

    }, [])

    return (
        <div>
            <h1 className ='text-xl mb-10 pr-10 py-10 ml-[220px]'>Products</h1>
            <div className = 'grid ml-[220px] grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-6'>
                {isLoading ? new Array(8).fill(null).map((_, index) => (
                    <ProductLoadingCard key={index} />))

                 : products.map((product, index) => (
                    <div
                        className = 'w-full'
                        key = {index}
                        id={index === products.length - 1 ? 'last-product' : ''}
                    >
                        <ProductCard product={product}/>
                    </div>
            ))}
            </div>
        </div>
    )
}