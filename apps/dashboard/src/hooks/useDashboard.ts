import { useEffect } from 'react'
import { useMerchantEngine } from '@/stores/merchant-engine'

/**
 * Facade hook over deep MerchantEngine for dashboard overview telemetry.
 */
export function useDashboard(days: number = 7) {
  const stats = useMerchantEngine(s => s.overviewStats)
  const chartData = useMerchantEngine(s => s.volumeTimeline)
  const currencies = useMerchantEngine(s => s.currencies)
  const activeLinksCount = useMerchantEngine(s => s.activeLinksCount)
  const isUsingFallback = useMerchantEngine(s => s.isTelemetryFallback)
  const refresh = useMerchantEngine(s => s.dashboardActions.refresh)

  useEffect(() => {
    refresh(days)
    const interval = setInterval(() => refresh(days), 30000)
    return () => clearInterval(interval)
  }, [refresh, days])

  return {
    stats,
    chartData,
    currencies,
    activeLinksCount,
    isUsingFallback,
    refresh: () => refresh(days),
  }
}
