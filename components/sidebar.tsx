'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderPlus, FileSearch, ClipboardCheck, Send } from 'lucide-react';

const items = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects/new', label: 'New Project', icon: FolderPlus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">CTOD</div>
        <div className="mt-1 text-xl font-bold">Curation Workbench</div>
      </div>
      <nav className="mt-8 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 card p-4 text-sm text-slate-600">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><FileSearch className="h-4 w-4" /> Demo scope</div>
        Schema setup, extraction, SME review, and publish summary.
      </div>
      <div className="mt-4 card p-4 text-sm text-slate-600">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><ClipboardCheck className="h-4 w-4" /> Review model</div>
        AI Curated, AI + Human, and Human Only workflows.
      </div>
      <div className="mt-4 card p-4 text-sm text-slate-600">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><Send className="h-4 w-4" /> Publish</div>
        Workbook-ready handoff and learning metrics.
      </div>
    </aside>
  );
}
