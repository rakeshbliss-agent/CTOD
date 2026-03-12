import Link from 'next/link';
import { Project } from '@/lib/types';

export function ProjectSummary({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{project.name}</h3>
            <span className="badge bg-slate-100 text-slate-700">{project.stage}</span>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            {project.indication} · {project.templateName} · {project.pdfCount} PDF(s)
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {project.fields.length} configured fields · {project.extractedFields.length} extracted review items
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/projects/${project.id}/configure`} className="button-secondary">Configure</Link>
          <Link href={`/projects/${project.id}/extract`} className="button-secondary">Extract</Link>
          <Link href={`/projects/${project.id}/review`} className="button-secondary">Review</Link>
          <Link href={`/projects/${project.id}/publish`} className="button-primary">Publish</Link>
        </div>
      </div>
    </div>
  );
}
