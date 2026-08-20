import { create } from 'zustand'
import { payments, dashboard as dashboardApi } from '@/lib/api'
import { toast } from 'sonner'
import type {
  Transaction,
  ChargeRequest,
  ChargeResponse,
  PaymentLink,
  CreatePaymentLinkRequest,
  OverviewStats,
  AnalyticsVolumePoint,
  PaginatedResponse,
} from '@/lib/types'

export interface AdvFilters {
  provider: string
  currency: string
  minAmount: string
  maxAmount: string
}

export interface VolumeDayPoint {
  name: string
  [currency: string]: number | string
}

interface MerchantEngineState {
  // ── Transactions Slice ──────────────────────────────────────
  transactions: Transaction[]
  totalTransactions: number
  transactionsLoading: boolean
  transactionFilter: string
  searchQuery: string
  currentPage: number
  perPage: number
  advFilters: AdvFilters
  selectedTransaction: Transaction | null
  
  // ── Modal State Machines ────────────────────────────────────
  isRefundModalOpen: boolean
  isRefunding: boolean
  isCreateTxModalOpen: boolean
  isCreatingTx: boolean
  createdTxResult: { reference: string; authorization_url: string } | null
  isFilterSheetOpen: boolean

  // ── Dashboard Metrics Slice ─────────────────────────────────
  overviewStats: OverviewStats | null
  volumeTimeline: VolumeDayPoint[]
  currencies: string[]
  activeLinksCount: number
  isTelemetryFallback: boolean
  dashboardLoading: boolean

  // ── Payment Links Slice ─────────────────────────────────────
  paymentLinks: PaymentLink[]
  paymentLinksLoading: boolean

  // ── High-Leverage Intention Actions ─────────────────────────
  transactionsActions: {
    fetch: () => Promise<void>
    setPage: (page: number) => void
    setFilter: (status: string) => void
    setSearch: (query: string) => void
    setAdvFilters: (filters: Partial<AdvFilters>) => void
    selectTransaction: (tx: Transaction | null) => void
    openRefundModal: (tx?: Transaction) => void
    closeRefundModal: () => void
    executeRefund: (reference?: string) => Promise<boolean>
    openCreateModal: () => void
    closeCreateModal: () => void
    executeCharge: (payload: ChargeRequest) => Promise<ChargeResponse | null>
    openFilterSheet: () => void
    closeFilterSheet: () => void
  }

  dashboardActions: {
    refresh: (days?: number) => Promise<void>
  }

  paymentLinksActions: {
    fetch: () => Promise<void>
    create: (data: CreatePaymentLinkRequest) => Promise<PaymentLink | null>
    toggleStatus: (id: string, active: boolean) => Promise<boolean>
  }
}

