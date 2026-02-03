'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Save, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditSiteContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    owner_name: '',
    about_text: '',
    about_image: '',
    contact_phone: '',
    contact_email: ''
  })

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', 1).single()
      if (data) {
        setFormData({
            owner_name: data.owner_name || '',
            about_text: data.about_text || '',
            about_image: data.about_image || '',
            contact_phone: data.contact_phone || '',
            contact_email: data.contact_email || ''
        })
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Image Upload Logic (Reused from Add Car)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    
    try {
      const file = e.target.files[0]
      const fileName = `owner-${Date.now()}`
      const { error } = await supabase.storage.from('car-images').upload(fileName, file)
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(fileName)
      setFormData(prev => ({ ...prev, about_image: publicUrl }))
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('site_content').update(formData).eq('id', 1)
    if (error) alert('Error saving: ' + error.message)
    else alert('Site Info Updated!')
    setSaving(false)
  }

  if (loading) return <div className="text-white p-10">Loading settings...</div>

  return (
    <div className="min-h-screen bg-tajiree-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/dashboard" className="flex items-center text-gray-400 mb-6 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2"/> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-tajiree-teal mb-8">Edit Site Content</h1>

        <form onSubmit={handleSave} className="space-y-6">
            {/* Owner Profile */}
            <div className="bg-tajiree-darkgray p-6 rounded border border-gray-700">
                <h2 className="text-xl font-bold text-tajiree-gold mb-4">Founder Profile</h2>
                
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">Owner Name</label>
                    <input name="owner_name" value={formData.owner_name} onChange={handleChange} className="w-full bg-black border border-gray-600 p-3 rounded text-white" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">About Text (Bio)</label>
                    <textarea name="about_text" rows={6} value={formData.about_text} onChange={handleChange} className="w-full bg-black border border-gray-600 p-3 rounded text-white" />
                </div>

                {/* Owner Image */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Owner Photo</label>
                    <div className="flex items-center gap-4">
                        {formData.about_image && <img src={formData.about_image} className="w-20 h-20 rounded-full object-cover border border-tajiree-gold" />}
                        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded flex items-center">
                            <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Change Photo'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-tajiree-darkgray p-6 rounded border border-gray-700">
                <h2 className="text-xl font-bold text-tajiree-teal mb-4">Contact Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                        <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full bg-black border border-gray-600 p-3 rounded text-white" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                        <input name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full bg-black border border-gray-600 p-3 rounded text-white" />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={saving} className="w-full bg-tajiree-teal hover:bg-teal-600 text-white font-bold py-4 rounded text-lg flex justify-center items-center">
                <Save className="w-5 h-5 mr-2" /> {saving ? 'Saving Changes...' : 'Save All Changes'}
            </button>
        </form>
      </div>
    </div>
  )
}