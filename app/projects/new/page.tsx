'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { useProjects } from '@/components/project-provider';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjects();
  const [name, setName] = useState('NSCLC CTOD Demo');
  const [indication, setIndication] = useState('Oncology');
  const [templateName, setTemplateName] = useState('CTOD Standard Template');
  const [pdfCount, setPdfCount] = useState(2);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar title="Create Project" subtitle="Set up a new CTOD curation job before configuring fields and running extraction." />
        <div className="mt-6 max-w-3xl card p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Project name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Indication</label>
              <input className="input" value={indication} onChange={(e) => setIndication(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Workbook template</label>
              <input className="input" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">No. of source PDFs</label>
              <input className="input" type="number" min={1} value={pdfCount} onChange={(e) => setPdfCount(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            This demo stores project data in browser localStorage. PDF upload is represented at workflow level only.
          </div>
          <div className="mt-6 flex gap-3">
            <button
              className="button-primary"
              onClick={() => {
                const id = createProject({ name, indication, templateName, pdfCount });
                router.push(`/projects/${id}/configure`);
              }}
            >
              Create and Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
