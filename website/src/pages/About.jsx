import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  ShieldCheckIcon, 
  HandRaisedIcon, 
  HeartIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const FAQS = [
  {
    question: "How do I claim a lost item?",
    answer: "Browse the Registry to find your item. Once found, visit the Mulango Hospital Main Reception (Level 1) during support hours. You must provide a valid National ID or Passport and a detailed description (or proof like a password/serial number) to verify ownership."
  },
  {
    question: "Where is the physical Lost and Found office?",
    answer: "Our central collection point is located at the Main Lobby, Level 1 of Mulango Hospital. Staff are available Monday to Friday, 9:00 AM to 5:00 PM."
  },
  {
    question: "What happens if I find an item?",
    answer: "If you find an item within the hospital premises, please take it immediately to the Main Reception. Do not leave it unattended. Our staff will register it in the MLAF system and attempt to contact the owner if identification is available."
  },
  {
    question: "How long are items kept in the registry?",
    answer: "Items are kept in our active registry for 90 days. After this period, unclaimed items may be donated to hospital charity partners or disposed of according to hospital policy."
  },
  {
    question: "Is there a fee for recovering items?",
    answer: "No, the MLAF service is completely free of charge. We are dedicated to ensuring patients and visitors recover their property safely."
  }
]

export default function About() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1)
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
  }, [location])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-mlaf py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">About MLAF System</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Bridging the gap between lost property and their rightful owners at Mulango Hospital through transparency and technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <div className="w-14 h-14 bg-mlaf rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-mlaf/20">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                Our mission is to provide a secure, efficient, and compassionate platform for the management of lost and found items at Mulango Hospital. We strive to minimize the stress of property loss for patients, visitors, and staff by ensuring every item has the best possible chance of returning home.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-600/20">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                To be the gold standard for hospital lost and found systems in East Africa, utilizing modern technology to foster a culture of integrity, honesty, and community care within our healthcare environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Our Core Values</h2>
            <div className="h-1 w-20 bg-mlaf mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Transparency', desc: 'Every registered item is visible to the public, ensuring no item goes unrecorded.', icon: DocumentTextIcon },
              { title: 'Security', desc: 'Rigorous verification protocols to ensure items are only released to rightful owners.', icon: ShieldCheckIcon },
              { title: 'Empathy', desc: 'Understanding the sentimental and practical value of every item we handle.', icon: UserGroupIcon },
            ].map((v) => (
              <div key={v.title} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-xl transition-all border border-gray-100">
                  <v.icon className="w-8 h-8 text-mlaf" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
              <QuestionMarkCircleIcon className="w-10 h-10 text-mlaf" />
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 font-medium font-medium">Everything you need to know about recovering your lost property.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed text-sm bg-gray-50/50">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Terms */}
      <section id="privacy" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
                <IdentificationIcon className="w-8 h-8 text-cyan-400" />
                Privacy Policy
              </h2>
              <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
                <p>
                  At Mulango Hospital Lost and Found (MLAF), we prioritize the privacy of our patients and visitors. Information collected during the report or claim process is used exclusively for the purpose of item verification and owner notification.
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>We do not share reporter or claimant contact details with third parties.</li>
                  <li>Images of items are publicly visible to aid identification, but do not contain sensitive personal data.</li>
                  <li>Identification documents presented at reception are verified but not stored in our digital registry.</li>
                </ul>
              </div>
            </div>
            <div id="terms">
              <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-cyan-400" />
                Terms of Service
              </h2>
              <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
                <p>
                  By using the MLAF registry, you agree to the following protocols of Mulango Hospital:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>All reports made must be honest and accurate. False reporting may lead to restricted access to hospital services.</li>
                  <li>Claiming an item requires physical presence and valid legal identification at the reception office.</li>
                  <li>Mulango Hospital is not liable for items that remain unclaimed beyond the 90-day retention period.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-mlaf rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-8">Need Support?</h2>
              <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto">
                Our dedicated support team is ready to assist you with any inquiries regarding the Lost and Found system.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="mailto:lafm46798@gmail.com" className="bg-white text-mlaf px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all shadow-xl">
                  Contact Support
                </a>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-bold">Mon - Fri: 9am - 5pm</span>
                </div>
              </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
