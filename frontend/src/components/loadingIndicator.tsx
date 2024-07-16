import '../styles/loadingIndicator.css' // Import the CSS file

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="loading-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
)
export default LoadingOverlay
