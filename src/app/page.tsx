'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'

// Define Types
interface Car {
  id: string
  make: string
  model: string
  price: number
  year: number
  main_image: string
  status: string
  is_featured: boolean
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
      if (data) {
        setCars(data)
        setFeaturedCars(data.filter((car: Car) => car.is_featured))
      }
    }
    fetchData()
  }, [])

  // Auto-Scroll Only (No manual controls needed as per request)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === featuredCars.length - 1 ? 0 : prev + 1))
  }, [featuredCars.length])

  useEffect(() => {
    if (featuredCars.length === 0) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 Seconds per slide
    return () => clearInterval(interval)
  }, [featuredCars, nextSlide])

  const filteredCars = cars.filter(car => 
    `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-tajiree-black">
      <Navbar />

      {/* HERO SLIDER (Clean, No Arrows) */}
      <section className="relative h-[400px] md:h-[550px] w-full overflow-hidden mt-16">
        {featuredCars.length > 0 ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${featuredCars[currentSlide].main_image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-tajiree-black via-black/30 to-transparent flex items-end pb-12 px-6 md:px-20">
                <div className="text-white max-w-2xl animate-fade-in-up">
                  <span className="bg-tajiree-gold text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">
                    Featured Choice
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-2 shadow-black drop-shadow-md">
                    {featuredCars[currentSlide].make} {featuredCars[currentSlide].model}
                  </h1>
                  <p className="text-2xl text-tajiree-teal font-bold mb-6 bg-black/60 inline-block px-2 rounded backdrop-blur-sm">
                    KES {featuredCars[currentSlide].price.toLocaleString()}
                  </p>
                  <br />
                  <Link href={`/inventory/${featuredCars[currentSlide].id}`}>
                    <button className="bg-tajiree-orange hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 inline-flex items-center shadow-lg">
                      Check It Out <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Subtle Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {featuredCars.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-tajiree-gold w-6' : 'bg-gray-500'}`}
                />
              ))}
            </div>
          </>
        ) : (
           <div className="h-full flex items-center justify-center text-white bg-tajiree-darkgray">
             <h2 className="text-2xl">Premium Inventory Loading...</h2>
           </div>
        )}
      </section>

      {/* SEARCH BAR */}
      <div className="bg-tajiree-darkgray py-6 px-4 border-b border-gray-800 sticky top-16 z-40 shadow-xl" id="inventory">
        <div className="max-w-screen-xl mx-auto flex items-center bg-black border border-gray-700 rounded-lg p-2">
          <Search className="text-gray-400 ml-3 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search by Make or Model..." 
            className="bg-transparent border-none text-white w-full p-3 focus:ring-0 focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* INVENTORY GRID */}
      <section className="max-w-screen-xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-white border-l-4 border-tajiree-teal pl-4">Latest Arrivals</h2>
            <span className="text-gray-500 text-sm">{filteredCars.length} Vehicles</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car.id} className="group bg-tajiree-darkgray rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-tajiree-teal transition-all duration-300">
              {/* IMAGE CONTAINER - Enforcing 4:3 Aspect Ratio */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                <img 
                  src={car.main_image} 
                  alt={car.model} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white px-3 py-1 text-sm rounded-full">
                  {car.year}
                </div>
                {car.status !== 'available' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-500 font-bold border-2 border-red-500 px-4 py-2 text-xl rounded uppercase rotate-[-15deg]">{car.status}</span>
                    </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{car.make} {car.model}</h3>
                <p className="text-tajiree-gold text-xl font-mono font-bold mb-4">KES {car.price.toLocaleString()}</p>
                
                <Link href={`/inventory/${car.id}`}>
                  <button className="w-full border border-tajiree-teal text-tajiree-teal hover:bg-tajiree-teal hover:text-white font-bold py-3 rounded transition-colors uppercase tracking-wide">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}