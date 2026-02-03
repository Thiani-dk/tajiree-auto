'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Upload, X, Plus } from 'lucide-react'

export default function AddCar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Basic Info
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '',
    status: 'available', is_featured: false
  })

  // Dynamic Specs (The "Engine Size" requirement)
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  // Images
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [sliderSelection, setSliderSelection] = useState<number>(-1) // Index of image for slider

  // 1. Handle Text Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 2. Handle Image Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
      
      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls([...previewUrls, ...newPreviews])
    }
  }

  // 3. Remove Image
  const removeImage = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)

    const newPreviews = [...previewUrls]
    newPreviews.splice(index, 1)
    setPreviewUrls(newPreviews)
  }

  // 4. Add Dynamic Field
  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setSpecs([...specs, { key: newSpecKey, value: newSpecValue }])
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  // 5. SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // A. Upload Images to Supabase Storage
      const imageUrls: string[] = []
      
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file)
        
        if (error) throw error
        
        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName)
          
        imageUrls.push(publicUrl)
      }

      // B. Determine Main Image and Slider Image
      // Default: First image is main. 
      const mainImage = imageUrls.length > 0 ? imageUrls[0] : null
      
      // If user selected a slider image, mark the car as featured
      const isFeatured = sliderSelection >= 0

      // C. Convert Specs Array to JSON object
      const specsJson = specs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})

      // D. Insert into Database
      const { error: dbError } = await supabase.from('cars').insert([{
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        status: formData.status,
        main_image: mainImage,
        image_gallery: imageUrls,
        is_featured: isFeatured,
        specs: specsJson
      }])

      if (dbError) throw dbError

      alert('Car added successfully!')
      router.push('/admin/dashboard')

    } catch (error: any) {
      alert('Error uploading: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tajiree-black text-white p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-tajiree-teal mb-6">Add New Vehicle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <input name="make" placeholder="Make (e.g. Toyota)" onChange={handleChange} required className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            <input name="model" placeholder="Model (e.g. Harrier)" onChange={handleChange} required className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            <input name="year" type="number" placeholder="Year" onChange={handleChange} required className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            <input name="price" type="number" placeholder="Price (KES)" onChange={handleChange} required className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
          </div>

          {/* Section 2: Images (The "Phone Upload" part) */}
          <div className="bg-tajiree-darkgray p-4 rounded border border-gray-700">
            <label className="block mb-2 font-bold text-tajiree-gold">Upload Photos</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Click to upload from Gallery</p>
                </div>
                <input type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*" />
              </label>
            </div>

            {/* Image Previews & Slider Selection */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} className="w-full h-24 object-cover rounded" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 rounded-full p-1">
                      <X className="w-3 h-3 text-white" />
                    </button>
                    
                    {/* Slider Checkbox */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/70 p-1 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="sliderSelect" 
                          checked={sliderSelection === index} 
                          onChange={() => setSliderSelection(index)}
                        />
                        <span className="text-tajiree-gold">Slider?</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Dynamic Fields (Specs) */}
          <div className="bg-tajiree-darkgray p-4 rounded border border-gray-700">
            <label className="block mb-2 font-bold text-tajiree-teal">Additional Details (Dynamic)</label>
            <div className="flex gap-2 mb-2">
              <input 
                placeholder="Field (e.g. Engine)" 
                value={newSpecKey} 
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="bg-black p-2 rounded border border-gray-700 w-1/3 text-sm" 
              />
              <input 
                placeholder="Value (e.g. 2000cc)" 
                value={newSpecValue} 
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="bg-black p-2 rounded border border-gray-700 w-1/3 text-sm" 
              />
              <button type="button" onClick={addSpec} className="bg-tajiree-teal p-2 rounded text-white w-1/3 text-sm flex justify-center items-center">
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            
            {/* List of added specs */}
            <div className="flex flex-wrap gap-2 mt-2">
              {specs.map((spec, idx) => (
                <span key={idx} className="bg-gray-800 px-3 py-1 rounded text-sm border border-gray-600">
                  {spec.key}: <span className="text-white font-bold">{spec.value}</span>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tajiree-gold hover:bg-yellow-500 text-black font-bold py-4 rounded text-lg transition-all"
          >
            {loading ? 'Uploading...' : 'Publish to Website'}
          </button>

        </form>
      </div>
    </div>
  )
}