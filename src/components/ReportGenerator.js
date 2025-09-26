import React, { useState } from 'react';

const ReportGenerator = ({ events, candidateName, interviewDuration, isInterviewActive }) => {
  const [reportGenerated, setReportGenerated] = useState(false);

  const calculateIntegrityScore = () => {
    const suspiciousEvents = events.filter(event => event.type === 'suspicious').length;
    const score = Math.max(0, 100 - (suspiciousEvents * 5));
    return score;
  };

  const getIntegrityScoreClass = (score) => {
    if (score >= 80) return 'integrity-score high';
    if (score >= 60) return 'integrity-score medium';
    return 'integrity-score low';
  };

  const generateReportData = () => {
    const suspiciousEvents = events.filter(event => event.type === 'suspicious');
    const focusLostEvents = events.filter(event => 
      event.event.includes('looking away') || event.event.includes('No face detected')
    );
    
    return {
      candidateName: candidateName || 'Unknown Candidate',
      duration: interviewDuration,
      totalEvents: events.length,
      focusLostCount: focusLostEvents.length,
      suspiciousEventCount: suspiciousEvents.length,
      integrityScore: calculateIntegrityScore(),
      generatedAt: new Date().toISOString(),
      events: events
    };
  };

  const downloadCSV = () => {
    const reportData = generateReportData();
    
    // Create CSV content
    let csvContent = 'Interview Proctoring Report\n\n';
    csvContent += 'Candidate Name,' + reportData.candidateName + '\n';
    csvContent += 'Duration (minutes),' + reportData.duration + '\n';
    csvContent += 'Total Events,' + reportData.totalEvents + '\n';
    csvContent += 'Focus Lost Events,' + reportData.focusLostCount + '\n';
    csvContent += 'Suspicious Events,' + reportData.suspiciousEventCount + '\n';
    csvContent += 'Integrity Score,' + reportData.integrityScore + '/100\n';
    csvContent += 'Report Generated,' + new Date().toLocaleString() + '\n\n';
    
    csvContent += 'Detailed Event Log\n';
    csvContent += 'Timestamp,Event Type,Event Description\n';
    
    reportData.events.forEach(event => {
      const timestamp = new Date(event.time).toLocaleString();
      csvContent += `"${timestamp}","${event.type}","${event.event}"\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-report-${candidateName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setReportGenerated(true);
  };

  const downloadPDF = () => {
    const reportData = generateReportData();
    
    // Simple PDF generation using HTML and print
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Interview Proctoring Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-item { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .integrity-score { text-align: center; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 24px; font-weight: bold; }
          .integrity-high { background: #d4edda; color: #155724; }
          .integrity-medium { background: #fff3cd; color: #856404; }
          .integrity-low { background: #f8d7da; color: #721c24; }
          .events-section { margin-top: 30px; }
          .event-item { padding: 10px; border-left: 4px solid #007bff; margin-bottom: 10px; background: #f8f9fa; }
          .event-suspicious { border-left-color: #dc3545; }
          .event-warning { border-left-color: #ffc107; }
          .timestamp { font-weight: bold; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Proctoring Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <h3>Candidate Information</h3>
            <p><strong>Name:</strong> ${reportData.candidateName}</p>
            <p><strong>Interview Duration:</strong> ${reportData.duration} minutes</p>
          </div>
          
          <div class="info-item">
            <h3>Event Summary</h3>
            <p><strong>Total Events:</strong> ${reportData.totalEvents}</p>
            <p><strong>Focus Lost Events:</strong> ${reportData.focusLostCount}</p>
            <p><strong>Suspicious Events:</strong> ${reportData.suspiciousEventCount}</p>
          </div>
        </div>

        <div class="integrity-score ${reportData.integrityScore >= 80 ? 'integrity-high' : reportData.integrityScore >= 60 ? 'integrity-medium' : 'integrity-low'}">
          Integrity Score: ${reportData.integrityScore}/100
        </div>

        <div class="events-section">
          <h3>Detailed Event Log</h3>
          ${reportData.events.map(event => `
            <div class="event-item ${event.type === 'suspicious' ? 'event-suspicious' : event.type === 'warning' ? 'event-warning' : ''}">
              <span class="timestamp">${new Date(event.time).toLocaleString()}</span><br>
              <strong>${event.type.toUpperCase()}:</strong> ${event.event}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
    
    setReportGenerated(true);
  };

  const reportData = generateReportData();

  return (
    <div className="report-generator">
      <h3>Interview Report</h3>
      
      {events.length === 0 ? (
        <div className="no-report">
          <p>No events recorded yet. Start and conduct the interview to generate a report.</p>
        </div>
      ) : (
        <>
          <div className="report-content">
            <div className="report-stats">
              <div className="stat-item">
                <div className="stat-value">{reportData.candidateName}</div>
                <div className="stat-label">Candidate Name</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{reportData.duration}</div>
                <div className="stat-label">Duration (minutes)</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{reportData.focusLostCount}</div>
                <div className="stat-label">Focus Lost Events</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{reportData.suspiciousEventCount}</div>
                <div className="stat-label">Suspicious Events</div>
              </div>
            </div>

            <div className={getIntegrityScoreClass(reportData.integrityScore)}>
              Integrity Score: {reportData.integrityScore}/100
            </div>

            <div className="report-actions">
              <button
                className="btn btn-primary"
                onClick={downloadCSV}
                disabled={isInterviewActive}
              >
                📊 Download CSV Report
              </button>

              <button
                className="btn btn-secondary"
                onClick={downloadPDF}
                disabled={isInterviewActive}
              >
                📄 Download PDF Report
              </button>
            </div>

            {reportGenerated && (
              <div className="report-success">
                <p>✅ Report generated successfully!</p>
              </div>
            )}

            {isInterviewActive && (
              <div className="report-warning">
                <p>⚠️ End the interview to download the final report.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportGenerator;