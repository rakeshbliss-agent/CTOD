'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>CTOD Demo App</h1>
      <p>Homepage is working.</p>
      <p style={{ marginTop: 16 }}>
        <Link href="/projects/new">Go to New Project</Link>
      </p>
    </main>
  );
}
