import './globals.css';
import { ProjectProvider } from '@/components/project-provider';

export const metadata = {
  title: 'CTOD Demo App',
  description: 'CTOD curation prototype',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
