'use client'
import { usePathname } from "next/navigation";
import { MdHome } from "react-icons/md";
import Link from "next/link";

export default function Navigation() {

    const path = usePathname();
    const isLandingPage = path === '/';

    if (isLandingPage) return null;

    return (
        <nav className='top-0 left-0 w-full text-white shadow-md z-10'>
            <div className="max-w-7xl mx-10 px-4 pt-5 flex justify-start items-center place-items-center">
                <div className="space-x-10 mx-10">
                    <Link href="/" passHref>
                        <MdHome className='inline-flex h-full pb-1.5' size={25} />
                    </Link>
                    <Link href="/products" passHref>
                        <span className="h-full inline-flex items-center pt-1">Products</span>
                    </Link>
                    <Link href="/users" passHref>
                        <span className="h-full inline-flex items-center pt-1">Users</span>
                    </Link>
                    <Link href="/transactions" passHref>
                        <span className='h-full inline-flex items-center pt-1'>Transactions</span>
                    </Link>
                    <Link href="/categories" passHref>
                        <span className='h-full inline-flex items-center pt-1'>Categories</span>
                    </Link>
                    <Link href="/sizes" passHref>
                        <span className='h-full inline-flex items-center pt-1'>Sizes</span>
                    </Link>
                    <Link href="/listings" passHref>
                        <span className='h-full inline-flex items-center pt-1'>Listings</span>
                    </Link>
                    <Link href="/product-transactions" passHref>
                        <span className='h-full inline-flex items-center pt-1'>Product-Transactions</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}