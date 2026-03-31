export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-5xl rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-12">
        <div className="mb-8 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-medium text-slate-700">
          Phase 1 / Step 1
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Shop ML Pipeline
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                The app shell is live and ready for the customer workflow.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                This baseline gives us a running Next.js app with TypeScript and
                Tailwind so we can move straight into layout, routing, and mock
                data in the next steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
              <span className="rounded-full bg-slate-100 px-4 py-2">
                Next.js 16
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                React 19
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                TypeScript
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                Tailwind CSS
              </span>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-slate-50">
            <h2 className="text-lg font-semibold">Immediate next build slices</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Set up the shared layout and top-level navigation.</li>
              <li>Define customer and order types for the app shell.</li>
              <li>Load mock data so every required page can render.</li>
              <li>Replace this landing page with real customer-facing routes.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
