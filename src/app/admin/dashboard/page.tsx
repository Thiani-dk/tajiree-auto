'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Edit, LogOut } from 'lucide-react'

// Define the shape of our Car data
interface Car {
  id: string
  make: string
  model: string
  price: number
  year: number
  status: string
  main_image: string | null
}

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 1. Check if user is logged in & Fetch Data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin') // Kick out if not logged in
      } else {
        fetchCars()
      }
    }
    checkUser()
  }, [router])

  // 2. Fetch Cars from Database
  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Error fetching cars:', error)
    else setCars(data || [])
    setLoading(false)
  }

  // 3. Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return

    const { error } = await supabase.from('cars').delete().eq('id', id)
    if (error) alert('Error deleting: ' + error.message)
    else {
      // Remove from local state so it disappears immediately
      setCars(cars.filter(car => car.id !== id))
    }
  }

  // 4. Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) return <div className="p-10 text-white text-center">Loading Inventory...</div>

  return (
    <div className="min-h-screen bg-tajiree-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-tajiree-teal">Inventory Manager</h1>
        <button onClick={handleLogout} className="flex items-center text-sm text-gray-400 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </button>
      </div>

      {/* Action Bar (Updated with Edit Site Info button) */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link href="/admin/add">
          <button className="flex items-center bg-tajiree-teal hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105">
            <Plus className="w-5 h-5 mr-2" /> Add New Car
          </button>
        </Link>
        <Link href="/admin/content">
          <button className="flex items-center bg-tajiree-darkgray border border-gray-600 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105">
            <Edit className="w-5 h-5 mr-2" /> Edit Site Info
          </button>
        </Link>
      </div>

      {/* Inventory Grid */}
      {cars.length === 0 ? (
        <div className="text-center py-20 bg-tajiree-darkgray rounded-lg border border-dashed border-gray-700">
          <p className="text-gray-400 mb-4">No cars in inventory yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-tajiree-darkgray rounded-lg overflow-hidden shadow-md border border-gray-800">
              {/* Image Preview */}
              <div className="h-48 bg-gray-800 relative">
                {car.main_image ? (
                  <img src={car.main_image} alt={car.model} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${car.status === 'available' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                  {car.status.toUpperCase()}
                </span>
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white">{car.make} {car.model}</h3>
                <p className="text-tajiree-gold font-mono text-lg mt-1">KES {car.price.toLocaleString()}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                  <span className="text-sm text-gray-500">{car.year}</span>
                  <div className="flex gap-3">
                    {/* Edit Button */}
                    <Link href={`/admin/edit/${car.id}`} className="text-blue-400 hover:text-blue-300">
                      <Edit className="w-5 h-5" />
                    </Link>
                    {/* Delete Button */}
                    <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}