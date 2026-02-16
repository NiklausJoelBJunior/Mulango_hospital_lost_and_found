import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  UserIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login failed')

      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.admin))
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-mlaf/10 mb-6 transition-transform hover:scale-105">
            <ShieldCheckIcon className="w-12 h-12 text-mlaf" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Portal</h2>
          <p className="text-gray-500 font-medium">Secure access for hospital staff</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-mlaf/5 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake">
                <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-mlaf transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-mlaf/20 focus:bg-white transition-all outline-none"
                  placeholder="Enter administrator ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-mlaf transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-mlaf/20 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mlaf text-white py-4 rounded-2xl font-black shadow-lg shadow-mlaf/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:pointer-events-none group"
            >
              <span className="tracking-tight">{loading ? 'Verifying Identity...' : 'Access Dashboard'}</span>
              {!loading && <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <ShieldCheckIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">TLS 1.3 Encryption Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
