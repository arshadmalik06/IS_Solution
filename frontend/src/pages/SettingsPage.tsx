import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { useChat } from '../hooks/useChat'
import { useTheme } from '../hooks/useTheme'
import type { ToneType, FontSize } from '../types'

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { clearHistory, exportData } = useChat();

  const [activeSection, setActiveSection] = useState('chat');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['appearance', 'chat', 'accessibility', 'data', 'about'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
          }
        }
      }
    };
    
    const scrollContainer = document.getElementById('settings-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(id);
  };

  const NavItem = ({ id, icon, label }: { id: string, icon: string, label: string }) => {
    const isActive = activeSection === id;
    return (
      <button 
        onClick={() => scrollTo(id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-surface-elevated text-brand-primary shadow-sm' 
            : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
          {icon}
        </span> 
        {label}
      </button>
    );
  };

  const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (checked: boolean) => void, label: string }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? 'bg-brand-primary' : 'bg-surface-elevated border-border'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden selection:bg-brand-glow selection:text-brand-primary animate-fade-in">
      
      {/* Settings Sidebar */}
      <div className="w-72 border-r border-border bg-sidebar flex flex-col h-full hidden md:flex z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-sidebar-border flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 rounded-lg bg-sidebar-surface text-sidebar-text hover:text-sidebar-text-active transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2 text-sidebar-text-active" style={{ letterSpacing: '-0.02em' }}>
             Settings
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <nav className="space-y-1.5">
            <NavItem id="appearance" icon="palette" label="Appearance" />
            <NavItem id="chat" icon="chat" label="Chat Preferences" />
            <NavItem id="accessibility" icon="accessibility_new" label="Accessibility" />
            <NavItem id="data" icon="database" label="Data & Privacy" />
            <NavItem id="about" icon="info" label="About QuBIS" />
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div id="settings-scroll-container" className="flex-1 overflow-y-auto scroll-smooth relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
            <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg bg-surface hover:bg-surface-elevated transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold" style={{ letterSpacing: '-0.02em' }}>Settings</h1>
        </div>

        <div className="mx-auto max-w-4xl space-y-12 p-4 pb-24 sm:p-6 sm:pb-32 md:p-10">
          
          <div className="hidden md:block mb-8 animate-slide-down">
            <h1 className="type-h1 text-text-primary mb-3">Settings</h1>
            <p className="text-text-secondary text-[18px] leading-relaxed">Manage your QuBIS account and application preferences.</p>
          </div>

          {/* Appearance Section */}
          <AppearanceSection />

          {/* Chat Preferences Section */}
          <section id="chat" className="scroll-mt-10 animate-fade-in-up" style={{animationDelay: '150ms'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </div>
              <h2 className="type-h3 text-text-primary">Chat Preferences</h2>
            </div>
            
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-elevated/30 transition-colors">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">Assistant Tone</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">How the AI should respond to your queries.</p>
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-surface border border-border rounded-xl pl-4 pr-10 py-2.5 text-[14px] text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/50 hover:border-brand-primary/50 transition-colors cursor-pointer shadow-sm"
                    value={settings.chatPreferences.tone}
                    onChange={(e) => updateSettings({ chatPreferences: { ...settings.chatPreferences, tone: e.target.value as ToneType } })}
                  >
                    <option value="balanced">Balanced</option>
                    <option value="professional">Professional</option>
                    <option value="concise">Concise</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-surface-elevated/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">Show Sources by Default</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Automatically expand standard references in responses.</p>
                </div>
                <Toggle 
                  checked={settings.chatPreferences.showSources} 
                  onChange={(checked) => updateSettings({ chatPreferences: { ...settings.chatPreferences, showSources: checked } })} 
                  label="Show sources by default"
                />
              </div>
              
              <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-surface-elevated/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">Enter to Submit</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Press Enter to send message, Shift+Enter for new line.</p>
                </div>
                <Toggle 
                  checked={settings.chatPreferences.enterToSubmit} 
                  onChange={(checked) => updateSettings({ chatPreferences: { ...settings.chatPreferences, enterToSubmit: checked } })} 
                  label="Enter to submit messages"
                />
              </div>
            </div>
          </section>

          {/* Accessibility Section */}
          <section id="accessibility" className="scroll-mt-10 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <span className="material-symbols-outlined text-[24px]">accessibility_new</span>
              </div>
              <h2 className="type-h3 text-text-primary">Accessibility</h2>
            </div>
            
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border">
               <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-surface-elevated/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">Font Size</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Adjust text size for better readability.</p>
                </div>
                <div className="flex max-w-full flex-wrap rounded-xl border border-border bg-surface-elevated p-1">
                  {(['small', 'medium', 'large'] as FontSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ accessibility: { ...settings.accessibility, fontSize: size } })}
                      className={`px-4 py-1.5 rounded-lg text-[14px] font-medium transition-all duration-200 capitalize ${
                        settings.accessibility.fontSize === size
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-surface-elevated/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">High Contrast Mode</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Increase contrast for better visibility.</p>
                </div>
                <Toggle 
                  checked={settings.accessibility.highContrast} 
                  onChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, highContrast: checked } })} 
                  label="High contrast mode"
                />
              </div>

              <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-surface-elevated/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary mb-1">Reduce Motion</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Minimize animations and transitions.</p>
                </div>
                <Toggle 
                  checked={settings.accessibility.reduceMotion} 
                  onChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, reduceMotion: checked } })} 
                  label="Reduce motion"
                />
              </div>
            </div>
          </section>

          {/* Data & Privacy Section */}
          <section id="data" className="scroll-mt-10 animate-fade-in-up" style={{animationDelay: '250ms'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <span className="material-symbols-outlined text-[24px]">database</span>
              </div>
              <h2 className="type-h3 text-text-primary">Data & Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200 hover:shadow-md hover:border-brand-primary/30">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-full bg-status-green-bg text-status-green mt-1">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-text-primary mb-1">Export Data</h3>
                    <p className="text-[14px] text-text-secondary max-w-md leading-relaxed">Download a complete copy of your chat history, sessions, and settings in JSON format.</p>
                  </div>
                </div>
                <button 
                  onClick={exportData}
                  className="px-5 py-2.5 bg-surface-elevated hover:bg-brand-primary hover:text-white text-text-primary rounded-xl text-[14px] font-semibold transition-colors border border-border whitespace-nowrap active:scale-95"
                >
                  Export JSON
                </button>
              </div>

              <div className="bg-status-red-bg/30 p-6 rounded-2xl border border-status-red/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200 hover:border-status-red/50">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-full bg-status-red/10 text-status-red mt-1">
                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-status-red mb-1">Clear All History</h3>
                    <p className="text-[14px] text-text-secondary max-w-md leading-relaxed">Permanently delete all chat sessions and messages stored locally on this device.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you absolutely sure you want to delete all chat history? This action cannot be undone.")) {
                      clearHistory();
                    }
                  }}
                  className="px-5 py-2.5 bg-status-red hover:bg-red-600 text-white rounded-xl text-[14px] font-semibold transition-colors shadow-sm whitespace-nowrap active:scale-95"
                >
                  Delete History
                </button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="scroll-mt-10 pt-8 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface p-6 text-center shadow-sm sm:p-12">
               
               {/* Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

               <div className="relative z-10 flex flex-col items-center">
                 <img src="/logo.png" alt="QuBIS Logo" className="w-20 h-20 mb-6 drop-shadow-xl hover:scale-110 transition-transform duration-500" />
                 <h3 className="type-h2 text-text-primary">QuBIS Intelligent Assistant</h3>
                 <div className="inline-flex items-center gap-2 mt-3">
                   <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-border text-[12px] font-semibold text-text-muted">Version 1.0.0</span>
                   <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[12px] font-semibold text-brand-primary">Beta</span>
                 </div>
                 <p className="text-[16px] text-text-secondary mt-6 max-w-md mx-auto leading-relaxed">
                   Empowering users with state-of-the-art AI-driven insights into Indian Standards and BIS Services.
                 </p>
                 <div className="mt-8 flex items-center justify-center gap-6 text-[14px] font-medium">
                    <a href="#" className="text-text-secondary hover:text-brand-primary transition-colors underline-offset-4 hover:underline">Terms of Service</a>
                    <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                    <a href="#" className="text-text-secondary hover:text-brand-primary transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
                 </div>
               </div>
            </div>
          </section>

          <div className="pt-12 flex justify-center pb-8 animate-fade-in" style={{animationDelay: '400ms'}}>
             <button 
                onClick={resetSettings}
                className="px-6 py-2.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-xl transition-all duration-200 text-[14px] font-medium group flex items-center gap-2"
             >
               <span className="material-symbols-outlined text-[18px] group-hover:-rotate-180 transition-transform duration-500">restore</span>
               Reset all settings to default
             </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const { updateSettings } = useSettings();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  // Resolve effective theme for UI display
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return (
    <section id="appearance" className="scroll-mt-10 animate-fade-in-up" style={{animationDelay: '100ms'}}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
          <span className="material-symbols-outlined text-[24px]">palette</span>
        </div>
        <h2 className="type-h3 text-text-primary">Appearance</h2>
      </div>
      
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-[16px] font-semibold text-text-primary mb-1">Theme</h3>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-5">Choose between light and dark mode for the interface.</p>
          
          <div className="flex gap-4">
            {/* Light Mode Card */}
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200 ${
                effectiveTheme === 'light'
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-border hover:border-brand-accent hover:bg-surface-elevated/50'
              }`}
            >
              <span className={`material-symbols-outlined text-[28px] ${
                effectiveTheme === 'light' ? 'text-brand-primary' : 'text-text-muted'
              }`}>light_mode</span>
              <span className={`text-[14px] font-semibold ${
                effectiveTheme === 'light' ? 'text-brand-primary' : 'text-text-secondary'
              }`}>Light</span>
            </button>

            {/* Dark Mode Card */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200 ${
                effectiveTheme === 'dark'
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-border hover:border-brand-accent hover:bg-surface-elevated/50'
              }`}
            >
              <span className={`material-symbols-outlined text-[28px] ${
                effectiveTheme === 'dark' ? 'text-brand-primary' : 'text-text-muted'
              }`}>dark_mode</span>
              <span className={`text-[14px] font-semibold ${
                effectiveTheme === 'dark' ? 'text-brand-primary' : 'text-text-secondary'
              }`}>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
