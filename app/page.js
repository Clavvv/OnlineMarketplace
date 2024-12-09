'use client'
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()
  useEffect(() => {
    /*
    Must put client-side code into the useEffect so it executes properly

    useEffect with an empty array (dependencies) means it'll only trigger a refresh/repaint/execute the code inside of it, on mount

    lets say we have a graph or something we would then put the variables of graph in the array (usually stateful variables) so when I change the value of it
    the graph is automatically updated
    */
    const parent = document.getElementById('btnParent')
    const tables = ['Products', 'Users', 'Transactions', 'Categories', 'Sizes', 'Listings', 'Product-Transactions'];
    tables.forEach((tableName) => {
      const button = document.createElement('button')
      button.textContent = tableName
      button.className = 'm-5 px-5 text-lg place-self-center h-20 transition-transform duration-300 ease-in-out hover:scale-110'
      button.onclick = () => {
        router.push(`/${tableName.toLowerCase()}`)
      }
      parent.appendChild(button)
      
    })

  }, [])

  const testTransaction = async () => {
    fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    })
  }


  return (
    <div id='btnParent' className= 'flex flex-row h-screen w-screen justify-center'>
    </div>
  )
}
