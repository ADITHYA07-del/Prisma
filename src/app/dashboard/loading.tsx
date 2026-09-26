export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main
        aria-busy="true"
        aria-label="Loading active projects"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div
              key={card}
              className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-indigo-100 dark:bg-indigo-950" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
