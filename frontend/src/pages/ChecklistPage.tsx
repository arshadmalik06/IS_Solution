import { useState } from 'react'
import Layout from '../components/Layout'
import ChatBackground from '../components/chat/ChatBackground'
import ChecklistForm from '../components/checklist/ChecklistForm'
import ChecklistGroup from '../components/checklist/ChecklistGroup'
import { generateChecklist } from '../api/checklist'
import type { ChecklistResponse } from '../types/checklist'
import { useChat } from '../hooks/useChat' // For sidebar sessions passing

export default function ChecklistPage() {
  const { sessions, clearChat } = useChat()
  const [checklistData, setChecklistData] = useState<ChecklistResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})

  const handleGenerate = async (productName: string, intendedUse: string) => {
    setIsLoading(true)
    setError(null)
    setChecklistData(null)
    setCompletedTasks({})

    try {
      const data = await generateChecklist(productName, intendedUse)
      if (!data.items || data.items.length === 0) {
        throw new Error('Received an empty checklist from the server.')
      }
      setChecklistData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate the checklist. Please verify your product details and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTask = (id: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const exportChecklist = () => {
    if (!checklistData) {
      alert("Please generate a checklist first before exporting.")
      return
    }

    let content = `BIS Compliance Summary: ${checklistData.product_name}\n`
    content += `Standard: ${checklistData.applicable_standard}\n`
    content += `Progress: ${Math.round((completedCount / totalCount) * 100)}% (${completedCount}/${totalCount} completed)\n\n`

    checklistData.items.forEach(item => {
      const status = completedTasks[item.id] ? '[✓] COMPLETED' : '[ ] PENDING'
      content += `${status} | ${item.category}\n`
      content += `Task: ${item.task}\n`
      content += `Reference: ${item.reference_clause}\n\n`
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BIS_Checklist_${checklistData.product_name.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const totalCount = checklistData?.items.length || 0
  const completedCount = checklistData?.items.filter(item => completedTasks[item.id]).length || 0
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <Layout 
      sessions={sessions} 
      onNewChat={clearChat} 
      currentPage="checklist" 
      chatTitle="Compliance Checklist"
      onExport={exportChecklist}
      exportLabel="Export Checklist"
    >
      <div className="flex flex-col h-full relative w-full overflow-hidden bg-background">
        <ChatBackground />
        
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <div className="mx-auto w-full max-w-4xl space-y-8">
            
            {!checklistData ? (
              <div className="mt-8 md:mt-16">
                <ChecklistForm onGenerate={handleGenerate} isLoading={isLoading} />
                
                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-status-red-bg border border-status-red/30 flex items-start gap-3 max-w-2xl mx-auto animate-fade-in-up">
                    <span className="material-symbols-outlined text-status-red text-[20px]">error</span>
                    <p className="text-[14px] text-status-red font-medium">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in-up">
                {/* Header & Product Summary */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 p-6 rounded-2xl bg-surface-card border border-border shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                  <div>
                    <h2 className="text-[20px] font-bold text-text-primary mb-1">BIS Compliance Checklist</h2>
                    <p className="text-[15px] font-medium text-text-primary mb-1">
                      Product: <span className="font-bold">{checklistData.product_name}</span>
                    </p>
                    {checklistData.applicable_standard && (
                      <p className="text-[14px] text-text-secondary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">science</span>
                        Applicable Standard: <span className="font-semibold">{checklistData.applicable_standard}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChecklistData(null)}
                      className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-surface-elevated text-text-primary border border-border hover:border-brand-primary/50 transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      New Checklist
                    </button>
                    <button
                      onClick={exportChecklist}
                      className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#E9441F] text-white hover:bg-[#CC3A1A] transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 p-5 rounded-2xl bg-surface-card border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] font-bold text-text-primary">Compliance Progress</span>
                    <span className="text-[16px] font-bold text-[#E9441F]">{percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-[#E9441F] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[13px] font-medium text-text-muted">
                    {completedCount} of {totalCount} requirements completed
                  </p>
                </div>

                {/* Checklist Categories */}
                <ChecklistGroup 
                  items={checklistData.items}
                  completedTasks={completedTasks}
                  onToggleTask={handleToggleTask}
                />
                
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
