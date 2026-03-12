'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { EmptyState } from '@/components/empty-state';
import { useProjects } from '@/components/project-provider';
import { buildMockExtraction } from '@/lib/mock-data';

export default function ExtractPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProject, updateExtractedFields } = useProjects();
  const project = getProject(params.id);
  const [ran, setRan] = useState(Boolean(project?.extractedFields.length));

  const draft = useMemo(() => project ? (project.extractedFields.length ? project.extractedFields : buildMockExtraction(project.fields)) : [], [project]);

  if (!project) {
    return <EmptyState title="Project not found" body="Create a project first from the dashboard." />;
  }

  const counts = {
    ai: draft.filter((f) => f.automationMode === 'AI Curated').length,
    hybrid: draft.filter((f) => f.automationMode === 'AI + Human').length,
    human: draft.filter((f) => f.automationMode === 'Human Only').length,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar title={`Run Extraction · ${project.name}`} subtitle="Simulate PDF extraction into structured CTOD fields with evidence, confidence, and automation routing." />
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {[
            ['AI Curated', String(counts.ai)],
            ['AI + Human', String(counts.hybrid)],
            ['Human Only', String(counts.human)],
            ['Avg. Confidence', `${Math.round(draft.reduce((sum, item) => sum + item.confidence, 0) / Math.max(draft.length, 1))}%`],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-bold">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Extraction Preview</h2>
              <p className="mt-1 text-sm text-slate-600">Review the schema-driven draft before sending it to the curator workbench.</p>
            </div>
            <button
              className="button-primary"
              onClick={() => {
                updateExtractedFields(project.id, draft, 'Extraction Complete');
                setRan(true);
              }}
            >
              {ran ? 'Refresh Draft' : 'Run Mock Extraction'}
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Section</th>
                  <th className="pb-3 pr-4">Field</th>
                  <th className="pb-3 pr-4">Value</th>
                  <th className="pb-3 pr-4">Confidence</th>
                  <th className="pb-3 pr-4">Mode</th>
                  <th className="pb-3 pr-4">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {draft.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="py-3 pr-4">{item.section}</td>
                    <td className="py-3 pr-4 font-medium">{item.name}</td>
                    <td className="py-3 pr-4">{item.extractedValue}</td>
                    <td className="py-3 pr-4">{item.confidence}%</td>
                    <td className="py-3 pr-4"><span className="badge bg-slate-100 text-slate-700">{item.automationMode}</span></td>
                    <td className="py-3 pr-4 max-w-md text-slate-600">{item.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="button-secondary" onClick={() => router.push(`/projects/${project.id}/review`)}>Go to Review</button>
          </div>
        </div>
      </main>
    </div>
  );
}
