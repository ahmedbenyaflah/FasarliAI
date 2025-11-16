import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Source {
  title: string
  description: string
  url?: string
}

interface SourcesPanelProps {
  sources: Source[]
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">📚 Sources</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sources.map((source, idx) => (
          <div key={idx} className="border border-border rounded p-3 text-sm space-y-2">
            <p className="font-medium text-foreground">{source.title}</p>
            <p className="text-muted-foreground text-xs">{source.description}</p>
            {source.url && (
              <Button variant="ghost" size="sm" className="gap-2 text-xs text-blue-600">
                Visit <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