export const useMerchantEngine = create<MerchantEngineState>((set, get) => ({
  // Initial Transactions State
  transactions: [],
  totalTransactions: 0,
  transactionsLoading: false,
  transactionFilter: 'all',
  searchQuery: '',
  currentPage: 1,
  perPage: 20,
  advFilters: {
    provider: 'all',
    currency: 'all',
    minAmount: '',
    maxAmount: '',
  },
  selectedTransaction: null,

  // Initial Modals
  isRefundModalOpen: false,
  isRefunding: false,
  isCreateTxModalOpen: false,
  isCreatingTx: false,
  createdTxResult: null,
  isFilterSheetOpen: false,

  // Initial Dashboard Stats
  overviewStats: null,
  volumeTimeline: [],
  currencies: ['NGN'],
  activeLinksCount: 0,
  isTelemetryFallback: false,
  dashboardLoading: false,

  // Initial Links
  paymentLinks: [],
  paymentLinksLoading: false,

  // ── Transactions Intention Methods ─────────────────────────
  transactionsActions: {
    fetch: async () => {
      const state = get()
      set({ transactionsLoading: true })

      try {
        const params: Record<string, any> = {
          page: state.currentPage,
          limit: state.perPage,
        }

        if (state.transactionFilter !== 'all') params.status = state.transactionFilter
        if (state.advFilters.provider !== 'all') params.provider = state.advFilters.provider
        if (state.advFilters.currency !== 'all') params.currency = state.advFilters.currency

        const [txData, overviewStats] = await Promise.all([
          payments.listTransactions(params),
          dashboardApi.getOverviewStats().catch(() => null),
        ])

        let items: Transaction[] = txData?.items || []

        // Apply client-side amount filtering if specified
        if (state.advFilters.minAmount) {
          const min = parseFloat(state.advFilters.minAmount)
          items = items.filter(t => t.amount / 100 >= min)
        }
        if (state.advFilters.maxAmount) {
          const max = parseFloat(state.advFilters.maxAmount)
          items = items.filter(t => t.amount / 100 <= max)
        }

        set({
          transactions: items,
          totalTransactions: txData?.total || items.length,
          overviewStats: overviewStats || state.overviewStats,
          transactionsLoading: false,
        })
      } catch (err: any) {
        console.error('MerchantEngine: transactions.fetch failed', err)
        set({ transactionsLoading: false })
        toast.error('Failed to retrieve transaction ledger.')
      }
    },

    setPage: (page: number) => {
      set({ currentPage: page })
      get().transactionsActions.fetch()
    },

    setFilter: (status: string) => {
      set({ transactionFilter: status, currentPage: 1 })
      get().transactionsActions.fetch()
    },

    setSearch: (query: string) => {
      set({ searchQuery: query })
    },

    setAdvFilters: (filters: Partial<AdvFilters>) => {
      set(prev => ({
        advFilters: { ...prev.advFilters, ...filters },
        currentPage: 1,
      }))
      get().transactionsActions.fetch()
    },

    selectTransaction: (tx: Transaction | null) => {
      set({ selectedTransaction: tx })
    },

    openRefundModal: (tx?: Transaction) => {
      set({
        selectedTransaction: tx || get().selectedTransaction,
        isRefundModalOpen: true,
      })
    },

    closeRefundModal: () => {
      set({ isRefundModalOpen: false, isRefunding: false })
    },

    executeRefund: async (reference?: string) => {
      const targetRef = reference || get().selectedTransaction?.reference
      if (!targetRef) return false

      set({ isRefunding: true })
      try {
        await payments.refund({ reference: targetRef })
        toast.success('Refund processed successfully.')
        set({ isRefundModalOpen: false, isRefunding: false, selectedTransaction: null })
        await get().transactionsActions.fetch()
        return true
      } catch (err: any) {
        console.error('MerchantEngine: refund failed', err)
        toast.error(err?.response?.data?.message || 'Refund request failed.')
        set({ isRefunding: false })
        return false
      }
    },

    openCreateModal: () => {
      set({ isCreateTxModalOpen: true, createdTxResult: null })
    },

    closeCreateModal: () => {
      set({ isCreateTxModalOpen: false, isCreatingTx: false, createdTxResult: null })
    },

    executeCharge: async (payload: ChargeRequest) => {
      if (!payload.email || payload.amount <= 0) {
        toast.error('Please specify a valid customer email and charge amount.')
        return null
      }

      set({ isCreatingTx: true })
      try {
        const response = await payments.charge({
          ...payload,
          amount: Math.round(payload.amount * 100),
        })

        set({
          isCreatingTx: false,
          createdTxResult: {
            reference: response.reference,
            authorization_url: response.authorization_url,
          },
        })

        toast.success('Payment intent initialized on optimal rail.')
        await get().transactionsActions.fetch()
        return response
      } catch (err: any) {
        console.error('MerchantEngine: charge failed', err)
        toast.error(err?.response?.data?.message || 'Failed to initialize payment.')
        set({ isCreatingTx: false })
        return null
      }
    },

    openFilterSheet: () => set({ isFilterSheetOpen: true }),
    closeFilterSheet: () => set({ isFilterSheetOpen: false }),
  },

  // ── Dashboard Intention Methods ────────────────────────────
  dashboardActions: {
    refresh: async (days: number = 7) => {
      set({ dashboardLoading: true })
      try {
        const [overviewRes, volumeRes, linksRes] = await Promise.allSettled([
          dashboardApi.getOverviewStats(days),
          dashboardApi.getAnalyticsVolume(days),
          dashboardApi.listPaymentLinks(),
        ])

        const oStats = overviewRes.status === 'fulfilled' ? overviewRes.value : null
        const vPoints: AnalyticsVolumePoint[] = volumeRes.status === 'fulfilled' ? volumeRes.value : []
        const linksData = linksRes.status === 'fulfilled' ? linksRes.value : []

        const linksArray = Array.isArray(linksData)
          ? linksData
          : ((linksData as unknown as PaginatedResponse<PaymentLink>)?.items || [])

        const activeLinks = linksArray.filter(l => l.is_active).length

        // Group time series points by date and currency
        const grouped: Record<string, Record<string, number>> = {}
        const currs = new Set<string>()

        if (Array.isArray(vPoints)) {
          vPoints.forEach(pt => {
            if (!grouped[pt.date]) grouped[pt.date] = {}
            grouped[pt.date][pt.currency] = pt.total
            currs.add(pt.currency)
          })
        }

        const currsArray = Array.from(currs)
        const activeCurrencies = currsArray.length > 0 ? currsArray : ['NGN']

        const today = new Date()
        const timeline: VolumeDayPoint[] = Array.from({ length: days }).map((_, i) => {
          const d = new Date(today)
          d.setDate(d.getDate() - (days - 1 - i))
          const dateStr = d.toISOString().split('T')[0]
          const nameStr = d.toLocaleDateString('en-US', { weekday: 'short' })

          const dayData: VolumeDayPoint = { name: nameStr }
          activeCurrencies.forEach(c => {
            dayData[c] = grouped[dateStr]?.[c] || 0
          })
          return dayData
        })

        set({
          overviewStats: oStats,
          volumeTimeline: timeline,
          currencies: activeCurrencies,
          activeLinksCount: activeLinks,
          isTelemetryFallback: currsArray.length === 0,
          dashboardLoading: false,
        })
      } catch (err: any) {
        console.error('MerchantEngine: dashboard.refresh failed', err)
        set({ dashboardLoading: false })
      }
    },
  },

  // ── Payment Links Intention Methods ────────────────────────
  paymentLinksActions: {
    fetch: async () => {
      set({ paymentLinksLoading: true })
      try {
        const data = await dashboardApi.listPaymentLinks()
        const items = Array.isArray(data)
          ? data
          : ((data as unknown as PaginatedResponse<PaymentLink>)?.items || [])

        set({ paymentLinks: items, paymentLinksLoading: false })
      } catch (err: any) {
        console.error('MerchantEngine: paymentLinks.fetch failed', err)
        set({ paymentLinksLoading: false })
      }
    },

    create: async (data: CreatePaymentLinkRequest) => {
      try {
        const newLink = await dashboardApi.createPaymentLink({
          ...data,
          amount: Math.round(data.amount * 100),
        })
        toast.success('Payment link created successfully.')
        await get().paymentLinksActions.fetch()
        return newLink
      } catch (err: any) {
        console.error('MerchantEngine: createPaymentLink failed', err)
        toast.error('Failed to create payment link.')
        return null
      }
    },

    toggleStatus: async (id: string, active: boolean) => {
      try {
        await dashboardApi.updatePaymentLink(id, { is_active: active })
        toast.success(`Payment link ${active ? 'activated' : 'deactivated'}.`)
        set(state => ({
          paymentLinks: state.paymentLinks.map(l =>
            l.id === id ? { ...l, is_active: active } : l
          ),
        }))
        return true
      } catch (err: any) {
        console.error('MerchantEngine: toggleStatus failed', err)
        toast.error('Failed to update payment link status.')
        return false
      }
    },
  },
}))
