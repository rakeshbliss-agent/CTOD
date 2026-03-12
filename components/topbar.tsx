export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-4xl text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
