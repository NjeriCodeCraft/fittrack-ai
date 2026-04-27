import { useState } from 'react';
import axios from 'axios';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/reports/download/', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'FitTrack_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMsg('✅ Report downloaded successfully!');
    } catch {
      setMsg('❌ Error generating report. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Progress Reports</h2>
      <div className="card">
        <h3>📄 Download Your Health Report</h3>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
          Generate a complete PDF report of your health journey including:
        </p>
        <ul style={{ fontSize: '14px', color: '#555', marginLeft: '20px', marginBottom: '20px', lineHeight: 2 }}>
          <li>Your personal profile and fitness goals</li>
          <li>BMI history and health classification</li>
          <li>Recent activity log with calories burned</li>
          <li>Nutrition intake summary</li>
          <li>Goal tracking and achievement status</li>
        </ul>
        {msg && <div className={`alert ${msg.includes('✅') ? 'success' : 'error'}`}>{msg}</div>}
        <button onClick={handleDownload} disabled={loading} style={{ fontSize: '16px', padding: '12px 28px' }}>
          {loading ? 'Generating PDF...' : '⬇️ Download PDF Report'}
        </button>
      </div>

      <div className="card" style={{ background: '#d8f3dc', border: '1px solid #74c69d' }}>
        <h3>💡 Tips for a complete report</h3>
        <p style={{ fontSize: '14px', color: '#1b4332', lineHeight: 1.8 }}>
          For the best report, make sure you have:<br />
          ✅ Calculated your BMI at least once<br />
          ✅ Logged some physical activities<br />
          ✅ Tracked some meals in the nutrition section<br />
          ✅ Set at least one fitness goal
        </p>
      </div>
    </div>
  );
}