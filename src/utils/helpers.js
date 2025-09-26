// Utility functions for the proctoring system

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const calculateIntegrityScore = (events) => {
  const suspiciousEvents = events.filter(event => event.type === 'suspicious').length;
  const score = Math.max(0, 100 - (suspiciousEvents * 5));
  return score;
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#28a745'; // Green
  if (score >= 60) return '#ffc107'; // Yellow
  return '#dc3545'; // Red
};

export const exportToJSON = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `proctoring-data-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const validateCandidateName = (name) => {
  return name && name.trim().length >= 2;
};

export const getEventTypeIcon = (type) => {
  const icons = {
    'success': '✅',
    'warning': '⚠️',
    'suspicious': '🚨',
    'error': '❌',
    'info': 'ℹ️'
  };
  return icons[type] || icons.info;
};