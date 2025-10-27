// src/components/AlertBadge.jsx
function AlertBadge({ severity }) {
  const styles = {
    Critical: 'bg-red-500/10 text-red-500 border-red-500',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
    Low: 'bg-blue-500/10 text-blue-500 border-blue-500',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity] || styles.Low}`}>
      {severity}
    </span>
  );
}

export default AlertBadge;