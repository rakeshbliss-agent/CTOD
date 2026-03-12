'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { ProjectSummary } from '@/components/project-summary';
import { useProjects } from '@/components/project-provider';

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>CTOD Demo App</h1>
      <p>Homepage is working.</p>
    </main>
  );
}
