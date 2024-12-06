'use client'
import { usePathname } from "next/navigation";
import { MdHome } from "react-icons/md";

export default function Navigation() {

    const path = usePathname();
    const isLandingPage = path === '/';

    if (isLandingPage) return null;

    return (
        <nav className='top-0 left-0 w-full text-white shadow-md z-10'>
            <div className="max-w-7xl mx-10 px-4 pt-5 flex justify-start items-center place-items-center">
                <div className="space-x-10 mx-10">
                    <MdHome className='inline-flex h-full pb-0.5' size={25} />
                    <a href="/products" className="h-full inline-flex items-center pt-1">Products</a>
                    <a href="/users" className="h-full inline-flex items-center pt-1">Users</a>
                    <a href='/transactions' className='h-full inline-flex items-center pt-1'>Transactions</a>
                    <a href='/categories' className='h-full inline-flex items-center pt-1'>Categories</a>
                    <a href='/sizes' className='h-full inline-flex items-center pt-1'>Sizes</a>
                    <a href='/listings' className='h-full inline-flex items-center pt-1'>Listings</a>
                    <a href='/product-transactions' className='h-full inline-flex items-center pt-1'>Product-Transactions</a>
                </div>
            </div>
        </nav>
    )
}