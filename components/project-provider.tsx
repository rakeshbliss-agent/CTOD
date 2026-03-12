'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedProjects } from '@/lib/mock-data';
import { loadProjects, saveProjects } from '@/lib/storage';
import { CTODProject, ExtractedField, FieldConfig, ProjectStage } from '@/lib/types';

type CreateProjectInput = Pick<
  CTODProject,
  'name' | 'indication' | 'templateName' | 'pdfCount'
>;

type ProjectContextType = {
  projects: CTODProject[];
  createProject: (input: CreateProjectInput) => string;
  updateProject: (id: string, patch: Partial<CTODProject>) => void;
  updateFields: (id: string, fields: FieldConfig[], stage?: ProjectStage) => void;
  updateExtractedFields: (
    id: string,
    fields: ExtractedField[],
    stage?: ProjectStage
  ) => void;
  getProject: (id: string) => CTODProject | undefined;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<CTODProject[]>([]);

  useEffect(() => {
    const stored = loadProjects();
    setProjects(stored.length > 0 ? stored : seedProjects);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  const value = useMemo<ProjectContextType>(
    () => ({
      projects,
      createProject: (input) => {
        const id = `project-${Date.now()}`;
        const now = new Date().toISOString();

        const project: CTODProject = {
          id,
          name: input.name,
          indication: input.indication,
          templateName: input.templateName,
          pdfCount: input.pdfCount,
          stage: 'Draft',
          createdAt: now,
          updatedAt: now,
          fields: [],
          extractedFields: [],
        };

        setProjects((prev) => [project, ...prev]);
        return id;
      },
      updateProject: (id, patch) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? { ...project, ...patch, updatedAt: new Date().toISOString() }
              : project
          )
        );
      },
      updateFields: (id, fields, stage) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? {
                  ...project,
                  fields,
                  stage: stage ?? project.stage,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );
      },
      updateExtractedFields: (id, fields, stage) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? {
                  ...project,
                  extractedFields: fields,
                  stage: stage ?? project.stage,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );
      },
      getProject: (id) => projects.find((project) => project.id === id),
    }),
    [projects]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}
