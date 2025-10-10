export default function AnalyzingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-800">Analisando suas informações</h2>
          <p className="text-sm text-gray-600">Aguarde enquanto processamos seus dados.</p>
        </div>
      </div>
    </div>
  );
}
