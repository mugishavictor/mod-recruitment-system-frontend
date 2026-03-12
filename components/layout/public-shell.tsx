import PublicHeader from "@/components/layout/public-header";

type PublicShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function PublicShell({
  title,
  description,
  children,
}: PublicShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="text-lg leading-8 text-slate-600">{description}</p>
          ) : null}
        </div>

        {children}
      </section>
    </main>
  );
}