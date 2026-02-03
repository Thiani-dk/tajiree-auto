'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useParams } from 'next/navigation'
import { MessageCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarDetails() {
  const { id } = useParams()
  const [car, setCar] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [gallery, setGallery] = useState<string[]>([])

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return
      const { data } = await supabase.from('cars').select('*').eq('id', id).single()
      if (data) {
        setCar(data)
        setGallery(data.image_gallery || [])
        setSelectedImage(data.main_image)
      }
    }
    fetchCar()
  }, [id])

  // Helper to change image via arrows
  const navigateImage = (direction: 'next' | 'prev') => {
    const currentIndex = gallery.indexOf(selectedImage)
    if (currentIndex === -1) return // Should not happen if data is clean

    let newIndex
    if (direction === 'next') {
        newIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1
    } else {
        newIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1
    }
    setSelectedImage(gallery[newIndex])
  }

  if (!car) return <div className="min-h-screen bg-tajiree-black text-white flex items-center justify-center">Loading Machine...</div>

  const message = `Hi TajireeAuto, I am interested in the ${car.year} ${car.make} ${car.model} listed for KES ${car.price.toLocaleString()}. Is it still available?`
  const whatsappUrl = `https://wa.me/254721590781?text=${encodeURIComponent(message)}`

  return (
    <main className="min-h-screen bg-tajiree-black text-white">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image Viewer with Aspect Ratio & Arrows */}
          <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-gray-800 group">
            <img src={selectedImage} alt={car.model} className="w-full h-full object-contain" />
            
            {/* Navigation Arrows */}
            {gallery.length > 1 && (
                <>
                    <button onClick={() => navigateImage('prev')} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-tajiree-teal transition">
                        <ChevronLeft className="w-6 h-6 text-white"/>
                    </button>
                    <button onClick={() => navigateImage('next')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-tajiree-teal transition">
                        <ChevronRight className="w-6 h-6 text-white"/>
                    </button>
                </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {gallery.map((img: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === img ? 'border-tajiree-gold' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Details & Contact */}
        <div>
          <span className="text-tajiree-teal font-bold tracking-wider uppercase text-sm">Inventory #{car.id.slice(0, 8)}</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">{car.make} {car.model}</h1>
          <p className="text-3xl text-tajiree-gold font-mono font-bold mb-6">KES {car.price.toLocaleString()}</p>
          
          <div className="bg-tajiree-darkgray p-6 rounded-xl border border-gray-800 mb-8">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div><span className="text-gray-500 block text-xs uppercase">Year</span> <span className="text-lg">{car.year}</span></div>
              <div>
                  <span className="text-gray-500 block text-xs uppercase">Status</span> 
                  <span className={`text-lg capitalize font-bold ${car.status === 'available' ? 'text-green-500' : 'text-red-500'}`}>{car.status}</span>
              </div>
              
              {car.specs && Object.entries(car.specs).map(([key, value]: any) => (
                <div key={key}>
                   <span className="text-gray-500 block text-xs uppercase">{key}</span> 
                   <span className="text-lg font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-[1.02] shadow-lg shadow-green-900/20"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Chat on WhatsApp
            </a>
            
            <p className="text-center text-gray-500 text-sm mt-2">
              <CheckCircle className="w-4 h-4 inline mr-1 text-tajiree-teal" /> 
              Verified Dealer • Mombasa, Kenya
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}