import './globals.css';
import type { Metadata } from 'next';
import { ProjectProvider } from '@/components/project-provider';

export const metadata: Metadata = {
  title: 'CTOD Curator Demo',
  description: 'Demo-first CTOD curation workbench',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
