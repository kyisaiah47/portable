export function DashboardCardSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-700/50 rounded w-24"></div>
        <div className="h-4 bg-slate-700/50 rounded w-12"></div>
      </div>
      <div className="h-8 bg-slate-700/50 rounded w-32 mb-2"></div>
      <div className="h-3 bg-slate-700/50 rounded w-20"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
      <div className="h-6 bg-slate-700/50 rounded w-40 mb-6"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 bg-slate-700/50 rounded flex-1" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      <td className="py-3">
        <div className="h-4 bg-slate-700/50 rounded w-24"></div>
      </td>
      <td className="py-3">
        <div className="h-4 bg-slate-700/50 rounded w-32"></div>
      </td>
      <td className="py-3">
        <div className="h-4 bg-slate-700/50 rounded w-20"></div>
      </td>
      <td className="py-3">
        <div className="h-4 bg-slate-700/50 rounded w-16"></div>
      </td>
    </tr>
  );
}

export function PlatformCardSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700/50 rounded-full"></div>
          <div className="h-5 bg-slate-700/50 rounded w-24"></div>
        </div>
        <div className="h-4 bg-slate-700/50 rounded w-12"></div>
      </div>
      <div className="h-7 bg-slate-700/50 rounded w-28"></div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>

      {/* Chart */}
      <ChartSkeleton />

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PlatformCardSkeleton />
        <PlatformCardSkeleton />
        <PlatformCardSkeleton />
      </div>
    </div>
  );
}
