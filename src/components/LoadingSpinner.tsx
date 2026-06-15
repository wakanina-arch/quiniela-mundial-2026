export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
      <p className="ml-3 text-slate-400">Cargando partidos...</p>
    </div>
  )
}
