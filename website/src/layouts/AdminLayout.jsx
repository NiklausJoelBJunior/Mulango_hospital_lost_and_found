import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  ShieldCheckIcon, 
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (!token || !userData) {
      navigate('/login')
      return
    }

    setAdmin(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  if (!admin) return null

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Squares2X2Icon },
    { name: 'Registry', href: '/items', icon: ClipboardDocumentListIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2">
                <ShieldCheckIcon className="w-8 h-8 text-mlaf" />
                <span className="font-black text-xl tracking-tight text-gray-900 leading-none">MLAF <span className="text-mlaf">Admin</span></span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-gray-900">{admin.username}</span>
                <span className="text-[10px] font-black text-mlaf uppercase tracking-widest">System Administrator</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                title="Sign out"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <Outlet context={{ admin }} />
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400 font-medium">© {new Date().getFullYear()} Mulango Hospital Secure Administrative Portal</p>
        </div>
      </footer>
    </div>
  )
}
