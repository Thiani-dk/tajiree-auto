'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, User } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-tajiree-black/90 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
            Tajiree<span className="text-tajiree-teal">Auto</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link href="/admin">
            <button className="text-gray-400 hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Links */}
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-800 rounded-lg bg-tajiree-darkgray md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link href="/" className="block py-2 px-3 text-white bg-tajiree-teal rounded md:bg-transparent md:text-tajiree-teal md:p-0" aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/inventory" className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-tajiree-gold md:p-0 transition-colors">Inventory</Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-tajiree-gold md:p-0 transition-colors">About Us</Link>
            </li>
            <li>
              <a href="tel:0721590781" className="flex items-center py-2 px-3 text-tajiree-orange font-bold md:p-0">
                <Phone className="w-4 h-4 mr-1" /> 0721-590-781
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}