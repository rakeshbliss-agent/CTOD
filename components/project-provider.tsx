'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Project, FieldConfig, ExtractedField } from '@/lib/types';
import { loadProjects, saveProjects } from '@/lib/storage';

interface ProjectContextType {
  projects: Project[];
  createProject: (payload: Pick<Project, 'name' | 'indication' | 'templateName' | 'pdfCount'>) => string;
  updateFields: (projectId: string, fields: FieldConfig[]) => void;
  updateExtractedFields: (projectId: string, fields: ExtractedField[], status?: Project['status']) => void;
  getProject: (projectId: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const value = useMemo<ProjectContextType>(() => ({
    projects,
    createProject: (payload) => {
      const id = crypto.randomUUID();
      const next: Project = {
        id,
        name: payload.name,
        indication: payload.indication,
        templateName: payload.templateName,
        pdfCount: payload.pdfCount,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        fields: [],
        extractedFields: [],
      };
      setProjects((prev) => [next, ...prev]);
      return id;
    },
    updateFields: (projectId, fields) => {
      setProjects((prev) => prev.map((project) => project.id === projectId ? { ...project, fields, status: 'Configured' } : project));
    },
    updateExtractedFields: (projectId, fields, status) => {
      setProjects((prev) => prev.map((project) => project.id === projectId ? { ...project, extractedFields: fields, status: status ?? project.status } : project));
    },
    getProject: (projectId) => projects.find((project) => project.id === projectId),
  }), [projects]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
