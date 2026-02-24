import React, { useEffect, useState } from 'react'
import { 
  Squares2X2Icon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
  FunnelIcon,
  UserGroupIcon,
  EyeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  CameraIcon,
  NoSymbolIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../assets/logo.png'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const CATEGORIES = [
  'Electronics', 'Personal Items', 'Accessories', 'Documents', 
  'Clothing', 'Medical', 'Jewelry', 'Other'
]

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: ClockIcon,
    gradient: 'from-amber-500 to-amber-600'
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircleIcon,
    gradient: 'from-green-500 to-green-600'
  },
  claimed: {
    label: 'Claimed',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: UserGroupIcon,
    gradient: 'from-blue-500 to-blue-600'
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircleIcon,
    gradient: 'from-red-500 to-red-600'
  }
}

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, itemId: null, action: null })
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [lostReports, setLostReports] = useState([])
  const [showReportLostModal, setShowReportLostModal] = useState(false)
  const [reportLostData, setReportLostData] = useState({
    reporterName: '', reporterContact: '', itemName: '', category: '',
    description: '', color: '', brand: '', location: '', dateLost: '',
    distinguishingFeatures: ''
  })
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportMatches, setReportMatches] = useState([])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    fetchLostReports()
  }, [])

  const fetchLostReports = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/lost-reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setLostReports(data)
      }
    } catch (err) {
      console.error('Failed to fetch lost reports:', err)
    }
  }

  const handleDeleteLostReport = async (reportId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/lost-reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete report')
      setLostReports(prev => prev.filter(r => r._id !== reportId))
      setSelectedReport(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/lost-reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update report')
      const updated = await res.json()
      setLostReports(prev => prev.map(r => r._id === reportId ? updated : r))
      if (selectedReport?._id === reportId) setSelectedReport(updated)
    } catch (err) {
      alert(err.message)
    }
  }

  const fetchReportMatches = async (reportId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/lost-reports/${reportId}/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReportMatches(data)
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err)
    }
  }

  const handleReportLost = async (e) => {
    e.preventDefault()
    if (!reportLostData.reporterName || !reportLostData.reporterContact || !reportLostData.itemName) {
      alert('Please provide name, contact, and item name.')
      return
    }
    try {
      setReportSubmitting(true)
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/lost-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportLostData)
      })
      if (!res.ok) throw new Error('Failed to submit report')
      setShowReportLostModal(false)
      setReportLostData({
        reporterName: '', reporterContact: '', itemName: '', category: '',
        description: '', color: '', brand: '', location: '', dateLost: '',
        distinguishingFeatures: ''
      })
      fetchLostReports()
      alert('Lost item report submitted successfully!')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setReportSubmitting(false)
    }
  }

  const handleAction = async (itemId, status, note = '', extraData = {}) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, note, ...extraData })
      })
      
      if (!res.ok) throw new Error('Failed to update item')
      
      const updatedItem = await res.json()
      setItems(prev => prev.map(it => it._id === itemId ? updatedItem : it))
      if (selectedItem?._id === itemId) setSelectedItem(updatedItem)
      setConfirmDialog({ show: false, itemId: null, action: null })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!res.ok) throw new Error('Failed to delete item')
      
      setItems(prev => prev.filter(it => it._id !== itemId))
      setSelectedItem(null)
      setConfirmDialog({ show: false, itemId: null, action: null })
    } catch (err) {
      alert(err.message)
    }
  }

  const exportData = () => {
    const doc = new jsPDF()
    const pageCount = doc.internal.getNumberOfPages()
    
    // Header Branding
    doc.setFillColor(0, 157, 181)
    doc.rect(0, 0, 210, 40, 'F')
    
    // Add Logo (White version or just on white background if possible)
    // For now, on the teal background
    doc.addImage(logo, 'PNG', 10, 5, 30, 30)
    
    doc.setFontSize(24)
    doc.setTextColor(255)
    doc.setFont('helvetica', 'bold')
    doc.text('Mulango Hospital', 45, 20)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Lost and Found Official Registry Export', 45, 28)
    
    // Summary Box
    doc.setDrawColor(230)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(10, 45, 190, 25, 3, 3, 'FD')
    
    doc.setTextColor(100)
    doc.setFontSize(10)
    doc.text('Date Generated:', 15, 53)
    doc.setTextColor(0)
    doc.text(new Date().toLocaleString(), 45, 53)
    
    doc.setTextColor(100)
    doc.text('Total Records:', 15, 60)
    doc.setTextColor(0)
    doc.text(filteredItems.length.toString(), 45, 60)
    
    doc.setTextColor(100)
    doc.text('Export View:', 15, 67)
    doc.setTextColor(0)
    doc.text(activeTab.toUpperCase(), 45, 67)
    
    const tableData = filteredItems.map(item => [
      item.name,
      item.category,
      item.location,
      { content: item.status?.toUpperCase(), styles: { fontStyle: 'bold', textColor: item.status === 'pending' ? [217, 119, 6] : [22, 163, 74] } },
      new Date(item.createdAt).toLocaleDateString()
    ])
    
    autoTable(doc, {
      startY: 75,
      head: [['Item Name', 'Category', 'Location', 'Status', 'Date Reported']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 157, 181], fontSize: 11, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { top: 40, bottom: 20 },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(9)
        doc.setTextColor(150)
        doc.text(`Mulango Hospital Lost & Found - Page ${data.pageNumber}`, 105, 287, { align: 'center' })
        doc.text('Confidential Administrative Document', 105, 292, { align: 'center' })
      }
    })
    
    doc.save(`MLAF-Full-Registry-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handlePrintItem = (item) => {
    const doc = new jsPDF()
    
    // Professional Header
    doc.setFillColor(0, 157, 181)
    doc.rect(0, 0, 210, 50, 'F')
    
    doc.addImage(logo, 'PNG', 10, 5, 40, 40)
    
    doc.setFontSize(22)
    doc.setTextColor(255)
    doc.setFont('helvetica', 'bold')
    doc.text('ITEM CASE REPORT', 55, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('MULANGO HOSPITAL LOST & FOUND SERVICE', 55, 28)
    doc.text(`CASE #${item._id.substring(item._id.length - 8).toUpperCase()}`, 55, 35)
    
    // Section 1: Item Overview
    doc.setTextColor(0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('1. Item Information', 15, 65)
    
    const itemInfo = [
      ['Property Name', item.name],
      ['Category', item.category],
      ['Found Location', item.location],
      ['Date Reported', new Date(item.createdAt).toLocaleString()],
      ['Current Status', item.status?.toUpperCase()],
      ['Description', item.description || 'No description provided']
    ]
    
    autoTable(doc, {
      startY: 70,
      body: itemInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', textColor: [100], width: 40 } }
    })
    
    // Section 2: Reporter Details
    let currentY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('2. Reporter Details', 15, currentY)
    
    const reporterInfo = [
      ['Reporter Name', item.reporterName || 'Anonymous'],
      ['Reporter Contact', item.reporterContact || 'N/A']
    ]
    
    autoTable(doc, {
      startY: currentY + 5,
      body: reporterInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', textColor: [100], width: 40 } }
    })
    
    // Section 3: Claims History
    currentY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('3. Ownership Claims History', 15, currentY)
    
    if (item.claims?.length > 0) {
      const claimsData = item.claims.map(claim => [
        claim.name,
        claim.contact,
        new Date(claim.timestamp).toLocaleDateString(),
        claim.note || 'N/A'
      ])
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Claimant Name', 'Contact', 'Date', 'Notes']],
        body: claimsData,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
        styles: { fontSize: 9 }
      })
    } else {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(150)
      doc.text('No claims have been submitted for this item yet.', 15, currentY + 10)
      doc.setTextColor(0)
    }
    
    // Section 4: Handover Details (if claimed)
    if (item.status === 'claimed') {
      currentY = (doc.lastAutoTable?.finalY || currentY + 15) + 15
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('4. Handover Confirmation', 15, currentY)
      
      doc.setFillColor(240, 253, 244)
      doc.rect(10, currentY + 5, 190, 30, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(21, 128, 61)
      doc.text(`Handed over to: ${item.claimedBy}`, 15, currentY + 15)
      doc.text(`Contact Detail: ${item.claimedContact}`, 15, currentY + 22)
      doc.text(`Date of Release: ${new Date(item.claimedAt).toLocaleString()}`, 15, currentY + 29)
    }
    
    // Footer
    const lastY = doc.lastAutoTable?.finalY || currentY
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('This is an official hospital document. Any unauthorized modification is prohibited.', 105, 285, { align: 'center' })
    doc.text(`Printed by MLAF System on ${new Date().toLocaleString()}`, 105, 290, { align: 'center' })
    
    doc.save(`MLAF-Report-${item.name.replace(/\s+/g, '-')}.pdf`)
  }

  const handleCopyDetails = (item) => {
    const text = `
MLAF ITEM REPORT
----------------
Name: ${item.name}
Category: ${item.category}
Location: ${item.location}
Status: ${item.status?.toUpperCase()}
Description: ${item.description || 'N/A'}
Reported on: ${new Date(item.createdAt).toLocaleString()}
Reporter: ${item.reporterName || 'Anonymous'} (${item.reporterContact || 'N/A'})
${item.status === 'claimed' ? `Claimed by: ${item.claimedBy} (${item.claimedContact}) on ${new Date(item.claimedAt).toLocaleString()}` : ''}
    `.trim()
    
    navigator.clipboard.writeText(text)
    alert('Item details copied to clipboard!')
  }

  const stats = [
    { 
      name: 'Pending Review', 
      value: items.filter(i => i.status === 'pending').length, 
      color: 'text-amber-600', 
      bg: 'bg-amber-100', 
      icon: ClockIcon,
      gradient: 'from-amber-500 to-amber-600'
    },
    { 
      name: 'Active Claims', 
      value: items.filter(i => i.status === 'approved' && i.claims?.length > 0).length, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      icon: UserGroupIcon,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Public Registry', 
      value: items.filter(i => i.status === 'approved').length, 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      name: 'Total Archive', 
      value: items.length, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100', 
      icon: ArchiveBoxIcon,
      gradient: 'from-gray-500 to-gray-600'
    },
    { 
      name: 'Lost Reports', 
      value: lostReports.length, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100', 
      icon: ExclamationTriangleIcon,
      gradient: 'from-orange-500 to-orange-600'
    },
  ]

  const filteredItems = items
    .filter(item => {
      if (activeTab === 'pending') return item.status === 'pending'
      if (activeTab === 'claims') return item.status === 'approved' && item.claims?.length > 0
      if (activeTab === 'archive') return true
      return true
    })
    .filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reporterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reporterContact?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory
      
      let matchesDate = true
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.createdAt)
        const start = new Date(dateRange.start)
        const end = new Date(dateRange.end)
        matchesDate = itemDate >= start && itemDate <= end
      }
      
      return matchesSearch && matchesCategory && matchesDate
    })

  const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    System Overview & Management
                  </p>
                </div>
              </div>
            </div>
            
            {/* Export & Report Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReportLostModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm font-semibold text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all shadow-sm"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Report Lost Item
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl md:rounded-3xl transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                
                <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {stat.name}
                </p>
                
                <p className={`text-2xl md:text-3xl font-black ${stat.color} tracking-tight`}>
                  {stat.value}
                </p>
                
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full">
                    {index === 0 ? 'Urgent' : index === 3 ? 'Total' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Items List */}
          <div className="lg:col-span-2 space-y-5 md:space-y-6 lg:sticky lg:top-8 lg:h-[calc(100vh-100px)] lg:overflow-y-auto pr-2 custom-scrollbar">
            {/* Tabs & Filters */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Tabs */}
                <div className="flex p-1 bg-gray-50 rounded-xl flex-1">
                  {[
                    { id: 'pending', label: 'Pending', icon: ClockIcon },
                    { id: 'claims', label: 'Claims', icon: UserGroupIcon },
                    { id: 'lost-reports', label: 'Lost Reports', icon: ExclamationTriangleIcon },
                    { id: 'archive', label: 'Archive', icon: ArchiveBoxIcon }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white text-cyan-600 shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    showFilters 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                      >
                        <option>All Categories</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Date Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                        />
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {(selectedCategory !== 'All Categories' || dateRange.start || dateRange.end) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('All Categories')
                        setDateRange({ start: '', end: '' })
                      }}
                      className="mt-3 text-xs font-bold text-cyan-600 hover:text-cyan-700 uppercase tracking-wider"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by item name, description, location, reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 shadow-lg focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Items / Lost Reports List */}
            <div className="space-y-3 md:space-y-4">
              {activeTab === 'lost-reports' ? (
                /* Lost Reports List */
                lostReports.length === 0 ? (
                  <div className="bg-white rounded-2xl md:rounded-3xl py-16 md:py-20 text-center border-2 border-dashed border-gray-200 shadow-lg">
                    <ExclamationTriangleIcon className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">
                      No lost item reports
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reports will appear here when users report lost items
                    </p>
                    <button
                      onClick={() => setShowReportLostModal(true)}
                      className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-200 transition-all"
                    >
                      + Add Report
                    </button>
                  </div>
                ) : (
                  lostReports.map(report => (
                    <div
                      key={report._id}
                      onClick={() => {
                        setSelectedReport(report)
                        setSelectedItem(null)
                        fetchReportMatches(report._id)
                        if (window.innerWidth < 1024) setIsDetailModalOpen(true)
                      }}
                      className={`group bg-white rounded-xl md:rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                        selectedReport?._id === report._id
                          ? 'border-orange-500 shadow-2xl shadow-orange-500/20'
                          : 'border-gray-100 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5'
                      }`}
                    >
                      <div className="flex gap-3 md:gap-4">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-orange-50 shrink-0 border border-orange-100 flex items-center justify-center">
                          <ExclamationTriangleIcon className="w-8 h-8 text-orange-400" />
                          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            report.status === 'open' ? 'bg-orange-500 animate-pulse' :
                            report.status === 'matched' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              report.status === 'open' ? 'text-orange-600 bg-orange-50' :
                              report.status === 'matched' ? 'text-blue-600 bg-blue-50' :
                              'text-green-600 bg-green-50'
                            }`}>
                              {report.status}
                            </span>
                            {report.category && (
                              <span className="text-[10px] md:text-xs text-gray-400">{report.category}</span>
                            )}
                          </div>
                          
                          <h3 className="text-base md:text-lg font-black text-gray-900 truncate tracking-tight mb-1">
                            {report.itemName}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5" />
                              {report.reporterName}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {report.matchPercentage > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <DocumentMagnifyingGlassIcon className="w-3.5 h-3.5 text-blue-500" />
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                report.matchPercentage >= 70 ? 'text-green-700 bg-green-100' :
                                report.matchPercentage >= 40 ? 'text-yellow-700 bg-yellow-100' :
                                'text-gray-600 bg-gray-100'
                              }`}>
                                {report.matchPercentage}% match found
                              </span>
                            </div>
                          )}
                        </div>

                        <ChevronRightIcon className={`w-5 h-5 self-center text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ${
                          selectedReport?._id === report._id ? 'text-orange-500 translate-x-1' : ''
                        }`} />
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* Regular Items List */
                loading ? (
                <div className="bg-white rounded-2xl md:rounded-3xl py-16 md:py-20 text-center shadow-lg border border-gray-100">
                  <ArrowPathIcon className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">
                    Loading Records...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 rounded-2xl md:rounded-3xl py-12 text-center border-2 border-red-100">
                  <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 font-bold mb-2">Error Loading Data</p>
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl md:rounded-3xl py-16 md:py-20 text-center border-2 border-dashed border-gray-200 shadow-lg">
                  <ArchiveBoxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">
                    No records found
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredItems.map(item => {
                  const status = getStatusConfig(item.status)
                  const bestClaimMatch = item.claims?.length > 0 
                    ? Math.max(...item.claims.map(c => c.matchPercentage || 0)) 
                    : 0
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedItem(item)
                        setSelectedReport(null)
                        if (window.innerWidth < 1024) setIsDetailModalOpen(true)
                      }}
                      className={`group bg-white rounded-xl md:rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                        selectedItem?._id === item._id
                          ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20'
                          : 'border-gray-100 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/5'
                      }`}
                    >
                      <div className="flex gap-3 md:gap-4">
                        {/* Image */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CameraIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            item.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                            item.status === 'approved' ? 'bg-green-500' :
                            item.status === 'claimed' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] md:text-xs font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="text-base md:text-lg font-black text-gray-900 truncate tracking-tight mb-1">
                            {item.name}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          
                          {item.claims?.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <UserGroupIcon className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-[10px] font-bold text-blue-600">
                                {item.claims.length} claim{item.claims.length > 1 ? 's' : ''}
                              </span>
                              {bestClaimMatch > 0 && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  bestClaimMatch >= 70 ? 'text-green-700 bg-green-100' :
                                  bestClaimMatch >= 40 ? 'text-yellow-700 bg-yellow-100' :
                                  'text-gray-600 bg-gray-100'
                                }`}>
                                  {bestClaimMatch}% match
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <ChevronRightIcon className={`w-5 h-5 self-center text-gray-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all ${
                          selectedItem?._id === item._id ? 'text-cyan-500 translate-x-1' : ''
                        }`} />
                      </div>
                    </div>
                  )
                })
              ))}
            </div>
          </div>

          {/* Right Column - Detail Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 overflow-y-auto max-h-[calc(100vh-100px)]">
              {selectedItem ? (
                <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in slide-in-from-right duration-300">
                  {/* Item Detail Content */}
                  <div className="relative h-48 md:h-56 group">
                    {selectedItem.image ? (
                      <img
                        src={selectedItem.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <CameraIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg bg-gradient-to-r ${
                        getStatusConfig(selectedItem.status).gradient
                      } text-white`}>
                        {selectedItem.status}
                      </div>
                    </div>
                    
                    {/* Quick Actions Menu */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={() => handleCopyDetails(selectedItem)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all shadow-lg"
                        title="Copy details"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handlePrintItem(selectedItem)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all shadow-lg"
                        title="Print"
                      >
                        <PrinterIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    {/* Title & Description */}
                    <div className="mb-5">
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-2">
                        {selectedItem.name}
                      </h2>
                      
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                        <p className="text-xs md:text-sm text-gray-600">
                          {selectedItem.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Category
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {selectedItem.category}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Location
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {selectedItem.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reporter Information */}
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Reporter Details
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Name</p>
                            <p className="text-sm font-bold text-gray-900">
                              {selectedItem.reporterName || 'Anonymous'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                            {selectedItem.reporterContact?.includes('@') ? (
                              <EnvelopeIcon className="w-4 h-4 text-cyan-600" />
                            ) : (
                              <PhoneIcon className="w-4 h-4 text-cyan-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {selectedItem.reporterContact || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Timeline
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ClockIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Reported</p>
                            <p className="text-xs font-bold text-gray-900">
                              {new Date(selectedItem.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {selectedItem.claimedAt && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                            <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                              <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-blue-500 uppercase">Claimed</p>
                              <p className="text-xs font-bold text-blue-700">
                                {new Date(selectedItem.claimedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {selectedItem.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setConfirmDialog({
                              show: true,
                              itemId: selectedItem._id,
                              action: 'approve'
                            })}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/30"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                          
                          <button
                            onClick={() => setConfirmDialog({
                              show: true,
                              itemId: selectedItem._id,
                              action: 'reject'
                            })}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-red-600 hover:to-red-700 active:scale-95 transition-all shadow-lg shadow-red-500/30"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}

                      {selectedItem.status === 'approved' && selectedItem.claims?.length > 0 && (
                        <button
                          onClick={() => setConfirmDialog({
                            show: true,
                            itemId: selectedItem._id,
                            action: 'claim'
                          })}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                        >
                          <CheckBadgeIcon className="w-4 h-4" />
                          Process Claim
                        </button>
                      )}

                      <button
                        onClick={() => setConfirmDialog({
                          show: true,
                          itemId: selectedItem._id,
                          action: 'delete'
                        })}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-gray-900 hover:to-black active:scale-95 transition-all shadow-lg"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                        Delete Record
                      </button>
                    </div>

                    {/* Claims Section - Enhanced with Match % */}
                    {selectedItem.claims?.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <UserGroupIcon className="w-4 h-4" />
                          Claims ({selectedItem.claims.length})
                        </h3>
                        
                        <div className="space-y-3">
                          {selectedItem.claims.map((claim, idx) => (
                            <div key={idx} className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-sm font-black text-blue-900">{claim.name}</p>
                                  <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                    {claim.contact?.includes('@') ? (
                                      <EnvelopeIcon className="w-3 h-3" />
                                    ) : (
                                      <PhoneIcon className="w-3 h-3" />
                                    )}
                                    {claim.contact}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {claim.matchPercentage > 0 && (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                      claim.matchPercentage >= 70 ? 'text-green-700 bg-green-200' :
                                      claim.matchPercentage >= 40 ? 'text-yellow-700 bg-yellow-200' :
                                      'text-gray-600 bg-gray-200'
                                    }`}>
                                      {claim.matchPercentage}% match
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full">
                                    {new Date(claim.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Match Percentage Bar */}
                              {claim.matchPercentage > 0 && (
                                <div className="mb-2">
                                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all ${
                                        claim.matchPercentage >= 70 ? 'bg-green-500' :
                                        claim.matchPercentage >= 40 ? 'bg-yellow-500' :
                                        'bg-gray-400'
                                      }`}
                                      style={{ width: `${claim.matchPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Detailed Claim Info */}
                              {(claim.itemDescription || claim.color || claim.brand || claim.whenLost || claim.whereLost || claim.distinguishingFeatures) && (
                                <div className="mt-2 bg-white/60 p-2 rounded-lg space-y-1">
                                  {claim.itemDescription && (
                                    <div>
                                      <p className="text-[9px] font-bold text-blue-500 uppercase">Description</p>
                                      <p className="text-[11px] text-blue-800">{claim.itemDescription}</p>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-x-2">
                                    {claim.color && (
                                      <div>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase">Color</p>
                                        <p className="text-[11px] text-blue-800">{claim.color}</p>
                                      </div>
                                    )}
                                    {claim.brand && (
                                      <div>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase">Brand</p>
                                        <p className="text-[11px] text-blue-800">{claim.brand}</p>
                                      </div>
                                    )}
                                    {claim.whenLost && (
                                      <div>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase">When Lost</p>
                                        <p className="text-[11px] text-blue-800">{claim.whenLost}</p>
                                      </div>
                                    )}
                                    {claim.whereLost && (
                                      <div>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase">Where Lost</p>
                                        <p className="text-[11px] text-blue-800">{claim.whereLost}</p>
                                      </div>
                                    )}
                                  </div>
                                  {claim.distinguishingFeatures && (
                                    <div>
                                      <p className="text-[9px] font-bold text-blue-500 uppercase">Features</p>
                                      <p className="text-[11px] text-blue-800">{claim.distinguishingFeatures}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {claim.note && !claim.itemDescription && (
                                <p className="text-[10px] text-blue-600 italic bg-white/50 p-2 rounded-lg mt-2">
                                  "{claim.note}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Claimed Info */}
                    {selectedItem.status === 'claimed' && selectedItem.claimedBy && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <CheckBadgeIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                              Case Resolved
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Collected By</p>
                              <p className="text-base font-black text-gray-900">{selectedItem.claimedBy}</p>
                            </div>
                            
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                              <p className="text-sm font-bold text-gray-700">{selectedItem.claimedContact}</p>
                            </div>
                            
                            {selectedItem.claimedAt && (
                              <div className="flex items-center gap-2 text-green-600 bg-white/50 p-2 rounded-lg">
                                <ClockIcon className="w-4 h-4" />
                                <p className="text-[10px] font-bold uppercase">
                                  Handed over: {new Date(selectedItem.claimedAt).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedReport ? (
                /* Lost Report Detail Panel */
                <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-orange-100 animate-in slide-in-from-right duration-300">
                  <div className="p-5 space-y-5">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">{selectedReport.itemName}</h2>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          selectedReport.status === 'open' ? 'text-orange-600 bg-orange-100' :
                          selectedReport.status === 'matched' ? 'text-blue-600 bg-blue-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {selectedReport.status}
                        </span>
                      </div>
                    </div>

                    {/* Reporter Info */}
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Reporter Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Name</p>
                            <p className="text-sm font-bold text-gray-900">{selectedReport.reporterName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            {selectedReport.reporterContact?.includes('@') ? (
                              <EnvelopeIcon className="w-4 h-4 text-orange-600" />
                            ) : (
                              <PhoneIcon className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                            <p className="text-sm font-bold text-gray-900">{selectedReport.reporterContact}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4" />
                        Lost Item Details
                      </h3>
                      <div className="bg-orange-50/50 p-3 rounded-xl space-y-2">
                        {selectedReport.category && (
                          <div>
                            <p className="text-[9px] font-bold text-orange-500 uppercase">Category</p>
                            <p className="text-sm text-gray-900">{selectedReport.category}</p>
                          </div>
                        )}
                        {selectedReport.description && (
                          <div>
                            <p className="text-[9px] font-bold text-orange-500 uppercase">Description</p>
                            <p className="text-sm text-gray-900">{selectedReport.description}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReport.color && (
                            <div>
                              <p className="text-[9px] font-bold text-orange-500 uppercase">Color</p>
                              <p className="text-sm text-gray-900">{selectedReport.color}</p>
                            </div>
                          )}
                          {selectedReport.brand && (
                            <div>
                              <p className="text-[9px] font-bold text-orange-500 uppercase">Brand</p>
                              <p className="text-sm text-gray-900">{selectedReport.brand}</p>
                            </div>
                          )}
                          {selectedReport.location && (
                            <div>
                              <p className="text-[9px] font-bold text-orange-500 uppercase">Location</p>
                              <p className="text-sm text-gray-900">{selectedReport.location}</p>
                            </div>
                          )}
                          {selectedReport.dateLost && (
                            <div>
                              <p className="text-[9px] font-bold text-orange-500 uppercase">Date Lost</p>
                              <p className="text-sm text-gray-900">{selectedReport.dateLost}</p>
                            </div>
                          )}
                        </div>
                        {selectedReport.distinguishingFeatures && (
                          <div>
                            <p className="text-[9px] font-bold text-orange-500 uppercase">Distinguishing Features</p>
                            <p className="text-sm text-gray-900">{selectedReport.distinguishingFeatures}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Potential Matches */}
                    {reportMatches.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                          Potential Matches ({reportMatches.length})
                        </h3>
                        <div className="space-y-2">
                          {reportMatches.map((match, idx) => (
                            <div 
                              key={idx} 
                              className="bg-blue-50 p-3 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                              onClick={() => {
                                setSelectedItem(match.item)
                                setSelectedReport(null)
                                setActiveTab('archive')
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-black text-blue-900">{match.item.name}</p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  match.matchPercentage >= 70 ? 'text-green-700 bg-green-200' :
                                  match.matchPercentage >= 40 ? 'text-yellow-700 bg-yellow-200' :
                                  'text-gray-600 bg-gray-200'
                                }`}>
                                  {match.matchPercentage}% match
                                </span>
                              </div>
                              {/* Match Bar */}
                              <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden mb-1">
                                <div 
                                  className={`h-full rounded-full ${
                                    match.matchPercentage >= 70 ? 'bg-green-500' :
                                    match.matchPercentage >= 40 ? 'bg-yellow-500' :
                                    'bg-gray-400'
                                  }`}
                                  style={{ width: `${match.matchPercentage}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-blue-600">
                                <MapPinIcon className="w-3 h-3" />
                                <span>{match.item.location}</span>
                                <span className="text-blue-300">•</span>
                                <span>{match.item.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      {selectedReport.status === 'open' && (
                        <button
                          onClick={() => handleUpdateReportStatus(selectedReport._id, 'matched')}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                        >
                          <CheckBadgeIcon className="w-4 h-4" />
                          Mark as Matched
                        </button>
                      )}
                      {selectedReport.status === 'matched' && (
                        <button
                          onClick={() => handleUpdateReportStatus(selectedReport._id, 'resolved')}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/30"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Mark as Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteLostReport(selectedReport._id)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:from-gray-900 hover:to-black active:scale-95 transition-all shadow-lg"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                        Delete Report
                      </button>
                    </div>

                    {/* Timeline */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <ClockIcon className="w-4 h-4" />
                        <span>Reported: {new Date(selectedReport.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-gray-200 shadow-lg">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <InformationCircleIcon className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2">
                    No Item Selected
                  </h3>
                  
                  <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                    Select an item from the registry to view detailed information and management options
                  </p>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-cyan-500">
                    <ChevronRightIcon className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Click any item to begin
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Details Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 top-10 bg-white rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-cyan-600" />
                </div>
                <h2 className="text-lg font-black text-gray-900">Administrative Detail</h2>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"
              >
                <XCircleIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-6 pb-32">
                {/* Header Image */}
                <div className="relative h-56 rounded-3xl overflow-hidden shadow-inner border border-gray-100">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <CameraIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r shadow-lg ${getStatusConfig(selectedItem.status).gradient}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>

                {/* Primary Info */}
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{selectedItem.name}</h2>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                    <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                      {selectedItem.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm font-bold text-gray-900">{selectedItem.category}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Found Location</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{selectedItem.location}</p>
                    </div>
                  </div>
                </div>

                {/* Secure Details Section */}
                <div className="bg-cyan-50/30 p-5 rounded-[2rem] border border-cyan-100/50">
                  <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Reporter Identity (Secure)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-cyan-100/20">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Reporter Name</p>
                        <p className="text-sm font-black text-gray-900">{selectedItem.reporterName || 'Anonymous'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-cyan-100/20">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        {selectedItem.reporterContact?.includes('@') ? <EnvelopeIcon className="w-5 h-5 text-cyan-600" /> : <PhoneIcon className="w-5 h-5 text-cyan-600" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Hospital Contact</p>
                        <p className="text-sm font-black text-gray-900">{selectedItem.reporterContact || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Claims */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Registry Entry Date</p>
                      <p className="text-xs font-bold text-gray-900">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedItem.claims?.length > 0 && (
                    <div className="pt-4">
                      <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        Active Ownership Claims ({selectedItem.claims.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedItem.claims.map((claim, idx) => (
                          <div key={idx} className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-black text-blue-900">{claim.name}</p>
                                <p className="text-xs text-blue-600 font-bold">{claim.contact}</p>
                              </div>
                              <span className="text-[10px] font-black text-blue-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                {new Date(claim.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {claim.note && <p className="text-xs text-blue-700 italic bg-white/50 p-3 rounded-xl">"{claim.note}"</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.status === 'claimed' && (
                    <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-black text-green-600 uppercase tracking-widest">Case Resolved Successfully</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Handed Over To</p>
                        <p className="text-lg font-black text-gray-900 leading-none">{selectedItem.claimedBy}</p>
                        <p className="text-sm font-bold text-gray-500">{selectedItem.claimedContact}</p>
                        <p className="text-[10px] text-green-600 font-bold mt-2 pt-2 border-t border-green-100">{new Date(selectedItem.claimedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions (Mobile Modal) */}
                <div className="space-y-3">
                  {selectedItem.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setConfirmDialog({ show: true, itemId: selectedItem._id, action: 'approve' })}
                        className="py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5" /> Approve
                      </button>
                      <button 
                        onClick={() => setConfirmDialog({ show: true, itemId: selectedItem._id, action: 'reject' })}
                        className="py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                      >
                        <XCircleIcon className="w-5 h-5" /> Reject
                      </button>
                    </div>
                  )}
                  
                  {selectedItem.status === 'approved' && selectedItem.claims?.length > 0 && (
                    <button 
                      onClick={() => setConfirmDialog({ show: true, itemId: selectedItem._id, action: 'claim' })}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3"
                    >
                      <CheckBadgeIcon className="w-6 h-6" /> Process Handover
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handlePrintItem(selectedItem)}
                      className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 shadow-sm"
                    >
                      <PrinterIcon className="w-5 h-5" /> Report PDF
                    </button>
                    <button 
                      onClick={() => handleCopyDetails(selectedItem)}
                      className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 shadow-sm"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" /> Copy Data
                    </button>
                  </div>

                  <button 
                    onClick={() => setConfirmDialog({ show: true, itemId: selectedItem._id, action: 'delete' })}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" /> Remove Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setConfirmDialog({ show: false, itemId: null, action: null })} />
            
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  confirmDialog.action === 'approve' ? 'bg-green-100' :
                  confirmDialog.action === 'reject' ? 'bg-red-100' :
                  confirmDialog.action === 'claim' ? 'bg-blue-100' :
                  'bg-red-100'
                }`}>
                  {confirmDialog.action === 'approve' && <CheckCircleIcon className="w-6 h-6 text-green-600" />}
                  {confirmDialog.action === 'reject' && <XCircleIcon className="w-6 h-6 text-red-600" />}
                  {confirmDialog.action === 'claim' && <CheckBadgeIcon className="w-6 h-6 text-blue-600" />}
                  {confirmDialog.action === 'delete' && <TrashIcon className="w-6 h-6 text-red-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {confirmDialog.action === 'approve' && 'Approve Item'}
                  {confirmDialog.action === 'reject' && 'Reject Item'}
                  {confirmDialog.action === 'claim' && 'Process Claim'}
                  {confirmDialog.action === 'delete' && 'Delete Record'}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {confirmDialog.action === 'approve' && 'Are you sure you want to approve this item? It will be visible in the public registry.'}
                {confirmDialog.action === 'reject' && 'Are you sure you want to reject this item? The reporter will be notified.'}
                {confirmDialog.action === 'claim' && 'Mark this item as claimed and handed over to the claimant?'}
                {confirmDialog.action === 'delete' && 'Are you sure you want to permanently delete this record? This action cannot be undone.'}
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDialog({ show: false, itemId: null, action: null })}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => {
                    if (confirmDialog.action === 'approve') {
                      handleAction(confirmDialog.itemId, 'approved', 'Approved by admin')
                    } else if (confirmDialog.action === 'reject') {
                      handleAction(confirmDialog.itemId, 'rejected', 'Rejected by admin')
                    } else if (confirmDialog.action === 'claim') {
                      const selectedClaim = items.find(i => i._id === confirmDialog.itemId)?.claims[0]
                      if (selectedClaim) {
                        handleAction(confirmDialog.itemId, 'claimed', `Handed over to ${selectedClaim.name}`, {
                          claimedBy: selectedClaim.name,
                          claimedContact: selectedClaim.contact
                        })
                      }
                    } else if (confirmDialog.action === 'delete') {
                      handleDelete(confirmDialog.itemId)
                    }
                  }}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                    confirmDialog.action === 'approve' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                    confirmDialog.action === 'reject' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                    confirmDialog.action === 'claim' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Lost Item Modal */}
      {showReportLostModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportLostModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleReportLost} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Report Lost Item</h3>
                  <p className="text-xs text-gray-500">Submit a report to match against found items in the registry</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Personal Info */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reporter Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        value={reportLostData.reporterName}
                        onChange={e => setReportLostData(s => ({ ...s, reporterName: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                      <input
                        value={reportLostData.reporterContact}
                        onChange={e => setReportLostData(s => ({ ...s, reporterContact: e.target.value }))}
                        placeholder="Phone or email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="bg-orange-50/50 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">Lost Item Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input
                      value={reportLostData.itemName}
                      onChange={e => setReportLostData(s => ({ ...s, itemName: e.target.value }))}
                      placeholder="e.g. Samsung Galaxy phone, Brown wallet"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={reportLostData.category}
                        onChange={e => setReportLostData(s => ({ ...s, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Lost</label>
                      <input
                        type="date"
                        value={reportLostData.dateLost}
                        onChange={e => setReportLostData(s => ({ ...s, dateLost: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input
                        value={reportLostData.color}
                        onChange={e => setReportLostData(s => ({ ...s, color: e.target.value }))}
                        placeholder="e.g. Black, Red"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Make</label>
                      <input
                        value={reportLostData.brand}
                        onChange={e => setReportLostData(s => ({ ...s, brand: e.target.value }))}
                        placeholder="e.g. Samsung, Nike"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location where lost</label>
                    <input
                      value={reportLostData.location}
                      onChange={e => setReportLostData(s => ({ ...s, location: e.target.value }))}
                      placeholder="Ward, room, area..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={reportLostData.description}
                      onChange={e => setReportLostData(s => ({ ...s, description: e.target.value }))}
                      placeholder="Describe the item in detail..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distinguishing Features</label>
                    <textarea
                      value={reportLostData.distinguishingFeatures}
                      onChange={e => setReportLostData(s => ({ ...s, distinguishingFeatures: e.target.value }))}
                      placeholder="Scratches, stickers, engravings, unique marks..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReportLostModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}