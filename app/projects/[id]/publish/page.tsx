'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { EmptyState } from '@/components/empty-state';
import { useProjects } from '@/components/project-provider';

export default function PublishPage() {
  const params = useParams<{ id: string }>();
  const { getProject } = useProjects();
  const project = getProject(params.id);

  const metrics = useMemo(() => {
    const items = project?.extractedFields ?? [];
    return {
      accepted: items.filter((item) => item.reviewStatus === 'Accepted').length,
      edited: items.filter((item) => item.reviewStatus === 'Edited').length,
      rejected: items.filter((item) => item.reviewStatus === 'Rejected').length,
      corrections: items.filter((item) => (item.correctedValue || '').trim().length > 0).length,
    };
  }, [project]);

  if (!project) {
    return <EmptyState title="Project not found" body="Create a project first from the dashboard." />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar title={`Publish Summary · ${project.name}`} subtitle="Show workbook readiness, review outcome, and how curator corrections can feed a governed learning loop." />
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {[
            ['Accepted', String(metrics.accepted)],
            ['Edited', String(metrics.edited)],
            ['Rejected', String(metrics.rejected)],
            ['Corrections Captured', String(metrics.corrections)],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-bold">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Publish-Ready Narrative</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
              <p>The curated output is now ready for workbook writeback across CTOD sections such as Study, Demography, Treatment Arms, and Outcomes.</p>
              <p>User corrections captured during review can be persisted into a governed feedback store for prompt refinement, example retrieval, and confidence calibration.</p>
              <p>This prototype demonstrates the E2E journey from schema setup to extraction, evidence-backed review, and publish-stage operational metrics.</p>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Suggested next enhancement: add real PDF upload, Excel mapping, exception queue, and field-level reviewer analytics.
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="text-base font-semibold">Demo Actions</h3>
              <div className="mt-4 flex flex-col gap-3">
                <button className="button-primary">Export Workbook Summary</button>
                <button className="button-secondary">Download Review Log</button>
                <button className="button-secondary">View Learning Signals</button>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold">Continue Exploring</h3>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={`/projects/${project.id}/review`} className="button-secondary">Back to Review</Link>
                <Link href="/" className="button-secondary">Return to Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
