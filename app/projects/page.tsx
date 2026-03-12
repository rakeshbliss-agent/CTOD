'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { ProjectSummary } from '@/components/project-summary';
import { useProjects } from '@/components/project-provider';

export default function HomePage() {
  const { projects } = useProjects();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar
          title="CTOD Curation Dashboard"
          subtitle="Demo-first workbench for schema-driven extraction, SME review, and publish-ready output."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Active Projects</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Track configured fields, review queue, and publication readiness.
                </p>
              </div>
              <Link href="/projects/new" className="button-primary">
                New Project
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                  No projects yet. Create a new CTOD curation project to begin.
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectSummary key={project.id} project={project} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="text-base font-semibold">Prototype Scope</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Schema-first field setup</li>
                <li>Mock extraction with evidence and confidence</li>
                <li>AI / AI+Human / Human-only routing</li>
                <li>Editable curator workbench</li>
                <li>Publish summary and learning metrics</li>
              </ul>
            </div>

            <div className="card p-5">
              <h3 className="text-base font-semibold">Suggested Demo Narrative</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Start with project creation, configure a few CTOD fields, simulate extraction,
                review values with evidence, correct ambiguous fields, and show how captured
                corrections strengthen the learning loop.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
