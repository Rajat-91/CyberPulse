
import { useEffect, useMemo, useRef, useState } from "react";
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
  AlertCircle,
  History,
  CalendarDays,
  Database
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

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Upload Logs", icon: CloudUpload },
  { label: "Security Alerts", icon: ShieldAlert },
  { label: "Log History", icon: FileText }
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
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="status-dot" />
          <div>
            <strong>Analysis workspace</strong>
            <small>Database connected</small>
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
        {change && (
          <span className={`metric-change ${positive ? "positive" : "negative"}`}>
            {positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {change}
          </span>
        )}

        <span className="metric-note">{note}</span>
      </div>
    </article>
  );
}

/* Dashboard */

function Dashboard({ onNavigate, uploads, alerts, onUpdateStatus }) {
  const [search, setSearch] = useState("");

  const totalLogs = uploads.reduce(
    (total, upload) => total + upload.totalLogs,
    0
  );

  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highAlerts = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const mediumAlerts = alerts.filter(
    (alert) => alert.severity === "Medium"
  ).length;

  const lowAlerts = alerts.filter(
    (alert) => alert.severity === "Low"
  ).length;

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) =>
        `${alert.id} ${alert.type} ${alert.source} ${alert.severity}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [alerts, search]
  );

  const activityData = uploads
    .slice()
    .reverse()
    .map((upload) => ({
      time: new Date(upload.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      events: upload.totalLogs
    }));

  const getPercentage = (count) =>
    totalAlerts === 0 ? 0 : (count / totalAlerts) * 100;

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Overview</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Database connected
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
            value={totalLogs.toLocaleString()}
            icon={FileText}
            tone="cyan"
            note="Across successful uploads"
          />

          <MetricCard
            title="Threat alerts"
            value={totalAlerts.toLocaleString()}
            icon={ShieldAlert}
            tone="red"
            note="Total detected alerts"
          />

          <MetricCard
            title="High severity alerts"
            value={highAlerts.toLocaleString()}
            icon={AlertTriangle}
            tone="amber"
            note="High severity detections"
          />

          <MetricCard
            title="Files analyzed"
            value={uploads.length.toLocaleString()}
            icon={CheckCircle2}
            tone="green"
            note="Successful uploads"
          />
        </section>

        <section className="content-grid">
          <article className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Security activity</h2>
                <p>Logs analyzed per upload</p>
              </div>

              <span className="supported-label">
                All uploads
              </span>
            </div>

            <div className="chart-legend">
              <span className="legend-dot" />
              Logs analyzed
              <strong>{totalLogs.toLocaleString()}</strong>
            </div>

            <div className="chart-wrap">
              {activityData.length === 0 ? (
                <div className="upload-empty">
                  <div className="empty-upload-icon">
                    <Activity size={21} />
                  </div>

                  <strong>No activity yet</strong>
                  <span>
                    Upload a log file to see activity here.
                  </span>
                </div>
              ) : (
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
                      name="Logs analyzed"
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
              )}
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
              <strong>{totalAlerts.toLocaleString()}</strong>
              <span>Total alerts</span>
            </div>

            <div className="severity-bar">
              <span
                className="critical-bar"
                style={{ width: `${getPercentage(criticalAlerts)}%` }}
              />

              <span
                className="high-bar"
                style={{ width: `${getPercentage(highAlerts)}%` }}
              />

              <span
                className="medium-bar"
                style={{ width: `${getPercentage(mediumAlerts)}%` }}
              />

              <span
                className="low-bar"
                style={{ width: `${getPercentage(lowAlerts)}%` }}
              />
            </div>

            <div className="severity-list">
              <div>
                <i className="severity-dot critical" />
                <span>Critical</span>
                <strong>{criticalAlerts}</strong>
                <small>{getPercentage(criticalAlerts).toFixed(1)}%</small>
              </div>

              <div>
                <i className="severity-dot high" />
                <span>High</span>
                <strong>{highAlerts}</strong>
                <small>{getPercentage(highAlerts).toFixed(1)}%</small>
              </div>

              <div>
                <i className="severity-dot medium" />
                <span>Medium</span>
                <strong>{mediumAlerts}</strong>
                <small>{getPercentage(mediumAlerts).toFixed(1)}%</small>
              </div>

              <div>
                <i className="severity-dot low" />
                <span>Low</span>
                <strong>{lowAlerts}</strong>
                <small>{getPercentage(lowAlerts).toFixed(1)}%</small>
              </div>
            </div>
          </article>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading alerts-heading">
            <div>
              <h2>Recent security alerts</h2>
              <p>
                Latest suspicious activity detected by CyberPulse
              </p>
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
                  <th>ID</th>
                  <th>TYPE</th>
                  <th>DESCRIPTION</th>
                  <th>SOURCE IP</th>
                  <th>SEVERITY</th>
                  <th>DETECTED</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.id}</td>
                    <td>{alert.type}</td>
                    <td>{alert.description}</td>
                    <td>{alert.source}</td>
                    <td>
                      <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td>{alert.time}</td>
                    <td>
                      <span className={`status-badge ${alert.status.toLowerCase()}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="alert-action-button"
                        onClick={() =>
                          onUpdateStatus(
                            alert.id,
                            alert.status === "Open" ? "Resolved" : "Open"
                          )
                        }
                      >
                        {alert.status === "Open" ? "Resolve" : "Reopen"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      {alerts.length === 0
                        ? "No security alerts yet. Upload a log file to begin."
                        : "No matching alerts found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredAlerts.length} of {totalAlerts} alerts
            </span>

            <span className="demo-note">
              Persistent database records
            </span>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 CyberPulse</span>

          <span>
            <span className="status-dot" />
            Database connected
          </span>
        </footer>
      </main>
    </>
  );
}

