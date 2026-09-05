import type { ChecklistItem } from '../../types/checklist'

interface ChecklistGroupProps {
  items: ChecklistItem[]
  completedTasks: Record<string, boolean>
  onToggleTask: (id: string) => void
}

export default function ChecklistGroup({ items, completedTasks, onToggleTask }: ChecklistGroupProps) {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-text-muted uppercase tracking-wider">
              {category}
            </h3>
            <div className="h-px bg-border flex-1 ml-2"></div>
          </div>

          <div className="grid gap-3">
            {categoryItems.map(item => {
              const isCompleted = !!completedTasks[item.id]
              
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleTask(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-start gap-3.5 ${
                    isCompleted 
                      ? 'bg-status-green-bg border-status-green/30' 
                      : 'bg-surface-elevated border-border hover:border-brand-primary/40'
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    isCompleted
                      ? 'bg-[#E9441F] border-[#E9441F] text-white'
                      : 'bg-surface-card border-border group-hover:border-[#E9441F]'
                  }`}>
                    {isCompleted && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-[15px] font-semibold leading-tight mb-1.5 transition-colors ${
                      isCompleted ? 'text-text-primary line-through opacity-80' : 'text-text-primary'
                    }`}>
                      {item.task}
                    </p>
                    <p className={`text-[13px] leading-relaxed mb-2.5 transition-colors ${
                      isCompleted ? 'text-text-muted opacity-80' : 'text-text-secondary'
                    }`}>
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-card border border-border text-[11px] font-medium text-text-muted">
                      <span className="material-symbols-outlined text-[13px]">description</span>
                      {item.reference_clause}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
