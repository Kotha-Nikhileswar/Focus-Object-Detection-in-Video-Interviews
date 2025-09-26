import React from 'react';

const EventLogger = ({ events }) => {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'suspicious':
        return '🚨';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getEventClass = (type) => {
    switch (type) {
      case 'suspicious':
        return 'log-item suspicious';
      case 'warning':
        return 'log-item warning';
      case 'error':
        return 'log-item suspicious';
      default:
        return 'log-item';
    }
  };

  return (
    <div className="event-logger">
      <div className="logs-header">
        <h3>Real-time Event Log</h3>
        <div className="event-stats">
          <small>Total Events: {events.length}</small>
          {events.length > 0 && (
            <small> | Last: {formatTime(events[events.length - 1].time)}</small>
          )}
        </div>
      </div>

      <div className="logs-list">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events logged yet. Start the interview to begin monitoring.</p>
          </div>
        ) : (
          events.slice().reverse().map((event, index) => (
            <div key={index} className={getEventClass(event.type)}>
              <span className="log-timestamp">
                {getEventIcon(event.type)} {formatTime(event.time)}
              </span>
              <span className="log-message">{event.event}</span>
            </div>
          ))
        )}
      </div>

      {events.length > 0 && (
        <div className="event-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value">
                {events.filter(e => e.type === 'suspicious').length}
              </div>
              <div className="stat-label">Suspicious Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {events.filter(e => e.type === 'warning').length}
              </div>
              <div className="stat-label">Warnings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {events.filter(e => e.type === 'error').length}
              </div>
              <div className="stat-label">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventLogger;