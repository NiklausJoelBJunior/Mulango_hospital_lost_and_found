import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import logo from '../assets/logo.png'

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isItemsPage = location.pathname === '/items'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Removed automatic mobile redirect to allow access to the landing page

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className={`bg-mlaf sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg py-2' : 'py-3'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img src={logo} alt="MLAF" className="w-10 h-10 object-contain" />
            <h1 className="text-xl text-white font-bold tracking-tight hidden md:block">MLAF</h1>
          </Link>

          {/* Mobile Search for Items Page */}
          {isItemsPage && (
            <div className="flex-1 max-w-[280px]  sm:max-w-xs mx-1 md:hidden">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/20 h-[35px] border-none rounded-full py-1.5 pl-8 pr-3 text-white text-xs placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:bg-white/30 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Mobile Actions (Filter + Download + Hamburger) */}
          <div className="flex items-center gap-1 md:hidden">
            {isItemsPage && (
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`p-2 rounded-full transition-colors ${showMobileFilters ? 'bg-white text-mlaf' : 'text-white hover:bg-white/10'}`}
                title="Filters"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            )}

            <div className="relative">
              <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                title="Download App"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 z-[70] border border-gray-100 overflow-hidden">
                  <a 
                    href="https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found/releases/latest/download/mlaf.apk"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-900 transition-colors border-b border-gray-50"
                  >
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <i className="fab fa-android text-lg text-green-600"></i>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Android</div>
                      <div className="text-sm font-semibold">Get APK File</div>
                    </div>
                  </a>
                  <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('iOS App coming soon to App Store!') }}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className="fab fa-apple text-lg text-gray-600"></i>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Apple</div>
                      <div className="text-sm font-semibold">iOS Version</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <button 
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'}`}>Home</Link>
            <Link to="/items" className={`text-sm font-semibold transition-colors ${location.pathname === '/items' ? 'text-white' : 'text-white/70 hover:text-white'}`}>Registry</Link>
            

            <Link 
              to="/items"
              className="px-5 py-2.5 bg-white text-mlaf rounded-xl text-sm font-bold hover:bg-gray-100 transition-all shadow-md active:scale-95"
            >
              Report Found
            </Link>
          </nav>

        </div>

        {/* Mobile Sidebar Menu with Slide Transition */}
        <Transition
          show={isMenuOpen}
          as={React.Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="md:hidden fixed inset-0 top-[60px] bg-white z-[60] overflow-y-auto">
            <nav className="flex flex-col p-6 space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all active:scale-95 ${location.pathname === '/' ? 'bg-mlaf/10 text-mlaf' : 'bg-gray-50 text-gray-900 font-bold'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.pathname === '/' ? 'bg-mlaf text-white' : 'bg-mlaf/10 text-mlaf'}`}>
                  <HomeIcon className="w-6 h-6" />
                </div>
                <span>Home Landing</span>
              </Link>
              <Link 
                to="/items" 
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all active:scale-95 ${location.pathname === '/items' ? 'bg-mlaf/10 text-mlaf' : 'bg-gray-50 text-gray-900 font-bold'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.pathname === '/items' ? 'bg-mlaf text-white' : 'bg-mlaf/10 text-mlaf'}`}>
                  <ClipboardDocumentListIcon className="w-6 h-6" />
                </div>
                <span>Lost & Found Registry</span>
              </Link>
              <Link 
                to="/about" 
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all active:scale-95 ${location.pathname === '/about' ? 'bg-mlaf/10 text-mlaf' : 'bg-gray-50 text-gray-900 font-bold'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.pathname === '/about' ? 'bg-mlaf text-white' : 'bg-mlaf/10 text-mlaf'}`}>
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <span>About System</span>
              </Link>
              
              <div className="pt-8 space-y-4 border-t border-gray-100">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Official Application</p>
                <div className="space-y-3 pb-6">
                  <a 
                    href="https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found/releases/latest/download/mlaf.apk"
                    className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4 rounded-xl shadow-lg transition-transform active:scale-95 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <i className="fab fa-android text-2xl text-green-400"></i>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] opacity-70 uppercase tracking-wider">Direct Download for</div>
                        <div className="text-lg font-bold">Android (APK)</div>
                      </div>
                    </div>
                    <ArrowDownTrayIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('iOS App coming soon to App Store!') }}
                    className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4 rounded-xl shadow-lg transition-transform active:scale-95 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <i className="fab fa-apple text-2xl"></i>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] opacity-70 uppercase tracking-wider">Download for</div>
                        <div className="text-lg font-bold">Apple (iOS)</div>
                      </div>
                    </div>
                    <ArrowDownTrayIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </Transition>
      </header>

      <main className="flex-1 relative">
                <Outlet context={{ searchQuery, setSearchQuery, showMobileFilters, setShowMobileFilters, isMobile }} />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <img src={logo} alt="MLAF logo" className="w-6 h-6 object-contain" />
                <span className="font-black text-gray-900 tracking-tight">MLAF</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">Mulango Hospital's secure item recovery and tracking system.</p>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} <Link to="/login" className="hover:text-mlaf transition-colors">Mulango Hospital</Link>. Built with Care.</p>
            <div className="flex space-x-8">
              <Link to="/about#faq" className="text-xs font-bold text-gray-400 hover:text-mlaf uppercase tracking-widest transition-colors">FAQ</Link>
              <Link to="/about#privacy" className="text-xs font-bold text-gray-400 hover:text-mlaf uppercase tracking-widest transition-colors">Privacy</Link>
              <Link to="/about#support" className="text-xs font-bold text-gray-400 hover:text-mlaf uppercase tracking-widest transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
