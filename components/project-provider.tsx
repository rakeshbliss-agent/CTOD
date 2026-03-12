'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedProjects } from '@/lib/mock-data';
import { loadProjects, saveProjects } from '@/lib/storage';
import { CTODProject, ExtractedField, FieldDefinition, ProjectStage } from '@/lib/types';

type ProjectContextType = {
  projects: CTODProject[];
  createProject: (project: CTODProject) => void;
  updateProject: (id: string, patch: Partial<CTODProject>) => void;
  setFieldDefinitions: (id: string, fields: FieldDefinition[], stage?: ProjectStage) => void;
  updateExtractedFields: (id: string, fields: ExtractedField[], stage?: ProjectStage) => void;
  getProject: (id: string) => CTODProject | undefined;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<CTODProject[]>([]);

  useEffect(() => {
    const stored = loadProjects();
    if (stored.length > 0) {
      setProjects(stored);
    } else {
      setProjects(seedProjects);
    }
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const value = useMemo<ProjectContextType>(
    () => ({
      projects,
      createProject: (project) => {
        setProjects((prev) => [project, ...prev]);
      },
      updateProject: (id, patch) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, ...patch, updatedAt: new Date().toISOString() } : project
          )
        );
      },
      setFieldDefinitions: (id, fields, stage) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? {
                  ...project,
                  fieldDefinitions: fields,
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

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}
