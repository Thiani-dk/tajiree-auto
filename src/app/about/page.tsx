'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', 1).single()
      if (data) setContent(data)
    }
    fetchData()
  }, [])

  if (!content) return <div className="min-h-screen bg-tajiree-black text-white flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-tajiree-black text-white">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-16 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About <span className="text-tajiree-teal">TajireeAuto</span></h1>
        <div className="w-24 h-1 bg-tajiree-gold mx-auto"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div className="relative">
            <div className="absolute inset-0 bg-tajiree-teal translate-x-4 translate-y-4 rounded-lg"></div>
            {content.about_image ? (
                <img src={content.about_image} alt="Brian Bolo" className="relative z-10 rounded-lg shadow-xl w-full object-cover aspect-[4/5]" />
            ) : (
                <div className="relative z-10 w-full aspect-[4/5] bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                    Owner Photo Not Uploaded
                </div>
            )}
        </div>

        {/* Right: Text */}
        <div>
            <h2 className="text-2xl font-bold text-tajiree-gold mb-2">Meet the Founder</h2>
            <h3 className="text-4xl font-bold mb-6">{content.owner_name}</h3>
            
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line mb-8">
                {content.about_text}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-8">
                <div>
                    <span className="block text-gray-500 text-sm uppercase">Contact Phone</span>
                    <a href={`tel:${content.contact_phone}`} className="text-xl font-bold text-white hover:text-tajiree-teal">{content.contact_phone}</a>
                </div>
                <div>
                    <span className="block text-gray-500 text-sm uppercase">Email Address</span>
                    <a href={`mailto:${content.contact_email}`} className="text-xl font-bold text-white hover:text-tajiree-teal">{content.contact_email}</a>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}