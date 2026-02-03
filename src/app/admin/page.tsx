'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
    } else {
      // Redirect to the dashboard on success
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tajiree-black text-white px-4">
      <div className="w-full max-w-md bg-tajiree-darkgray p-8 rounded-lg shadow-xl border border-tajiree-teal/30">
        <h1 className="text-3xl font-bold text-center mb-2 text-tajiree-teal">TajireeAuto</h1>
        <p className="text-center text-gray-400 mb-8">Admin Portal Access</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-tajiree-gray">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-tajiree-black border border-gray-700 focus:border-tajiree-teal focus:outline-none transition-colors"
              placeholder="admin@tajiree.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-tajiree-gray">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-tajiree-black border border-gray-700 focus:border-tajiree-teal focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tajiree-teal hover:bg-teal-600 text-white font-bold py-3 rounded transition-all duration-300 transform hover:scale-[1.02]"
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}