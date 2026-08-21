import React from 'react'
import { Link } from '@tanstack/react-router'
import { QuirkLogo } from '@/components/quirk-logo'
import { ShieldCheck, Activity, ArrowRightLeft, Terminal, Check, Copy } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='min-h-svh w-full lg:grid lg:grid-cols-12 bg-background'>
      {/* ── Left Side: Visual Control Plane Showcase (Desktop only) ── */}
      <div className='relative hidden lg:flex lg:col-span-7 flex-col justify-between p-10 xl:p-14 bg-[#080B10] text-[#F5F7FA] border-r border-[#22303A] overflow-hidden select-none'>
        {/* Subtle Ambient Glow and Grid */}
        <div className='absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_left,rgba(171,255,42,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(13,212,255,0.08),transparent_50%)]' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#171D26_1px,transparent_1px),linear-gradient(to_bottom,#171D26_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none' />

        {/* Top Header */}
        <div className='relative z-10 flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2.5 transition-opacity hover:opacity-85'>
            <QuirkLogo size={24} lightMode={false} />
          </Link>
          <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-[#11161D] border border-[#22303A] text-xs font-mono text-[#A9B0BB]'>
            <span className='size-1.5 rounded-full bg-[#ABFF2A] animate-pulse' />
            <span>All Rails Operational</span>
          </div>
        </div>

        {/* Center: Live Control Plane Dashboard Preview (Inspired by #image-5) */}
        <div className='relative z-10 my-auto py-6 space-y-4 max-w-xl'>
          {/* Mini Headline */}
          <div className='space-y-1'>
            <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11161D] border border-[#22303A] text-[11px] font-mono text-[#ABFF2A]'>
              <ArrowRightLeft className='size-3' />
              <span>Multi-Rail Routing Control Plane</span>
            </div>
            <h2 className='font-["Satoshi"] text-2xl xl:text-3xl font-bold tracking-tight text-[#F5F7FA]'>
              Resilient African Payment Infrastructure
            </h2>
            <p className='text-xs text-[#A9B0BB]'>
              One integration to route across Paystack, Monnify, and Flutterwave with autonomous failover in &lt;140ms.
            </p>
          </div>

          {/* 3 Floating Mini KPI Cards */}
          <div className='grid grid-cols-3 gap-3 pt-2'>
            <div className='rounded-xl border border-[#22303A] bg-[#11161D]/90 p-3.5 space-y-1 shadow-lg backdrop-blur-md'>
              <div className='text-[10px] font-mono text-[#A9B0BB] uppercase tracking-wider'>Volume</div>
              <div className='font-mono text-base xl:text-lg font-bold text-[#F5F7FA]'>₦1,284,500</div>
              <div className='text-[10px] font-mono text-[#ABFF2A]'>+14.2% velocity</div>
            </div>

            <div className='rounded-xl border border-[#22303A] bg-[#11161D]/90 p-3.5 space-y-1 shadow-lg backdrop-blur-md'>
              <div className='text-[10px] font-mono text-[#A9B0BB] uppercase tracking-wider'>Success Rate</div>
              <div className='font-mono text-base xl:text-lg font-bold text-[#F5F7FA]'>99.4%</div>
              <div className='text-[10px] font-mono text-[#0DD4FF]'>0 dropped flows</div>
            </div>

            <div className='rounded-xl border border-[#22303A] bg-[#11161D]/90 p-3.5 space-y-1 shadow-lg backdrop-blur-md'>
              <div className='text-[10px] font-mono text-[#A9B0BB] uppercase tracking-wider'>Transactions</div>
              <div className='font-mono text-base xl:text-lg font-bold text-[#F5F7FA]'>1,420</div>
              <div className='text-[10px] font-mono text-[#A9B0BB]'>4 live switches</div>
            </div>
          </div>

          {/* Mini Live Ledger Preview */}
          <div className='rounded-xl border border-[#22303A] bg-[#11161D]/80 p-4 shadow-xl backdrop-blur-md space-y-2.5'>
            <div className='flex items-center justify-between text-xs font-mono text-[#A9B0BB] pb-2 border-b border-[#22303A]'>
              <span className='font-semibold text-[#F5F7FA]'>Recent Authorizations</span>
              <span>Live Multi-Rail</span>
            </div>

            <div className='space-y-2 text-xs font-mono'>
              <div className='flex items-center justify-between p-2 rounded-lg bg-[#171D26]/60 border border-[#22303A]/60'>
                <div className='flex items-center gap-2'>
                  <span className='size-1.5 rounded-full bg-[#ABFF2A]' />
                  <span className='text-[#F5F7FA] font-medium'>Alex Okafor</span>
                  <span className='text-[10px] text-[#A9B0BB] px-1.5 py-0.5 rounded bg-[#11161D] border border-[#22303A]'>Paystack Direct</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-[#F5F7FA] font-bold'>₦25,000.00</span>
                  <span className='text-[10px] text-[#ABFF2A]'>142ms</span>
                </div>
              </div>

              <div className='flex items-center justify-between p-2 rounded-lg bg-[#171D26]/60 border border-[#22303A]/60'>
                <div className='flex items-center gap-2'>
                  <span className='size-1.5 rounded-full bg-[#ABFF2A]' />
                  <span className='text-[#F5F7FA] font-medium'>Zainab Bello</span>
                  <span className='text-[10px] text-[#A9B0BB] px-1.5 py-0.5 rounded bg-[#11161D] border border-[#22303A]'>Monnify VA</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-[#F5F7FA] font-bold'>₦12,000.00</span>
                  <span className='text-[10px] text-[#ABFF2A]'>118ms</span>
                </div>
              </div>

              <div className='flex items-center justify-between p-2 rounded-lg bg-[#171D26]/60 border border-[#22303A]/60'>
                <div className='flex items-center gap-2'>
                  <span className='size-1.5 rounded-full bg-[#ABFF2A]' />
                  <span className='text-[#F5F7FA] font-medium'>David Ochieng</span>
                  <span className='text-[10px] text-[#A9B0BB] px-1.5 py-0.5 rounded bg-[#11161D] border border-[#22303A]'>Flutterwave Switch</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-[#F5F7FA] font-bold'>$85.00</span>
                  <span className='text-[10px] text-[#ABFF2A]'>188ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Quote */}
        <div className='relative z-10 pt-4 border-t border-[#22303A]/80 flex items-center justify-between text-xs font-mono text-[#A9B0BB]'>
          <span>AES-256 Hardware Enclave Cryptography</span>
          <span>© 2026 Quirk Control Plane</span>
        </div>
      </div>

      {/* ── Right Side: Interaction Form (Sign In / Sign Up) ── */}
      <div className='col-span-12 lg:col-span-5 flex flex-col justify-center items-center min-h-svh p-6 sm:p-12 lg:p-16 bg-background'>
        <div className='w-full max-w-[420px] space-y-6'>
          {/* Mobile Logo Header */}
          <div className='lg:hidden flex items-center justify-center pb-2'>
            <Link to='/'>
              <QuirkLogo size={24} lightMode={true} />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
