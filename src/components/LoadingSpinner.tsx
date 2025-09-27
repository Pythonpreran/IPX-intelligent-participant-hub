const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading IPX...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;