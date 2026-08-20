import { useEffect, useMemo, useState } from 'react'
import { useMerchantEngine } from '@/stores/merchant-engine'
import type { ChargeRequest, Transaction } from '@/lib/types'

/**
 * Facade hook over deep MerchantEngine for transaction ledger and operations.
 */
export function useTransactions() {
  const transactions = useMerchantEngine(s => s.transactions)
  const loading = useMerchantEngine(s => s.transactionsLoading)
  const filter = useMerchantEngine(s => s.transactionFilter)
  const searchQuery = useMerchantEngine(s => s.searchQuery)
  const page = useMerchantEngine(s => s.currentPage)
  const total = useMerchantEngine(s => s.totalTransactions)
  const perPage = useMerchantEngine(s => s.perPage)
  const selected = useMerchantEngine(s => s.selectedTransaction)
  const stats = useMerchantEngine(s => s.overviewStats)

  // Modal State Machines
  const refunding = useMerchantEngine(s => s.isRefunding)
  const confirmRefundOpen = useMerchantEngine(s => s.isRefundModalOpen)
  const createModalOpen = useMerchantEngine(s => s.isCreateTxModalOpen)
  const creating = useMerchantEngine(s => s.isCreatingTx)
  const createdTx = useMerchantEngine(s => s.createdTxResult)
  const filterSheetOpen = useMerchantEngine(s => s.isFilterSheetOpen)
  const advFilters = useMerchantEngine(s => s.advFilters)

  const actions = useMerchantEngine(s => s.transactionsActions)

  // Local transient state for copy badge and new charge form
  const [copied, setCopied] = useState('')
  const [form, setForm] = useState<ChargeRequest>({
    amount: 0,
    currency: 'NGN',
    email: '',
    provider: 'paystack',
  })

  useEffect(() => {
    actions.fetch()
  }, [])

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions
    const q = searchQuery.toLowerCase()
    return transactions.filter(
      t => t.reference.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q)
    )
  }, [transactions, searchQuery])

  return {
    transactions,
    loading,
    filter,
    setFilter: actions.setFilter,
    searchQuery,
    setSearchQuery: actions.setSearch,
    page,
    setPage: actions.setPage,
    total,
    perPage,
    copied,
    setCopied,
    selected,
    setSelected: actions.selectTransaction,
    refunding,
    confirmRefundOpen,
    setConfirmRefundOpen: (open: boolean) => (open ? actions.openRefundModal() : actions.closeRefundModal()),
    createModalOpen,
    setCreateModalOpen: (open: boolean) => (open ? actions.openCreateModal() : actions.closeCreateModal()),
    creating,
    createdTx,
    filterSheetOpen,
    setFilterSheetOpen: (open: boolean) => (open ? actions.openFilterSheet() : actions.closeFilterSheet()),
    advFilters,
    setAdvFilters: actions.setAdvFilters,
    form,
    setForm,
    filteredTransactions,
    handleRefund: () => actions.executeRefund(),
    handleCreateTransaction: () => actions.executeCharge(form),
    resetCreateForm: () => {
      setForm({ amount: 0, currency: 'NGN', email: '', provider: 'paystack' })
      actions.closeCreateModal()
    },
    stats,
  }
}
