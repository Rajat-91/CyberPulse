
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  CloudUpload,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  FileUp,
  FileSpreadsheet,
  FileJson,
  Trash2,
  LoaderCircle,
  AlertCircle
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const activityData = [
  { time: "00:00", events: 18 },
  { time: "02:00", events: 24 },
  { time: "04:00", events: 16 },
  { time: "06:00", events: 31 },
  { time: "08:00", events: 28 },
  { time: "10:00", events: 48 },
  { time: "12:00", events: 39 },
  { time: "14:00", events: 67 },
  { time: "16:00", events: 52 },
  { time: "18:00", events: 78 },
  { time: "20:00", events: 56 },
  { time: "22:00", events: 88 },
];

const initialAlerts = [
  {
    id: "ALT-2048",
    type: "Brute-force attempt",
    source: "185.199.110.24",
    severity: "Critical",
    time: "2 min ago",
    status: "Open"
  },
  {
    id: "ALT-2047",
    type: "Unusual request volume",
    source: "103.21.244.18",
    severity: "High",
    time: "14 min ago",
    status: "Investigating"
  },
  {
    id: "ALT-2046",
    type: "Unauthorized access",
    source: "45.83.12.91",
    severity: "High",
    time: "32 min ago",
    status: "Open"
  },
  {
    id: "ALT-2045",
    type: "Multiple failed logins",
    source: "192.0.2.46",
    severity: "Medium",
    time: "1 hr ago",
    status: "Resolved"
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Upload Logs", icon: CloudUpload },
  { label: "Security Alerts", icon: ShieldAlert, count: "24" },
  { label: "Log History", icon: FileText },
];

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Activity size={21} strokeWidth={2.5} />
        </div>

        <div>
          <div className="brand-name">CyberPulse</div>
          <div className="brand-caption">SECURITY MONITOR</div>
        </div>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon, count }) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {count && <span className="nav-count">{count}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="status-dot" />
          <div>
            <strong>System operational</strong>
            <small>All services responding</small>
          </div>
        </div>

        <button
          className="nav-item"
          onClick={() => onNavigate("Settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className="nav-item"
          onClick={() => onNavigate("Help & Support")}
        >
          <CircleHelp size={18} />
          <span>Help & Support</span>
        </button>

        <div className="profile">
          <div className="avatar">CP</div>

          <div className="profile-text">
            <strong>Security Admin</strong>
            <small>Administrator</small>
          </div>

          <ChevronDown size={16} className="profile-chevron" />
        </div>
      </div>
    </aside>
  );
}

function MetricCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  tone,
  note
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-title">{title}</span>

        <span className={`metric-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-foot">
        <span className={`metric-change ${positive ? "positive" : "negative"}`}>
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {change}
        </span>

        <span className="metric-note">{note}</span>
      </div>
    </article>
  );
}

function Dashboard({ onNavigate }) {
  const [period, setPeriod] = useState("Last 24 hours");
  const [search, setSearch] = useState("");

  const filteredAlerts = useMemo(
    () =>
      initialAlerts.filter((alert) =>
        `${alert.id} ${alert.type} ${alert.source} ${alert.severity}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Overview</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Demo environment
          </div>

          <button className="icon-button" aria-label="Notifications">
            <Bell size={18} />
            <i />
          </button>

          <div className="topbar-avatar">SA</div>
        </div>
      </header>

      <main className="main-content">
        <section className="page-heading">
          <div>
            <div className="eyebrow">SECURITY OVERVIEW</div>
            <h1>
              Good morning, Admin <span className="wave">✦</span>
            </h1>
            <p>
              Here's what's happening across your security environment.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => onNavigate("Upload Logs")}
          >
            <Upload size={16} />
            Upload log files
          </button>
        </section>

        <section className="metrics-grid">
          <MetricCard
            title="Logs analyzed"
            value="12,840"
            change="12.8%"
            positive
            icon={FileText}
            tone="cyan"
            note="vs. previous period"
          />

          <MetricCard
            title="Threat alerts"
            value="248"
            change="8.4%"
            positive={false}
            icon={ShieldAlert}
            tone="red"
            note="vs. previous period"
          />

          <MetricCard
            title="Critical alerts"
            value="12"
            change="3.2%"
            positive={false}
            icon={AlertTriangle}
            tone="amber"
            note="vs. previous period"
          />

          <MetricCard
            title="Processing success"
            value="98.6%"
            change="2.1%"
            positive
            icon={CheckCircle2}
            tone="green"
            note="vs. previous period"
          />
        </section>

        <section className="content-grid">
          <article className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Security activity</h2>
                <p>Events detected over time</p>
              </div>

              <div className="select-wrap">
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                >
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="chart-legend">
              <span className="legend-dot" />
              Detected events
              <strong>1,284</strong>
              <span className="legend-muted">
                + 6.2% from previous period
              </span>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="activityFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#06b6d4"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="95%"
                        stopColor="#06b6d4"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e9eff3"
                    strokeDasharray="3 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8a9aa7", fontSize: 11 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8a9aa7", fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      border: "1px solid #e5edf1",
                      borderRadius: 10
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#06a6c2"
                    strokeWidth={2.5}
                    fill="url(#activityFill)"
                    activeDot={{
                      r: 5,
                      fill: "#06a6c2",
                      stroke: "#fff",
                      strokeWidth: 2
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel breakdown-panel">
            <div className="panel-heading">
              <div>
                <h2>Alert breakdown</h2>
                <p>By severity level</p>
              </div>
              <button className="more-button">•••</button>
            </div>

            <div className="severity-total">
              <strong>248</strong>
              <span>Total alerts</span>
            </div>

            <div className="severity-bar">
              <span className="critical-bar" />
              <span className="high-bar" />
              <span className="medium-bar" />
              <span className="low-bar" />
            </div>

            <div className="severity-list">
              <div>
                <i className="severity-dot critical" />
                <span>Critical</span>
                <strong>12</strong>
                <small>4.8%</small>
              </div>

              <div>
                <i className="severity-dot high" />
                <span>High</span>
                <strong>48</strong>
                <small>19.4%</small>
              </div>

              <div>
                <i className="severity-dot medium" />
                <span>Medium</span>
                <strong>96</strong>
                <small>38.7%</small>
              </div>

              <div>
                <i className="severity-dot low" />
                <span>Low</span>
                <strong>92</strong>
                <small>37.1%</small>
              </div>
            </div>
          </article>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading alerts-heading">
            <div>
              <h2>Recent security alerts</h2>
              <p>Latest suspicious activity detected by CyberPulse</p>
            </div>

            <button
              className="text-button"
              onClick={() => onNavigate("Security Alerts")}
            >
              View all alerts <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search alerts..."
              />
            </div>

            <button className="filter-button">
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>

          <div className="table-scroll">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>ALERT ID</th>
                  <th>THREAT TYPE</th>
                  <th>SOURCE IP</th>
                  <th>SEVERITY</th>
                  <th>DETECTED</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="alert-id">{alert.id}</td>
                    <td className="threat-name">{alert.type}</td>
                    <td className="ip-address">{alert.source}</td>

                    <td>
                      <span
                        className={`severity-pill ${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td className="time-cell">
                      <Clock3 size={13} />
                      {alert.time}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${alert.status.toLowerCase()}`}
                      >
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No matching alerts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>Showing {filteredAlerts.length} of 248 alerts</span>
            <span className="demo-note">Sample dashboard data</span>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 CyberPulse</span>
          <span>
            <span className="status-dot" />
            All systems operational
          </span>
        </footer>
      </main>
    </>
  );
}

/* Upload Logs Page */

function UploadLogs({ onNavigate }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [result, setResult] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  function validateFile(file) {
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (extension !== "csv" && extension !== "json") {
      setError("Unsupported file format. Please select a CSV or JSON file.");
      setSelectedFile(null);
      setResult(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is larger than 10 MB. Please choose a smaller file.");
      setSelectedFile(null);
      setResult(null);
      return;
    }

    if (file.size === 0) {
      setError("This file is empty. Please choose a file containing log data.");
      setSelectedFile(null);
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setSelectedFile(file);
  }

  function handleFileChange(event) {
    validateFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    validateFile(event.dataTransfer.files?.[0]);
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  async function submitFile() {
    if (!selectedFile || isProcessing) return;

    const currentFile = selectedFile;

    setIsProcessing(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", currentFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("The backend returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.detail || "File upload failed.");
      }

      setResult(data);

      const completedUpload = {
        id: `LOG-${Date.now().toString().slice(-7)}`,
        name: currentFile.name,
        size: formatFileSize(currentFile.size),
        format: currentFile.name.split(".").pop().toUpperCase(),
        uploadedAt: new Date().toLocaleString(),
        status: "Analysis completed",
        totalLogs: data.total_logs,
        totalAlerts: data.total_alerts
      };

      setUploads((previous) => [
        completedUpload,
        ...previous
      ]);

      setSelectedFile(null);

    } catch (error) {
      setError(
        error.message ||
        "Unable to connect to CyberPulse backend."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Upload Logs</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Backend connected locally
          </div>

          <button className="icon-button" aria-label="Notifications">
            <Bell size={18} />
            <i />
          </button>

          <div className="topbar-avatar">SA</div>
        </div>
      </header>

      <main className="main-content upload-page">
        <section className="page-heading">
          <div>
            <div className="eyebrow">LOG MANAGEMENT</div>
            <h1>Upload security logs</h1>
            <p>Upload CSV or JSON files for real security analysis.</p>
          </div>

          <button
            className="secondary-button"
            onClick={() => onNavigate("Log History")}
          >
            <FileText size={15} />
            View log history
          </button>
        </section>

        <section className="upload-layout">
          <article className="panel upload-main-panel">
            <div className="upload-section-heading">
              <div>
                <h2>Select log file</h2>
                <p>
                  Choose a file from your device or drag it into the area below.
                </p>
              </div>

              <span className="supported-label">CSV / JSON</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={handleFileChange}
              hidden
            />

            <div
              className={`drop-zone ${isDragging ? "dragging" : ""} ${
                selectedFile ? "has-file" : ""
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="drop-icon">
                <FileUp size={27} />
              </div>

              <h3>Drag and drop your log file here</h3>
              <p>or browse files from your computer</p>

              <button
                className="browse-button"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Browse files
              </button>

              <span className="upload-hint">
                Supported formats: .CSV and .JSON · Maximum size: 10 MB
              </span>
            </div>

            {error && (
              <div className="upload-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {selectedFile && (
              <div className="selected-file-card">
                <div className="selected-file-icon">
                  {selectedFile.name.toLowerCase().endsWith(".csv") ? (
                    <FileSpreadsheet size={21} />
                  ) : (
                    <FileJson size={21} />
                  )}
                </div>

                <div className="selected-file-info">
                  <strong>{selectedFile.name}</strong>
                  <span>
                    {formatFileSize(selectedFile.size)} ·{" "}
                    {selectedFile.name.split(".").pop().toUpperCase()} file
                  </span>
                </div>

                <button
                  className="remove-file-button"
                  onClick={() => {
                    setSelectedFile(null);
                    setError("");
                    setResult(null);
                  }}
                  aria-label="Remove selected file"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}

            <div className="upload-actions">
              <div className="secure-note">
                <ShieldCheck size={15} />
                Files are sent to the CyberPulse backend for analysis.
              </div>

              <button
                className="primary-button"
                onClick={submitFile}
                disabled={!selectedFile || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle className="spin-icon" size={16} />
                    Analyzing logs...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Submit for analysis
                  </>
                )}
              </button>
            </div>

            
{result && (
  <div className="analysis-results">

    <div className="analysis-heading">
      <div>
        <div className="eyebrow">SCAN REPORT</div>
        <h2>Analysis Results</h2>
        <p>
          Analysis completed for {result.filename}
        </p>
      </div>

      <span className="analysis-completed">
        <CheckCircle2 size={15} />
        Completed
      </span>
    </div>

    <div className="analysis-stats">

      <div className="analysis-stat">
        <span className="analysis-stat-icon cyan">
          <FileText size={18} />
        </span>
        <div>
          <p>Total Logs</p>
          <strong>{result.total_logs}</strong>
        </div>
      </div>

      <div className="analysis-stat">
        <span className="analysis-stat-icon red">
          <ShieldAlert size={18} />
        </span>
        <div>
          <p>Total Alerts</p>
          <strong>{result.total_alerts}</strong>
        </div>
      </div>

      <div className="analysis-stat">
        <span className="analysis-stat-icon orange">
          <AlertTriangle size={18} />
        </span>
        <div>
          <p>High Severity</p>
          <strong>{result.high_alerts}</strong>
        </div>
      </div>

      <div className="analysis-stat">
        <span className="analysis-stat-icon blue">
          <Activity size={18} />
        </span>
        <div>
          <p>Medium Severity</p>
          <strong>{result.medium_alerts}</strong>
        </div>
      </div>

    </div>

    <div className="detected-section">

      <div className="detected-section-heading">
        <div>
          <h3>Detected Security Alerts</h3>
          <p>
            Suspicious activity identified in the uploaded logs
          </p>
        </div>

        <span className="alert-count">
          {result.alerts.length} detected
        </span>
      </div>

      {result.alerts.length === 0 ? (
        <div className="no-threats">
          <CheckCircle2 size={25} />
          <div>
            <strong>No suspicious activity detected</strong>
            <p>No security alerts were generated for this file.</p>
          </div>
        </div>
      ) : (
        <div className="detected-alert-list">

          {result.alerts.map((alert, index) => (
            <div className="detected-alert" key={index}>

              <div className="detected-alert-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="detected-alert-content">

                <div className="detected-alert-top">
                  <h4>{alert.type}</h4>

                  <span
                    className={`analysis-severity ${alert.severity.toLowerCase()}`}
                  >
                    <span className="severity-indicator" />
                    {alert.severity}
                  </span>
                </div>

                <div className="detected-alert-details">
                  <span className="detail-label">SOURCE IP</span>
                  <code>{alert.source_ip}</code>
                </div>

                <p className="detected-alert-description">
                  {alert.description}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>

  </div>
)}

          </article>

          <aside className="upload-info-column">
            <article className="panel format-panel">
              <h2>Supported formats</h2>

              <div className="format-row">
                <span className="format-icon csv">
                  <FileSpreadsheet size={18} />
                </span>

                <div>
                  <strong>CSV files</strong>
                  <small>Comma-separated log records</small>
                </div>

                <span className="format-extension">.csv</span>
              </div>

              <div className="format-row">
                <span className="format-icon json">
                  <FileJson size={18} />
                </span>

                <div>
                  <strong>JSON files</strong>
                  <small>Structured log records</small>
                </div>

                <span className="format-extension">.json</span>
              </div>
            </article>

            <article className="panel upload-guide-panel">
              <div className="guide-icon">
                <Shield size={18} />
              </div>

              <h2>Before you upload</h2>

              <ul>
                <li>Ensure your file contains security log records.</li>
                <li>Remove unnecessary or sensitive personal information.</li>
                <li>Keep each file below the 10 MB limit.</li>
              </ul>
            </article>
          </aside>
        </section>

        <section className="panel upload-history-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent uploads</h2>
              <p>Files submitted during this session</p>
            </div>

            <span className="upload-count">
              {uploads.length} {uploads.length === 1 ? "file" : "files"}
            </span>
          </div>

          {uploads.length === 0 ? (
            <div className="upload-empty">
              <div className="empty-upload-icon">
                <FileText size={21} />
              </div>

              <strong>No uploads yet</strong>
              <span>Your successfully analyzed files will appear here.</span>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="alerts-table upload-table">
                <thead>
                  <tr>
                    <th>FILE NAME</th>
                    <th>FORMAT</th>
                    <th>SIZE</th>
                    <th>SUBMITTED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {uploads.map((upload) => (
                    <tr key={upload.id}>
                      <td className="threat-name">{upload.name}</td>
                      <td>{upload.format}</td>
                      <td>{upload.size}</td>
                      <td>{upload.uploadedAt}</td>
                      <td>
                        <span className="upload-ready">
                          <CheckCircle2 size={13} />
                          {upload.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="footer">
          <span>© 2026 CyberPulse</span>
          <span>
            <span className="status-dot" />
            Backend connected locally
          </span>
        </footer>
      </main>
    </>
  );
}

function SimplePage({ title, description, icon: Icon, onNavigate }) {
  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>{title}</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Demo environment
          </div>

          <div className="topbar-avatar">SA</div>
        </div>
      </header>

      <main className="main-content simple-page">
        <div className="eyebrow">CYBERPULSE WORKSPACE</div>

        <div className="simple-icon">
          <Icon size={25} />
        </div>

        <h1>{title}</h1>
        <p>{description}</p>

        <div className="coming-card">
          <strong>This section is next on our build plan.</strong>
          <span>
            We'll implement this page after the dashboard foundation is ready.
          </span>

          <button
            className="primary-button"
            onClick={() => onNavigate("Overview")}
          >
            Back to overview
          </button>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("Overview");

  const pageInfo = {
    "Security Alerts": [
      ShieldAlert,
      "Security alerts",
      "Review and investigate detected suspicious activity."
    ],
    "Log History": [
      FileText,
      "Log history",
      "Track uploaded files and their processing status."
    ],
    "Settings": [
      Settings,
      "Settings",
      "Manage your workspace preferences."
    ],
    "Help & Support": [
      CircleHelp,
      "Help & support",
      "Find guidance for using CyberPulse."
    ],
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="main-area">
        {active === "Overview" && (
          <Dashboard onNavigate={setActive} />
        )}

        {active === "Upload Logs" && (
          <UploadLogs onNavigate={setActive} />
        )}

        {active !== "Overview" && active !== "Upload Logs" && (
          <SimplePage
            title={pageInfo[active]?.[1] || active}
            description={pageInfo[active]?.[2] || ""}
            icon={pageInfo[active]?.[0] || Shield}
            onNavigate={setActive}
          />
        )}
      </div>
    </div>
  );
}
