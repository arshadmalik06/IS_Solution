import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, Award, FlaskConical, Search, Cpu, ListChecks } from 'lucide-react'
import Header from '../components/Header'
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-6 lg:px-10 flex flex-col pt-12 pb-24 gap-32">
        {/* HERO SECTION */}
        <section className="relative z-10 flex flex-col items-center justify-center text-center py-12 lg:py-24">
          <div className="flex flex-col items-center space-y-8 max-w-[800px]">
            <h1 className="text-[52px] lg:text-[72px] font-bold leading-[0.98] tracking-[-0.035em]">
              AI-Powered <span className="text-bis-red">BIS</span> Assistant
            </h1>
            
            <div className="flex flex-col items-center space-y-4">
              <p className="text-[20px] lg:text-[24px] font-semibold text-text-secondary">
                Your intelligent guide to Indian Standards and BIS services.
              </p>
              <p className="text-[16px] lg:text-[17px] leading-[1.6] text-text-muted max-w-[600px]">
                Ask questions, find standards, understand certification, hallmarking, laboratories and more — with source-backed answers you can trust.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/chat" className="btn-primary flex items-center justify-center text-[15px] px-6 h-12">
                Ask <span className="text-white">&nbsp;<span className="text-blue-300">Qu</span>BIS&nbsp;</span> AI &rarr;
              </Link>
              <a href="#capabilities" className="btn-secondary flex items-center justify-center text-[15px] px-6 h-12">
                Explore capabilities
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[13px] text-text-muted font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-success" /> Official-source guided</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-bis-blue" /> Multilingual support</div>
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-warning" /> Citations included</div>
            </div>
          </div>
        </section>
        
        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="flex flex-col gap-10 scroll-mt-24">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-[34px] lg:text-[44px] font-bold tracking-tight">WHAT CAN BIS AI HELP YOU WITH?</h2>
            <p className="text-text-muted text-[17px] max-w-[600px]">Explore the key functional areas supported by our intelligent retrieval engine.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CapabilityCard 
              icon={<Search />}
              title="Find Standards"
              desc="Search relevant Indian Standards by product, sector, or use case."
            />
            <CapabilityCard 
              icon={<Award />}
              title="Certification Guidance"
              desc="Understand BIS certification schemes, requirements and procedures."
            />
            <CapabilityCard 
              icon={<ShieldCheck />}
              title="Hallmarking & HUID"
              desc="Get guidance on hallmarking and HUID-related information."
            />
            <CapabilityCard 
              icon={<FlaskConical />}
              title="Testing Laboratories"
              desc="Find BIS-recognized testing laboratories for requirements."
            />
          </div>
        </section>
        
        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="flex flex-col gap-12 scroll-mt-24 bg-surface-elevated/30 border border-border rounded-3xl p-8 lg:p-16">
          <div className="text-center">
            <h2 className="text-[32px] font-bold tracking-tight">HOW BIS AI WORKS</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-border z-0" />
            
            <ProcessStep num="1" title="You Ask" desc="Natural language questions in multiple languages." />
            <ProcessStep num="2" title="We Understand" desc="AI interprets technical intent." />
            <ProcessStep num="3" title="Search BIS Knowledge" desc="Retrieval from verified documents." />
            <ProcessStep num="4" title="AI Generates Answer" desc="Synthesizes factual response." />
            <ProcessStep num="5" title="Source & Verify" desc="Provides exact clause citations." />
          </div>
        </section>
        
        {/* ABOUT SECTION */}
        <section id="about" className="glass-surface p-10 lg:p-16 rounded-3xl flex flex-col lg:flex-row gap-12 items-center justify-between scroll-mt-24">
          <div className="flex-1 space-y-6">
            <h2 className="text-[36px] font-bold tracking-tight">Empowering Industries & Consumers</h2>
            <p className="text-[17px] text-text-secondary leading-relaxed">
              The <span className="text-bis-blue font-semibold">Qu</span><span className="text-bis-red font-semibold">BIS</span> is designed to bridge the gap between complex regulatory documents and the people who need them. Whether you are an MSME navigating certification, a startup building a new product, or a consumer checking a hallmark, our AI provides clear, source-backed answers.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {['Manufacturers', 'MSMEs', 'Startups', 'Consumers', 'Students', 'Professionals'].map(tag => (
                <span key={tag} className="px-4 py-2 rounded-full border border-border bg-surface-elevated text-[14px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[400px] h-[300px] bg-surface-elevated/50 border border-border rounded-2xl flex items-center justify-center p-8">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <div className="bg-background rounded-lg border border-border flex items-center justify-center text-bis-blue"><Cpu className="w-8 h-8" /></div>
              <div className="bg-background rounded-lg border border-border flex items-center justify-center text-bis-red"><ListChecks className="w-8 h-8" /></div>
              <div className="bg-background rounded-lg border border-border flex items-center justify-center text-warning"><Award className="w-8 h-8" /></div>
              <div className="bg-background rounded-lg border border-border flex items-center justify-center text-success"><ShieldCheck className="w-8 h-8" /></div>
            </div>
          </div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer className="w-full border-t border-border mt-auto py-12 text-center text-text-muted text-[14px]">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[17px] leading-tight tracking-tight">
              <span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span>
            </span>
            <span className="font-semibold text-text-primary">Bureau of Indian Standards</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">About BIS</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div>&copy; 2026 <span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span>. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

function CapabilityCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Link to="/chat" className="glass-card p-6 rounded-2xl flex flex-col gap-4 group cursor-pointer h-full">
      <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-bis-blue border border-border group-hover:bg-bis-blue group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-[19px] font-semibold text-text-primary mt-2">{title}</h3>
      <p className="text-[15px] text-text-muted leading-relaxed flex-1">{desc}</p>
      <div className="text-bis-blue text-[14px] font-medium flex items-center mt-4 group-hover:translate-x-1 transition-transform">
        Ask about this &rarr;
      </div>
    </Link>
  )
}

function ProcessStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 z-10 w-full lg:w-48">
      <div className="w-14 h-14 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center text-xl font-bold text-bis-blue shadow-lg">
        {num}
      </div>
      <div>
        <h4 className="text-[16px] font-semibold text-text-primary mb-1">{title}</h4>
        <p className="text-[13px] text-text-muted">{desc}</p>
      </div>
    </div>
  )
}

function Globe(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
}
