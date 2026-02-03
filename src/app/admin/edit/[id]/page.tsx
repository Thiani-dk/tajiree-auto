'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditCar() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Basic Info
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '',
    status: 'available', is_featured: false
  })

  // Dynamic Specs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  // Images (Read-only for now in Edit mode to keep it simple, or we can manage them)
  const [currentImage, setCurrentImage] = useState('')

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchCar = async () => {
        if(!id) return
        const { data, error } = await supabase.from('cars').select('*').eq('id', id).single()
        
        if (error) {
            alert('Error fetching car')
            router.push('/admin/dashboard')
            return
        }

        if (data) {
            setFormData({
                make: data.make,
                model: data.model,
                year: data.year,
                price: data.price,
                status: data.status,
                is_featured: data.is_featured
            })
            setCurrentImage(data.main_image)

            // Convert JSON specs back to Array for editing
            if (data.specs) {
                const specsArray = Object.entries(data.specs).map(([key, value]) => ({
                    key,
                    value: String(value)
                }))
                setSpecs(specsArray)
            }
        }
        setLoading(false)
    }
    fetchCar()
  }, [id, router])

  // 2. Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setSpecs([...specs, { key: newSpecKey, value: newSpecValue }])
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpec = (index: number) => {
    const newSpecs = [...specs]
    newSpecs.splice(index, 1)
    setSpecs(newSpecs)
  }

  // 3. Update Database
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Convert Array back to JSON
      const specsJson = specs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})

      const { error } = await supabase.from('cars').update({
        make: formData.make,
        model: formData.model,
        year: parseInt(String(formData.year)),
        price: parseFloat(String(formData.price)),
        status: formData.status,
        is_featured: Boolean(formData.is_featured),
        specs: specsJson
      }).eq('id', id)

      if (error) throw error

      alert('Car updated successfully!')
      router.push('/admin/dashboard')

    } catch (error: any) {
      alert('Error updating: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-white p-10">Loading car details...</div>

  return (
    <div className="min-h-screen bg-tajiree-black text-white p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="flex items-center text-gray-400 mb-6 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2"/> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-tajiree-teal">Edit Vehicle</h1>
            <img src={currentImage} className="w-16 h-16 rounded object-cover border border-gray-600" />
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-gray-400">Make</label>
                <input name="make" value={formData.make} onChange={handleChange} className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            </div>
            <div>
                <label className="text-sm text-gray-400">Model</label>
                <input name="model" value={formData.model} onChange={handleChange} className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            </div>
            <div>
                <label className="text-sm text-gray-400">Year</label>
                <input name="year" type="number" value={formData.year} onChange={handleChange} className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            </div>
            <div>
                <label className="text-sm text-gray-400">Price (KES)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} className="bg-tajiree-darkgray p-3 rounded border border-gray-700 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-tajiree-darkgray p-4 rounded border border-gray-700">
             <div>
                <label className="block mb-2 font-bold text-gray-400">Availability Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="bg-black text-white p-2 rounded w-full border border-gray-600">
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                </select>
             </div>
             <div className="flex items-center">
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="is_featured" 
                        checked={formData.is_featured as boolean} 
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                        className="w-5 h-5 text-tajiree-gold rounded focus:ring-0" 
                    />
                    <span className="text-tajiree-gold font-bold">Show on Home Slider?</span>
                 </label>
             </div>
          </div>

          {/* Section 2: Dynamic Fields (Specs) */}
          <div className="bg-tajiree-darkgray p-4 rounded border border-gray-700">
            <label className="block mb-4 font-bold text-tajiree-teal border-b border-gray-700 pb-2">Technical Specs (Dynamic)</label>
            
            {/* Existing Specs */}
            <div className="space-y-2 mb-6">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                   <div className="bg-gray-800 px-3 py-2 rounded text-sm border border-gray-600 min-w-[100px] text-gray-400">
                     {spec.key}
                   </div>
                   <input 
                      value={spec.value}
                      onChange={(e) => {
                          const newSpecs = [...specs]
                          newSpecs[idx].value = e.target.value
                          setSpecs(newSpecs)
                      }}
                      className="bg-black px-3 py-2 rounded text-sm border border-gray-600 flex-grow"
                   />
                   <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 hover:text-red-400 p-2">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
            </div>

            {/* Add New Spec */}
            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <input 
                placeholder="New Field (e.g. Color)" 
                value={newSpecKey} 
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="bg-black p-2 rounded border border-gray-700 w-1/3 text-sm" 
              />
              <input 
                placeholder="Value (e.g. Pearl White)" 
                value={newSpecValue} 
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="bg-black p-2 rounded border border-gray-700 w-1/3 text-sm" 
              />
              <button type="button" onClick={addSpec} className="bg-tajiree-teal p-2 rounded text-white w-1/3 text-sm flex justify-center items-center hover:bg-teal-600">
                <Plus className="w-4 h-4 mr-1" /> Add Field
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded text-lg transition-all flex justify-center items-center gap-2"
          >
            <Save className="w-5 h-5"/> {saving ? 'Saving...' : 'Update Vehicle'}
          </button>

        </form>
      </div>
    </div>
  )
}