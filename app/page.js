'use client'
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {

    /*
    Must put client-side code into the useEffect so it executes properly

    useEffect with an empty array (dependencies) means it'll only trigger a refresh/repaint/execute the code inside of it, on mount

    lets say we have a graph or something we would then put the variables of graph in the array (usually stateful variables) so when I change the value of it
    the graph is automatically updated
    */

    const parent = document.getElementById('btnParent')
    const tables = ['Products', 'Users', 'Transactions', 'Categories', 'Sizes', 'Listings', 'Product-Transaction'];
    tables.forEach((tableName) => {
      const button = document.createElement('button')
      button.textContent = tableName
      button.className = 'm-2 px-3 text-lg'
      parent.appendChild(button)
      
    })


  }, [])


  return (
    <div id='btnParent' className= 'flex flex-row h-screen w-screen justify-center'>
    </div>
  )
}
