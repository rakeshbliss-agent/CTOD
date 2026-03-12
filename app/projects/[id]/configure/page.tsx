'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { EmptyState } from '@/components/empty-state';
import { useProjects } from '@/components/project-provider';
import { defaultFields } from '@/lib/mock-data';
import { AutomationMode, FieldConfig, FieldType } from '@/lib/types';

export default function ConfigurePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProject, updateFields } = useProjects();
  const project = getProject(params.id);
  const [fields, setFields] = useState<FieldConfig[]>(project?.fields.length ? project.fields : defaultFields);

  const sections = useMemo(() => Array.from(new Set(fields.map((field) => field.section))), [fields]);

  if (!project) {
    return <EmptyState title="Project not found" body="Create a project first from the dashboard." />;
  }

  const updateField = <K extends keyof FieldConfig>(index: number, key: K, value: FieldConfig[K]) => {
    setFields((prev) => prev.map((field, i) => i === index ? { ...field, [key]: value } : field));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar title={`Configure Fields · ${project.name}`} subtitle="Define section, field type, required flag, and automation mode before extraction." />
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold">Field Registry</h2>
              <p className="mt-1 text-sm text-slate-600">These definitions drive extraction, routing, review, and workbook mapping.</p>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4">Section</th>
                    <th className="pb-3 pr-4">Field</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Required</th>
                    <th className="pb-3 pr-4">Automation Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-t border-slate-100 align-top">
                      <td className="py-3 pr-4"><input className="input" value={field.section} onChange={(e) => updateField(index, 'section', e.target.value)} /></td>
                      <td className="py-3 pr-4"><input className="input" value={field.name} onChange={(e) => updateField(index, 'name', e.target.value)} /></td>
                      <td className="py-3 pr-4">
                        <select className="select" value={field.type} onChange={(e) => updateField(index, 'type', e.target.value as FieldType)}>
                          {['text','number','percentage','date','location','categorical'].map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <select className="select" value={String(field.required)} onChange={(e) => updateField(index, 'required', e.target.value === 'true')}>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <select className="select" value={field.automationMode} onChange={(e) => updateField(index, 'automationMode', e.target.value as AutomationMode)}>
                          {['AI Curated','AI + Human','Human Only'].map((mode) => <option key={mode}>{mode}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 p-5">
              <button
                className="button-secondary"
                onClick={() => setFields((prev) => [...prev, { id: crypto.randomUUID(), section: 'Outcomes', name: 'New Field', type: 'text', required: false, automationMode: 'AI + Human' }])}
              >
                Add Field
              </button>
              <button
                className="button-primary"
                onClick={() => {
                  updateFields(project.id, fields);
                  router.push(`/projects/${project.id}/extract`);
                }}
              >
                Save and Continue
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="text-base font-semibold">Section Coverage</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {sections.map((section) => <span key={section} className="badge bg-brand-50 text-brand-700">{section}</span>)}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold">Automation Design</h3>
              <p className="mt-3 text-sm text-slate-600">Use AI Curated for deterministic fields, AI + Human for medium-complexity fields, and Human Only for interpretation-heavy endpoints.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
