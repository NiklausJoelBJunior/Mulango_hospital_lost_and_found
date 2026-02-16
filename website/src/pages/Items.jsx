import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { 
  PlusIcon,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid'
import { useOutletContext } from 'react-router-dom'
import logo from '../assets/logo.png'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const CATEGORIES = [
  'Electronics', 'Personal Items', 'Accessories', 'Documents', 
  'Clothing', 'Medical', 'Jewelry', 'Other'
]

const LOCATIONS = [
  'Emergency Room', 'Waiting Area', 'Pharmacy', 'Parking Lot', 
  'Cafeteria', 'Administration', 'ICU', 'Radiology', 'Laboratory', 
  'Main Lobby', 'Other'
]

function isValidContact(value) {
  if (!value) return false
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return phoneRegex.test(value.replace(/\s/g, '')) || emailRegex.test(value)
}

export default function Items() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [form, setForm] = useState({ 
    itemName: '', description: '', location: '', yourName: '', 
    contact: '', category: '', imageFile: null, imagePreview: null 
  })
  const [errors, setErrors] = useState({})
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [claiming, setClaiming] = useState(null)
  const [claimer, setClaimer] = useState({ name: '', contact: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fullImage, setFullImage] = useState(null)
  const fileRef = useRef(null)
  const videoRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState(null)
  
  // Get context from MainLayout (might be null if testing in isolation)
  const context = useOutletContext() || {}
  const { searchQuery, setSearchQuery, showMobileFilters, isMobile: contextIsMobile } = context
  
  const isMobile = contextIsMobile !== undefined 
    ? contextIsMobile 
    : (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

  useEffect(() => {
    fetchItems()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/items`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch items:', err)
    } finally {
      setLoading(false)
    }
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  async function handleFile(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    
    if (f.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    updateField('imageFile', f)
    
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    const reader = new FileReader()
    reader.onload = () => {
      updateField('imagePreview', reader.result)
      clearInterval(interval)
      setUploadProgress(100)
    }
    reader.readAsDataURL(f)
  }

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      setShowCamera(true)
    } catch (err) {
      alert('Could not access camera: ' + err.message)
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !stream) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      updateField('imageFile', file)
      
      const reader = new FileReader()
      reader.onload = () => updateField('imagePreview', reader.result)
      reader.readAsDataURL(file)
    }, 'image/jpeg', 0.8)

    stopCamera()
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  function validateForm() {
    const newErrors = {}
    if (!form.yourName?.trim()) newErrors.yourName = 'Your name is required'
    if (!form.contact?.trim() || !isValidContact(form.contact)) {
      newErrors.contact = 'Valid phone or email required'
    }
    if (!form.itemName?.trim()) newErrors.itemName = 'Item name is required'
    if (!form.category) newErrors.category = 'Please select a category'
    if (!form.location) newErrors.location = 'Please select a location'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePost(e) {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('itemName', form.itemName)
      formData.append('category', form.category)
      formData.append('location', form.location)
      formData.append('description', form.description)
      formData.append('yourName', form.yourName)
      formData.append('contact', form.contact)
      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Failed to post item')

      const newItem = await res.json()
      setItems(prev => [newItem, ...prev])
      resetForm()
      setShowPostModal(false)
      
      // Show success toast
      alert('Item posted successfully! Please hand the physical item to hospital reception for verification.')
    } catch (err) {
      alert('Error posting item: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setForm({ 
      itemName: '', description: '', location: '', yourName: '', 
      contact: '', category: '', imageFile: null, imagePreview: null 
    })
    if (fileRef.current) fileRef.current.value = ''
    setErrors({})
    setUploadProgress(0)
  }

  function handleStartClaim(item) {
    setClaiming(item)
    setClaimer({ name: '', contact: '' })
  }

  async function handleConfirmClaim() {
    if (!claimer.name || !claimer.contact) {
      alert('Please provide your name and contact before claiming.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/items/${claiming._id}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: claimer.name,
          contact: claimer.contact,
          note: 'Claim from website'
        })
      })

      if (!res.ok) throw new Error('Failed to submit claim')

      setItems(prev => prev.map(it => 
        it._id === claiming._id ? { ...it, status: 'claimed' } : it
      ))
      setClaiming(null)
      alert('Claim registered. Please bring valid ID to reception during support hours to collect the item.')
    } catch (err) {
      alert('Error claiming item: ' + err.message)
    }
  }

  const filtered = items.filter(it => it.status === 'approved')
    .filter(it => selectedCategory === 'All Categories' || selectedCategory === 'All' || it.category === selectedCategory)
    .filter(it => {
      // Use searchQuery from context on mobile/navbar, fallback to local query
      const effectiveSearch = (isMobile && searchQuery !== undefined) ? searchQuery : query
      const q = (effectiveSearch || '').toLowerCase().trim()
      
      return !q || 
        it.name?.toLowerCase().includes(q) || 
        it.description?.toLowerCase().includes(q) || 
        it.location?.toLowerCase().includes(q) ||
        it.category?.toLowerCase().includes(q)
    })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'location') return (a.location || '').localeCompare(b.location || '')
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '')
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Items Registry</h1>
            <p className="text-sm text-gray-500">Search and claim lost property</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="hidden sm:flex bg-gradient-to-r from-mlaf to-mlaf-light text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 items-center space-x-2"
          >
            <span>Report Found Item</span>
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Professional App Download Encouragement for Mobile */}
        {isMobile && (
          <div className="mb-6 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <img src={logo} alt="" className="w-32 h-32 rotate-12 brightness-0 invert" />
            </div>
            <div className="relative z-10">
              <div className="mb-5">
                <h3 className="text-xl font-bold mb-1">Get the Official MLAF App</h3>
                <p className="text-cyan-50 text-sm max-w-sm opacity-90">Experience faster reporting, real-time push notifications, and offline access.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found/releases/latest/download/mlaf.apk"
                  className="flex items-center justify-between bg-white text-cyan-700 px-5 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg group/btn"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <i className="fab fa-android text-xl text-green-600"></i>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                      <div className="text-base">Android (APK)</div>
                    </div>
                  </div>
                  <ArrowDownTrayIcon className="w-5 h-5 opacity-40 group-hover/btn:translate-y-1 transition-transform" />
                </a>

                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('iOS App coming soon to App Store!') }}
                  className="flex items-center justify-between bg-white text-cyan-700 px-5 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg group/btn"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className="fab fa-apple text-xl text-gray-600"></i>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                      <div className="text-base">Apple (iOS)</div>
                    </div>
                  </div>
                  <ArrowDownTrayIcon className="w-5 h-5 opacity-40 group-hover/btn:translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search - Desktop Version (Visible only on PC) */}
        <div className="mb-6 space-y-4">
          <div className="hidden md:flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search registry (e.g. 'black phone', 'emergency room', 'itertools')..."
                value={isMobile ? (searchQuery || '') : query}
                onChange={(e) => isMobile && setSearchQuery ? setSearchQuery(e.target.value) : setQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className={`
            ${(showMobileFilters || showFilters) ? 'block' : 'hidden md:block'} 
            ${isMobile ? 'sticky top-[60px] z-30 bg-gray-50/95 backdrop-blur-sm -mx-4 px-4 py-2 border-b border-gray-200 shadow-sm' : ''}
          `}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none"
              >
                <option>All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>

              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['recent', 'location', 'category'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                        sortBy === sort 
                          ? 'bg-white text-mlaf shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ArrowPathIcon className="w-12 h-12 text-mlaf animate-spin mb-4" />
            <p className="text-gray-500">Loading items...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <InformationCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map(item => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-mlaf/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-600 shadow-sm">
                      {item.location}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Found: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartClaim(item)
                      }}
                      className="px-4 py-1.5 bg-mlaf text-white rounded-lg text-sm font-medium hover:bg-mlaf-light transition-colors shadow-sm hover:shadow"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Item Modal */}
      <Transition appear show={showPostModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowPostModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mlaf to-mlaf-light" />
                    <button
                      onClick={() => {
                        setShowPostModal(false)
                        resetForm()
                        stopCamera()
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>

                    <div className="p-6">
                      <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
                        Report Found Item
                      </Dialog.Title>
                      <p className="text-gray-600 mb-6">
                        Fill in the details below and hand the physical item to reception for verification.
                      </p>

                      <form onSubmit={handlePost} className="space-y-6">
                        {/* Camera/Photo Upload Section */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Item Photo
                          </label>
                          
                          {showCamera ? (
                            <div className="relative">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-xl border-2 border-dashed border-gray-300"
                              />
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={capturePhoto}
                                  className="px-4 py-2 bg-mlaf text-white rounded-lg font-medium hover:bg-mlaf-light transition-colors shadow-lg"
                                >
                                  Capture
                                </button>
                                <button
                                  type="button"
                                  onClick={stopCamera}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-lg"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                              {form.imagePreview ? (
                                <div className="relative w-full sm:w-48">
                                  <img
                                    src={form.imagePreview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg border-2 border-mlaf/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateField('imageFile', null)
                                      updateField('imagePreview', null)
                                      if (fileRef.current) fileRef.current.value = ''
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                  {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                      <div 
                                        className="h-full bg-mlaf transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-mlaf hover:bg-mlaf/5 transition-colors"
                                  >
                                    <PhotoIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Upload Photo</span>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={startCamera}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-mlaf hover:bg-mlaf/5 transition-colors"
                                  >
                                    <CameraIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Take Photo</span>
                                  </button>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileRef}
                                onChange={handleFile}
                                capture="environment"
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Your Name *
                            </label>
                            <input
                              value={form.yourName}
                              onChange={e => updateField('yourName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all ${
                                errors.yourName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            />
                            {errors.yourName && (
                              <p className="mt-1 text-xs text-red-600">{errors.yourName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contact *
                            </label>
                            <input
                              value={form.contact}
                              onChange={e => updateField('contact', e.target.value)}
                              placeholder="Phone or email"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all ${
                                errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            />
                            {errors.contact && (
                              <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Item Name *
                            </label>
                            <input
                              value={form.itemName}
                              onChange={e => updateField('itemName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all ${
                                errors.itemName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            />
                            {errors.itemName && (
                              <p className="mt-1 text-xs text-red-600">{errors.itemName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <select
                              value={form.category}
                              onChange={e => updateField('category', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all ${
                                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            >
                              <option value="">Select category</option>
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            {errors.category && (
                              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location *
                            </label>
                            <select
                              value={form.location}
                              onChange={e => updateField('location', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all ${
                                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            >
                              <option value="">Select location</option>
                              {LOCATIONS.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                              ))}
                            </select>
                            {errors.location && (
                              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={form.description}
                              onChange={e => updateField('description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all"
                              placeholder="Provide any additional details about the item..."
                            />
                          </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <div className="flex gap-3">
                            <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <p className="text-sm text-blue-700">
                              Items are reviewed by reception and verified before being listed for collection. 
                              Please keep your contact details available for follow-up.
                            </p>
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPostModal(false)
                              resetForm()
                              stopCamera()
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-gradient-to-r from-mlaf to-mlaf-light text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                          >
                            {submitting ? (
                              <>
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <span>Submit Item</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Item Details Modal */}
      <Transition appear show={!!selectedItem} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedItem(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                  {selectedItem && (
                    <>
                      <div className="relative">
                        <div className="aspect-video bg-gray-100">
                          {selectedItem.image ? (
                            <img
                              src={selectedItem.image}
                              alt={selectedItem.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PhotoIcon className="w-16 h-16 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                        >
                          <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
                            {selectedItem.category}
                          </span>
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
                            {selectedItem.location}
                          </span>
                        </div>
                        {selectedItem.image && (
                          <button
                            onClick={() => setFullImage(selectedItem.image)}
                            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg flex items-center gap-1 text-xs font-semibold text-gray-700"
                            title="View full image"
                          >
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                            <span>Expand</span>
                          </button>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-1">
                              {selectedItem.name}
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                              Found on {new Date(selectedItem.createdAt).toLocaleDateString()} at{' '}
                              {new Date(selectedItem.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="prose max-w-none mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                          <p className="text-gray-700">
                            {selectedItem.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(
                                  `${selectedItem.name} - Found at ${selectedItem.location}. Details: ${selectedItem.description}`
                                )
                                alert('Item details copied to clipboard')
                              }}
                              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                              <ClipboardIcon className="w-4 h-4" />
                              Copy Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(null)
                                handleStartClaim(selectedItem)
                              }}
                              className="px-6 py-2 bg-gradient-to-r from-mlaf to-mlaf-light text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                              Claim This Item
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Claim Modal */}
      <Transition appear show={!!claiming} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setClaiming(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                  <div className="p-6">
                    <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                      Claim Item: {claiming?.name}
                    </Dialog.Title>
                    
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                      <div className="flex gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-700">
                          Please provide your details. Reception will verify your identity when you collect the item.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          value={claimer.name}
                          onChange={e => setClaimer(s => ({ ...s, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Details *
                        </label>
                        <input
                          value={claimer.contact}
                          onChange={e => setClaimer(s => ({ ...s, contact: e.target.value }))}
                          placeholder="Phone number or email"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mlaf/20 focus:border-mlaf outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <button
                        onClick={() => setClaiming(null)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmClaim}
                        className="px-6 py-2 bg-gradient-to-r from-mlaf to-mlaf-light text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Submit Claim
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Full Image Preview Modal */}
      <Transition appear show={!!fullImage} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => setFullImage(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-5xl w-full flex flex-col items-center">
                  <div className="w-full flex justify-end mb-4">
                    <button
                      onClick={() => setFullImage(null)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                    >
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <img
                    src={fullImage}
                    alt="Full preview"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Floating Action Button (FAB) for Mobile Posting */}{isMobile && (
      <button
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-mlaf text-white rounded-full shadow-2xl flex items-center justify-center sm:hidden z-40 transition-transform active:scale-90 hover:scale-110"
        title="Report Found Item"
      >
        <PlusIcon className="w-8 h-8" />
      </button>)}
    </div>
  )
}