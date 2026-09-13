import React from 'react';
import {
  LayoutDashboard,
  TrainTrack,
  ClipboardCheck,
  Cpu,
  CloudRain,
  BellRing,
  FileSpreadsheet,
  Sliders,
  ArrowLeft,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const moduleDetails = {
  track_sections: {
    title: 'Track Sections Infrastructure Directory',
    tagline: 'Comprehensive GIS corridor catalog & sensor deployment tracking',
    moduleNumber: 'Module 2',
    icon: TrainTrack,
    color: 'blue',
    features: [
      'Interactive GIS corridor mapping with track chainage points',
      'Ultrasonic flaw detection history per kilometer marker',
      'Track curvature, gradient, and axle loading ratings',
      'Dynamic speed restriction (TSR) operational logging',
    ],
  },
  inspections: {
    title: 'Field Inspections & USFD Audit Records',
    tagline: 'Standardized digital inspection logging and verification workflow',
    moduleNumber: 'Module 3',
    icon: ClipboardCheck,
    color: 'emerald',
    features: [
      'Digital field logbook for Permanent Way (P-Way) inspectors',
      'Multi-parameter ultrasonic flaw recording and spectrogram uploads',
      'Automatic escalation for critical rail-head defects',
      'Digital sign-off and compliance report generation',
    ],
  },
  risk_analysis: {
    title: 'AI Predictive Wear & Early-Warning Engine',
    tagline: 'Machine learning models forecasting structural fatigue and derailment risks',
    moduleNumber: 'Module 4',
    icon: Cpu,
    color: 'purple',
    features: [
      'Thermal buckling risk index based on rail expansion variance',
      'FFT vibration frequency anomaly detection from bogie sensors',
      '7-day wear regression forecasting across critical rail bends',
      'Explainable AI metrics for safety commissioners',
    ],
  },
  weather_environment: {
    title: 'Weather & Environmental Threat Sentinel',
    tagline: 'Real-time rainfall, flood level, and extreme heat monitoring along tracks',
    moduleNumber: 'Module 5',
    icon: CloudRain,
    color: 'cyan',
    features: [
      'Track bed flood telemetry and bridge water level ultrasonic sensors',
      'Extreme rail surface temperature surge alerts (sun kink hazards)',
      'Wind velocity sensors on viaducts and high embankments',
      'Automatic speed restriction recommendations during monsoon surges',
    ],
  },
  alerts: {
    title: 'Emergency Alerts & Rapid Dispatch',
    tagline: 'Instant multichannel alerting for station masters and loco pilots',
    moduleNumber: 'Module 6',
    icon: BellRing,
    color: 'orange',
    features: [
      'Real-time WebSocket safety alert broadcast to signal cabins',
      'Configurable severity threshold routing (SMS, sirens, radios)',
      'Automated train deceleration advisories for high-risk blocks',
      'Incident resolution tracking and post-alarm safety clearances',
    ],
  },
  reports: {
    title: 'Statutory Safety & Compliance Audits',
    tagline: 'Automated executive and regulatory reporting for railway authorities',
    moduleNumber: 'Module 7',
    icon: FileSpreadsheet,
    color: 'indigo',
    features: [
      'Standardized Railway Safety Commissioner audit exports (PDF/CSV)',
      'Track Quality Index (TQI) longitudinal progress graphs',
      'Maintenance crew dispatch and sleeper replacement manifests',
      'Budget impact and preventive maintenance ROI calculations',
    ],
  },
  settings: {
    title: 'System Thresholds & Hardware Calibration',
    tagline: 'Administrative control of IoT polling rates, AI confidence levels, and user roles',
    moduleNumber: 'System Config',
    icon: Sliders,
    color: 'slate',
    features: [
      'IoT edge node heartbeat timeout configuration',
      'Vibration anomaly standard deviation thresholds (UIC standards)',
      'Role-based access controls (Inspector, Chief Engineer, Auditor)',
      'Local network sync & offline caching settings',
    ],
  },
};

export default function ModulePlaceholder({ activeTab, onReturnToDashboard }) {
  const details = moduleDetails[activeTab] || {
    title: 'Module Under Staged Development',
    tagline: 'This feature will be unlocked in the subsequent development cycle.',
    moduleNumber: 'Planned Feature',
    icon: Clock,
    color: 'blue',
    features: [
      'Staged hackathon-ready architectural progression',
      'Clean interface boundaries for database and AI integration',
    ],
  };

  const Icon = details.icon;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto my-6">
      {/* Top Tag */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded">
                {details.moduleNumber}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                Scheduled for Prompt Expansion
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {details.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-sm text-slate-300 leading-relaxed">
          {details.tagline}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          In accordance with the incremental development blueprint, Prompt 1 focuses exclusively on the foundational UI shell. This interface will be seamlessly connected to real services in its dedicated prompt.
        </p>
      </div>

      {/* Feature Blueprint */}
      <div className="mt-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Planned Feature Roadmap for this Section
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {details.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#0e1424] border border-slate-800/80 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-300">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Back Button */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex sm:hidden">
        <button
          onClick={onReturnToDashboard}
          className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
