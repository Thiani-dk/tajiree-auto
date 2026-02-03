'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

interface Car {
  id: string
  make: string
  model: string
  price: number
  year: number
  main_image: string
  status: string
}

export default function InventoryPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest, price_asc, price_desc

  // Fetch Data
  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
      if (data) {
        setCars(data)
        setFilteredCars(data)
      }
      setLoading(false)
    }
    fetchCars()
  }, [])

  // Handle Search & Sort
  useEffect(() => {
    let result = [...cars]

    // 1. Search Filter
    if (searchTerm) {
      result = result.filter(car => 
        `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 2. Sort Logic
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'year_new') {
      result.sort((a, b) => b.year - a.year)
    } else {
       // default to newest arrival (by created_at implied by original fetch order)
    }

    setFilteredCars(result)
  }, [searchTerm, sortBy, cars])

  return (
    <main className="min-h-screen bg-tajiree-black text-white">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-tajiree-darkgray pt-32 pb-10 px-4 border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-tajiree-teal">Collection</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our curated selection of premium vehicles. Use the filters below to find your perfect match.
          </p>
        </div>
      </div>

      {/* Filter Bar (Sticky) */}
      <div className="sticky top-16 z-30 bg-black/95 backdrop-blur border-b border-gray-800 py-4 px-4 shadow-xl">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search Make, Model, or Year..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-tajiree-darkgray border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-tajiree-teal focus:outline-none"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <ArrowUpDown className="text-tajiree-teal w-5 h-5" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-tajiree-darkgray border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-1 focus:ring-tajiree-teal focus:outline-none w-full md:w-48 cursor-pointer"
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="year_new">Year: Newest First</option>
                </select>
            </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading Machines...</div>
        ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
                <Filter className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">No vehicles found</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
                <button onClick={() => {setSearchTerm(''); setSortBy('newest')}} className="mt-4 text-tajiree-teal hover:underline">Clear Filters</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                    <div key={car.id} className="group bg-tajiree-darkgray rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-tajiree-teal transition-all duration-300 flex flex-col">
                        {/* Image - Enforcing 4:3 Ratio */}
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                            <img 
                                src={car.main_image || '/placeholder.jpg'} 
                                alt={car.model} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white px-3 py-1 text-sm rounded-full border border-gray-700">
                                {car.year}
                            </div>
                            
                            {/* Status Overlay */}
                            {car.status !== 'available' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <span className={`font-bold border-4 px-6 py-2 text-2xl rounded uppercase rotate-[-12deg] shadow-2xl ${
                                        car.status === 'sold' ? 'text-red-500 border-red-500' : 'text-yellow-500 border-yellow-500'
                                    }`}>
                                        {car.status}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-bold text-white leading-tight">{car.make} {car.model}</h3>
                            </div>
                            <p className="text-tajiree-gold text-xl font-mono font-bold mb-6">KES {car.price.toLocaleString()}</p>
                            
                            <div className="mt-auto">
                                <Link href={`/inventory/${car.id}`}>
                                    <button className="w-full bg-transparent border border-gray-600 text-white hover:bg-tajiree-teal hover:border-tajiree-teal hover:text-white font-bold py-3 rounded-lg transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 group-hover:shadow-lg">
                                        View Full Specs
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <Footer />
    </main>
  )
}