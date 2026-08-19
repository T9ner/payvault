import { createFileRoute } from '@tanstack/react-router'
import { InsightDetailPage } from '@/features/insights/insight-detail'

export const Route = createFileRoute('/insights/')({
  component: InsightDetailPage,
})
