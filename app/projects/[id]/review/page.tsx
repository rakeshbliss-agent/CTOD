'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { EmptyState } from '@/components/empty-state';
import { useProjects } from '@/components/project-provider';
import { ExtractedField, ReviewStatus } from '@/lib/types';

type ReviewGroup = {
  label: string;
  items: ExtractedField[];
};

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProject, updateExtractedFields } = useProjects();
  const project = getProject(params.id);

  const [items, setItems] = useState<ExtractedField[]>(project?.extractedFields ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(
    project?.extractedFields[0]?.id ?? null
  );

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const grouped = useMemo(
    () => ({
      auto: items.filter((item) => item.automationMode === 'AI Curated'),
      hybrid: items.filter((item) => item.automationMode === 'AI + Human'),
      human: items.filter((item) => item.automationMode === 'Human Only'),
    }),
    [items]
  );

  const reviewGroups: ReviewGroup[] = useMemo(
    () => [
      { label: 'AI Curated', items: grouped.auto },
      { label: 'AI + Human', items: grouped.hybrid },
      { label: 'Human Only', items: grouped.human },
    ],
    [grouped]
  );

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        body="Create a project first from the dashboard."
      />
    );
  }

  if (!project.extractedFields.length) {
    return (
      <EmptyState
        title="No extraction draft found"
        body="Run extraction first to populate the curator workbench."
      />
    );
  }

  const updateItem = (id: string, patch: Partial<ExtractedField>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const setStatus = (status: ReviewStatus) => {
    if (!selected) return;
    updateItem(selected.id, { reviewStatus: status });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar
          title={`Curator Workbench · ${project.name}`}
          subtitle="Validate evidence-backed draft values, capture corrections, and retain audit-friendly review state."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr_320px]">
          <div className="card p-4">
            <div className="text-sm font-semibold text-slate-900">Review Queue</div>

            <div className="mt-4 space-y-4">
              {reviewGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {group.label}
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full rounded-xl border p-3 text-left ${
                          selected?.id === item.id
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-slate-200 bg-white'
                        }`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.section} · {item.confidence}% · {item.reviewStatus}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-500">{selected.section}</div>
                    <h2 className="mt-1 text-xl font-semibold">{selected.name}</h2>
                  </div>
                  <span className="badge bg-slate-100 text-slate-700">
                    {selected.automationMode}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Extracted value
                    </label>
                    <textarea
                      className="input min-h-28"
                      value={selected.extractedValue}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Curated value
                    </label>
                    <textarea
                      className="input min-h-28"
                      value={selected.correctedValue || ''}
                      onChange={(e) =>
                        updateItem(selected.id, {
                          correctedValue: e.target.value,
                          reviewStatus: 'Edited',
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium">
                    Reviewer comment
                  </label>
                  <textarea
                    className="input min-h-24"
                    value={selected.comment || ''}
                    onChange={(e) =>
                      updateItem(selected.id, { comment: e.target.value })
                    }
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="button-primary" onClick={() => setStatus('Accepted')}>
                    Accept
                  </button>
                  <button className="button-secondary" onClick={() => setStatus('Edited')}>
                    Mark Edited
                  </button>
                  <button className="button-secondary" onClick={() => setStatus('Rejected')}>
                    Reject
                  </button>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className="button-primary"
                    onClick={() => {
                      updateExtractedFields(project.id, items, 'In Review');
                      router.push(`/projects/${project.id}/publish`);
                    }}
                  >
                    Save Review and Continue
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <div className="card p-5">
            {selected ? (
              <>
                <h3 className="text-base font-semibold">Evidence Panel</h3>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selected.evidence}
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <div>
                    <span className="font-medium text-slate-900">Page:</span>{' '}
                    {selected.pageRef}
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-slate-900">Confidence:</span>{' '}
                    {selected.confidence}%
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-slate-900">Reasoning:</span>{' '}
                    Routed as {selected.automationMode} based on field complexity and confidence.
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
