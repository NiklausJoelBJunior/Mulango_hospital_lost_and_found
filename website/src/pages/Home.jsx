import React, { useEffect, useRef, useState } from 'react'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  BellIcon,
  HandRaisedIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  ChevronDownIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import heroImage from '../assets/hand-drawn-no-data-concept.png'

export default function Home() {
  const qrcodeRef = useRef(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  
  const appDownloadUrl = "https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found/releases/latest/download/mlaf.apk"
  const iosDownloadUrl = "https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found/releases/latest/download/mlaf-ios.zip"

  useEffect(() => {
    if (typeof window !== 'undefined' && window.QRCode && qrcodeRef.current) {
      qrcodeRef.current.innerHTML = ''
      new window.QRCode(qrcodeRef.current, {
        text: appDownloadUrl,
        width: 200,
        height: 200,
        colorDark: '#0e7490',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      })
    }
  }, [])

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  async function downloadAPK() {
    setDownloading(true)
    const apkUrl = appDownloadUrl
    if (isMobileDevice()) {
      try {
        const resp = await fetch(apkUrl, { method: 'HEAD', redirect: 'follow' })
        const finalUrl = resp.url || apkUrl
        window.open(finalUrl, '_blank')
        showDownloadMessage('Download started!')
      } catch (e) {
        window.location.href = apkUrl
      }
    } else {
      const link = document.createElement('a')
      link.href = apkUrl
      link.download = 'mlaf.apk'
      document.body.appendChild(link)
      link.click()
      link.remove()
      showDownloadMessage('Download started!')
    }
    setDownloading(false)
  }

  async function downloadIOS() {
    setDownloading(true)
    const iosUrl = iosDownloadUrl
    if (isMobileDevice()) {
      try {
        const resp = await fetch(iosUrl, { method: 'HEAD', redirect: 'follow' })
        const finalUrl = resp.url || iosUrl
        window.open(finalUrl, '_blank')
        showDownloadMessage('Download started!')
      } catch (e) {
        window.location.href = iosUrl
      }
    } else {
      const link = document.createElement('a')
      link.href = iosUrl
      link.download = 'mlaf-ios.zip'
      document.body.appendChild(link)
      link.click()
      link.remove()
      showDownloadMessage('Download started!')
    }
    setDownloading(false)
  }

  function showDownloadMessage(message) {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3500)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      setTimeout(() => scrollToSection(id), 500)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-2xl">
            <CheckBadgeIcon className="w-5 h-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-cyan-700 via-cyan-600 to-cyan-500 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center -mt-12 md:-mt-32 lg:text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <HeartIconSolid className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Mulago Hospital Lost & Found</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl  font-bold mb-6 leading-tight">
                Find Your Lost Items
              </h1>
              
              <p className="text-xl md:text-xl mb-8 text-cyan-50 max-w-2xl mx-auto lg:mx-0">
                MLAF helps you recover lost items at Mulago Hospital 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('download')}
                  className="group bg-white text-cyan-700 px-8 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-3"
                >
                  <ArrowDownTrayIcon className="w-6 h-6" />
                  <span>Download App</span>
                </button>
                
                <button
                  onClick={() => scrollToSection('features')}
                  className="group border-2 border-white/50 backdrop-blur-sm px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-cyan-700 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <span>Learn More</span>
                  <ChevronDownIcon className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="MLAF Concept Illustration"
                  className=" animate-float w-full max-w-lg mx-auto"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-cyan-400/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Why Choose MLAF</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Simple, Fast, and Secure
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              We combine technology with hospital protocols to ensure your items are safely returned
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: MagnifyingGlassIcon,
                title: 'Quick Search',
                description: 'Find your lost items instantly with our advanced search and filtering system.',
                gradient: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: BellIcon,
                title: 'Real-time Alerts',
                description: 'Get notified immediately when your lost item is found and registered in our system.',
                gradient: 'from-cyan-600 to-cyan-700'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Secure & Private',
                description: 'Your personal information and lost items data are protected with industry-standard security.',
                gradient: 'from-cyan-700 to-cyan-800'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 md:py-20 bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Get Started</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Download MLAF App
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Scan the QR code or click below to download
              </p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left Column - Steps */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
                    Get Started in 3 Simple Steps
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        number: '1',
                        title: 'Scan QR Code',
                        description: 'Use your phone camera to scan the QR code',
                        icon: QrCodeIcon
                      },
                      {
                        number: '2',
                        title: 'Download App',
                        description: 'Install MLAF on your Android or iOS device',
                        icon: DevicePhoneMobileIcon
                      },
                      {
                        number: '3',
                        title: 'Start Searching',
                        description: 'Register and find your lost items easily',
                        icon: MagnifyingGlassIcon
                      }
                    ].map((step) => (
                      <div key={step.number} className="flex items-start space-x-4 group">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                          {step.number}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h4>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download Buttons */}
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={downloadAPK}
                      disabled={downloading}
                      className="w-full flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all transform hover:-translate-y-1 shadow-lg group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <i className="fab fa-android text-2xl text-green-400"></i>
                        </div>
                        <div className="text-left">
                          <div className="text-xs opacity-70">Direct Download for</div>
                          <div className="text-lg font-bold">Android (APK)</div>
                        </div>
                      </div>
                      <ArrowDownTrayIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={downloadIOS}
                      disabled={downloading}
                      className="w-full flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all transform hover:-translate-y-1 shadow-lg group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <i className="fab fa-apple text-2xl"></i>
                        </div>
                        <div className="text-left">
                          <div className="text-xs opacity-70">Download for</div>
                          <div className="text-lg font-bold">Apple (iOS Zip)</div>
                        </div>
                      </div>
                      <ArrowDownTrayIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 text-center transform hover:-translate-y-2 transition-all duration-300">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl blur-2xl opacity-20" />
                      <div ref={qrcodeRef} id="qrcode" className="relative flex justify-center"></div>
                    </div>
                    
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium mb-3 text-sm"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                      <span>Click to enlarge</span>
                    </button>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      Scan with your phone to <span className="font-bold text-cyan-700">instantly download</span>
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 text-cyan-600 bg-cyan-50 py-2 px-4 rounded-lg">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Verified Secure Build</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              A clear, secure process to recover and return lost items
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Mobile: Vertical Stepper */}
            <div className="lg:hidden space-y-8">
              {[
                {
                  icon: 'hand-holding-box',
                  title: 'Finder Posts Item',
                  desc: 'If someone finds an item, they post details and a photo in the MLAF app or on this website.'
                },
                {
                  icon: 'home',
                  title: 'Deliver to Reception',
                  desc: 'The person who found the item must hand it in at the hospital reception.'
                },
                {
                  icon: 'search',
                  title: 'Hospital Verifies',
                  desc: 'Reception staff verify the item and log it into the MLAF system.'
                },
                {
                  icon: 'list',
                  title: 'Item Listed',
                  desc: 'Verified items are listed in the MLAF registry for users to search.'
                },
                {
                  icon: 'id-badge',
                  title: 'Claim & Collect',
                  desc: 'If an item matches yours, come to reception with valid ID to collect it.'
                }
              ].map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-6">
              {[
                {
                  icon: 'hand-holding-box',
                  title: 'Finder Posts Item',
                  desc: 'If someone finds an item, they post details and a photo in the MLAF app or on this website.'
                },
                {
                  icon: 'home',
                  title: 'Deliver to Reception',
                  desc: 'The person who found the item must hand it in at the hospital reception.'
                },
                {
                  icon: 'search',
                  title: 'Hospital Verifies',
                  desc: 'Reception staff verify the item and log it into the MLAF system.'
                },
                {
                  icon: 'list',
                  title: 'Item Listed',
                  desc: 'Verified items are listed in the MLAF registry for users to search.'
                },
                {
                  icon: 'id-badge',
                  title: 'Claim & Collect',
                  desc: 'If an item matches yours, come to reception with valid ID to collect it.'
                }
              ].map((step, i) => (
                <div key={step.title} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`fas fa-${step.icon} text-2xl text-cyan-600`}></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Important Notes */}
            <div className="mt-10 md:mt-12 bg-cyan-50 rounded-xl md:rounded-2xl p-5 md:p-6 border border-cyan-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-cyan-600 mr-2" />
                Important Information
              </h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Always hand found items to hospital reception — do not leave them unattended.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Reception verifies ownership before releasing items. Bring a valid ID when claiming.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Support hours: 9am - 5pm, Monday to Friday. For urgent enquiries call +256 773 285 064.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  If you posted a found item, keep your contact details available for verification.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Have questions? We're here to help!
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <a href="tel:+256773285064" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600 text-sm break-all">+256 773 285 064</p>
              </a>

              <a href="mailto:lafm46798@gmail.com" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 text-sm break-all">lafm46798@gmail.com</p>
              </a>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                <p className="text-gray-600 text-sm">Main Lobby, Level 1</p>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Support Hours</div>
                  <div className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-cyan-600 bg-cyan-50 px-3 py-2 rounded-lg text-sm">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="font-medium">24/7 Emergency Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setShowQRModal(false)} />
            
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex justify-center mb-6">
                <div ref={qrcodeRef} className="scale-150 origin-center" />
              </div>
              
              <p className="text-center text-gray-600 mb-4">
                Scan with your phone camera to download the MLAF app
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-cyan-600 bg-cyan-50 py-3 px-4 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="font-medium text-sm">Secure & Verified Download</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}