/* Upload Logs Page */

function UploadLogs({ onNavigate, uploads, onUploadComplete }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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

      await onUploadComplete();

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
                        <p>
                          No security alerts were generated for this file.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="detected-alert-list">
                      {result.alerts.map((alert, index) => (
                        <div className="detected-alert" key={alert.id || index}>
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
              <p>Previously uploaded files stored in the database</p>
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
              <span>
                Your successfully analyzed files will appear here.
              </span>
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
            Database connected
          </span>
        </footer>
      </main>
    </>
  );
}

/* Security Alerts Page */

function SecurityAlerts({ alerts, onUpdateStatus }) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = [
        alert.id,
        alert.type,
        alert.source,
        alert.severity,
        alert.description
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, search, severityFilter, statusFilter]);

  const highCount = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const mediumCount = alerts.filter(
    (alert) => alert.severity === "Medium"
  ).length;

  const lowCount = alerts.filter(
    (alert) => alert.severity === "Low"
  ).length;

  const openCount = alerts.filter(
    (alert) => alert.status === "Open"
  ).length;

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Security Alerts</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Database connected
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
            <div className="eyebrow">THREAT MANAGEMENT</div>
            <h1>Security Alerts</h1>
            <p>
              Review and investigate suspicious activity detected in your log files.
            </p>
          </div>
        </section>

        <section className="metrics-grid">
          <MetricCard
            title="Total alerts"
            value={alerts.length.toLocaleString()}
            icon={ShieldAlert}
            tone="red"
            note="Total detected alerts"
          />

          <MetricCard
            title="Critical alerts"
            value={criticalCount.toLocaleString()}
            icon={AlertTriangle}
            tone="red"
            note="Critical severity"
          />

          <MetricCard
            title="High severity"
            value={highCount.toLocaleString()}
            icon={ShieldAlert}
            tone="amber"
            note="High severity detections"
          />

          <MetricCard
            title="Open alerts"
            value={openCount.toLocaleString()}
            icon={AlertCircle}
            tone="cyan"
            note="Awaiting investigation"
          />
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading alerts-heading">
            <div>
              <h2>Detected security alerts</h2>
              <p>
                All suspicious activity identified by the detection engine
              </p>
            </div>

            <span className="upload-count">
              {alerts.length} {alerts.length === 1 ? "alert" : "alerts"}
            </span>
          </div>

          <div className="severity-list alert-summary-list">
            <div>
              <i className="severity-dot critical" />
              <span>Critical</span>
              <strong>{criticalCount}</strong>
            </div>

            <div>
              <i className="severity-dot high" />
              <span>High</span>
              <strong>{highCount}</strong>
            </div>

            <div>
              <i className="severity-dot medium" />
              <span>Medium</span>
              <strong>{mediumCount}</strong>
            </div>

            <div>
              <i className="severity-dot low" />
              <span>Low</span>
              <strong>{lowCount}</strong>
            </div>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <Search size={16} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by alert ID, threat type or IP..."
              />
            </div>

            <div className="alert-filter-controls">
              <select
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
                aria-label="Filter by severity"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="table-scroll">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TYPE</th>
                  <th>DESCRIPTION</th>
                  <th>SOURCE IP</th>
                  <th>SEVERITY</th>
                  <th>DETECTED</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="alert-id">{alert.id}</td>

                    <td className="threat-name">
                      {alert.type}
                    </td>

                    <td>
                      {alert.description || "No description available"}
                    </td>

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

                    <td>
                      <button
                        type="button"
                        className="alert-action-button"
                        onClick={() =>
                          onUpdateStatus(
                            alert.id,
                            alert.status === "Open" ? "Resolved" : "Open"
                          )
                        }
                      >
                        {alert.status === "Open" ? "Resolve" : "Reopen"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      {alerts.length === 0
                        ? "No security alerts yet. Upload a log file to begin."
                        : "No alerts match your current search and filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>

            <span className="demo-note">
              Persistent database records
            </span>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 CyberPulse</span>

          <span>
            <span className="status-dot" />
            Database connected
          </span>
        </footer>
      </main>
    </>
  );
}

/* Log History Page */

function LogHistory({ uploads, onNavigate }) {
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");

  const filteredUploads = useMemo(() => {
    return uploads.filter((upload) => {
      const matchesSearch = [
        upload.id,
        upload.name,
        upload.format,
        upload.status
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFormat =
        formatFilter === "All" || upload.format === formatFilter;

      return matchesSearch && matchesFormat;
    });
  }, [uploads, search, formatFilter]);

  const totalLogs = uploads.reduce(
    (total, upload) => total + (upload.totalLogs || 0),
    0
  );

  const totalAlerts = uploads.reduce(
    (total, upload) => total + (upload.totalAlerts || 0),
    0
  );

  const csvCount = uploads.filter(
    (upload) => upload.format === "CSV"
  ).length;

  const jsonCount = uploads.filter(
    (upload) => upload.format === "JSON"
  ).length;

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Log History</strong>
        </div>

        <div className="topbar-actions">
          <div className="environment">
            <span className="status-dot" />
            Database connected
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
            <div className="eyebrow">LOG MANAGEMENT</div>
            <h1>Log History</h1>
            <p>
              Review previously uploaded files and their analysis results.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => onNavigate("Upload Logs")}
          >
            <Upload size={16} />
            Upload new logs
          </button>
        </section>

        <section className="metrics-grid">
          <MetricCard
            title="Total uploads"
            value={uploads.length.toLocaleString()}
            icon={FileText}
            tone="cyan"
            note="Successfully analyzed files"
          />

          <MetricCard
            title="Logs processed"
            value={totalLogs.toLocaleString()}
            icon={Database}
            tone="green"
            note="Across all uploads"
          />

          <MetricCard
            title="Alerts detected"
            value={totalAlerts.toLocaleString()}
            icon={ShieldAlert}
            tone="red"
            note="Across all uploaded files"
          />

          <MetricCard
            title="CSV / JSON files"
            value={`${csvCount} / ${jsonCount}`}
            icon={FileSpreadsheet}
            tone="amber"
            note="Files by format"
          />
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading alerts-heading">
            <div>
              <h2>Uploaded log files</h2>
              <p>
                History of files stored in the database
              </p>
            </div>

            <span className="upload-count">
              {uploads.length} {uploads.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <Search size={16} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by filename or upload ID..."
              />
            </div>

            <div className="alert-filter-controls">
              <select
                value={formatFilter}
                onChange={(event) => setFormatFilter(event.target.value)}
                aria-label="Filter by file format"
              >
                <option value="All">All Formats</option>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>
            </div>
          </div>

          <div className="table-scroll">
            <table className="alerts-table upload-table">
              <thead>
                <tr>
                  <th>UPLOAD ID</th>
                  <th>FILE NAME</th>
                  <th>FORMAT</th>
                  <th>SIZE</th>
                  <th>LOGS</th>
                  <th>ALERTS</th>
                  <th>UPLOADED</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="alert-id">{upload.id}</td>

                    <td className="threat-name">
                      <div className="history-file-name">
                        {upload.format === "CSV" ? (
                          <FileSpreadsheet size={17} />
                        ) : (
                          <FileJson size={17} />
                        )}
                        <span>{upload.name}</span>
                      </div>
                    </td>

                    <td>{upload.format}</td>
                    <td>{upload.size}</td>
                    <td>{(upload.totalLogs || 0).toLocaleString()}</td>
                    <td>{(upload.totalAlerts || 0).toLocaleString()}</td>

                    <td className="time-cell">
                      <CalendarDays size={13} />
                      {upload.uploadedAt}
                    </td>

                    <td>
                      <span className="upload-ready">
                        <CheckCircle2 size={13} />
                        {upload.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredUploads.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      {uploads.length === 0
                        ? "No log files have been uploaded yet. Upload a file to see its history here."
                        : "No files match your current search or format filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredUploads.length} of {uploads.length} uploads
            </span>

            <span className="demo-note">
              Persistent database records
            </span>
          </div>
        </section>

        <section className="panel upload-guide-panel history-info-panel">
          <div className="guide-icon">
            <History size={18} />
          </div>

          <h2>About log history</h2>

          <p>
            Uploaded file records and their analysis statistics are stored
            permanently in the CyberPulse PostgreSQL database.
          </p>
        </section>

        <footer className="footer">
          <span>© 2026 CyberPulse</span>

          <span>
            <span className="status-dot" />
            Database connected
          </span>
        </footer>
      </main>
    </>
  );
}

/* Placeholder Pages */

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
            Database connected
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

/* Main Application */

export default function App() {
  const [active, setActive] = useState("Overview");

  const [uploads, setUploads] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function loadPersistentData() {
    try {
      const [uploadsResponse, alertsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/uploads`),
        fetch(`${API_BASE_URL}/api/alerts`)
      ]);

      if (!uploadsResponse.ok || !alertsResponse.ok) {
        throw new Error("Failed to retrieve saved database records.");
      }

      const uploadsData = await uploadsResponse.json();
      const alertsData = await alertsResponse.json();

      const formattedUploads = uploadsData.uploads.map((upload) => ({
        id: upload.id,
        name: upload.filename,
        size: "—",
        format: upload.file_format,
        uploadedAt: new Date(upload.uploaded_at).toLocaleString(),
        createdAt: upload.uploaded_at,
        status: "Analysis completed",
        totalLogs: upload.total_logs,
        totalAlerts: upload.total_alerts
      }));

      const formattedAlerts = alertsData.alerts.map((alert) => ({
        id: alert.id,
        uploadId: alert.upload_id,
        type: alert.type,
        source: alert.source_ip || "Unknown",
        severity: alert.severity,
        time: new Date(alert.detected_at).toLocaleString(),
        status: alert.status,
        detectedAt: alert.detected_at,
        description: alert.description || ""
      }));

      setUploads(formattedUploads);
      setAlerts(formattedAlerts);

    } catch (error) {
      console.error("Database loading error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPersistentData();
  }, []);

  async function handleUploadComplete() {
    await loadPersistentData();
  }

  async function handleAlertStatusChange(alertId, newStatus) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/${alertId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail || "Failed to update alert status."
        );
      }

      setAlerts((previous) =>
        previous.map((alert) =>
          alert.id === alertId
            ? { ...alert, status: newStatus }
            : alert
        )
      );

    } catch (error) {
      console.error("Alert update error:", error);
      window.alert(error.message || "Could not update alert status.");
    }
  }

  const pageInfo = {
    Settings: [
      Settings,
      "Settings",
      "Manage your workspace preferences."
    ],

    "Help & Support": [
      CircleHelp,
      "Help & support",
      "Find guidance for using CyberPulse."
    ]
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="main-area">
        {isLoading ? (
          <main className="main-content">
            <div className="upload-empty">
              <LoaderCircle className="spin-icon" size={25} />
              <strong>Loading CyberPulse data...</strong>
              <span>Retrieving saved uploads and security alerts.</span>
            </div>
          </main>
        ) : (
          <>
            {active === "Overview" && (
              <Dashboard
                onNavigate={setActive}
                uploads={uploads}
                alerts={alerts}
                onUpdateStatus={handleAlertStatusChange}
              />
            )}

            {active === "Upload Logs" && (
              <UploadLogs
                onNavigate={setActive}
                uploads={uploads}
                onUploadComplete={handleUploadComplete}
              />
            )}

            {active === "Security Alerts" && (
              <SecurityAlerts
                alerts={alerts}
                onUpdateStatus={handleAlertStatusChange}
              />
            )}

            {active === "Log History" && (
              <LogHistory
                uploads={uploads}
                onNavigate={setActive}
              />
            )}

            {active !== "Overview" &&
              active !== "Upload Logs" &&
              active !== "Security Alerts" &&
              active !== "Log History" && (
                <SimplePage
                  title={pageInfo[active]?.[1] || active}
                  description={pageInfo[active]?.[2] || ""}
                  icon={pageInfo[active]?.[0] || Shield}
                  onNavigate={setActive}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
}
