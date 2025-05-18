export const LoadingScreen = () => (
  <div className="fixed inset-0 z-50">
    {/* Fondo semitransparente */}
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    ></div>
    {/* Spinner */}
    <div className="flex items-center justify-center h-full">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);
