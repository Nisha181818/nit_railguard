import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardOverview from './components/dashboard/DashboardOverview';
import TrackSectionsPage from './components/sections/TrackSectionsPage';
import InspectionsPage from './components/inspections/InspectionsPage';
import WeatherPage from './components/weather/WeatherPage';
import RiskAnalysisPage from './components/risk/RiskAnalysisPage';
import AlertsPage from './components/alerts/AlertsPage';
import ReportsPage from './components/reports/ReportsPage';
import ModulePlaceholder from './components/placeholders/ModulePlaceholder';
import LandingPage from './components/landing/LandingPage';
import Modal from './components/common/Modal';
import TrackHistoryModal from './components/sections/TrackHistoryModal';
import StatusBadge from './components/common/StatusBadge';
import {
  BRAND_INFO,
  TRACK_SECTIONS,
  RECENT_INSPECTIONS,
} from './data/mockData';
import {
  fetchCorridorWeather,
  CORRIDOR_COORDINATES,
} from './services/weatherService';
import { calculateTrackRisk } from './services/riskEngine';
import { generateAutomatedAlerts } from './services/alertService';

export default function App() {
  // Top-level navigation state: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState('landing');

  // Active sidebar navigation tab within dashboard
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mobile sidebar drawer state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 1. Centralized Track Sections State
  const [trackSections, setTrackSections] = useState(TRACK_SECTIONS);

  // 2. Centralized Inspections State
  const [inspections, setInspections] = useState(RECENT_INSPECTIONS);

  // 3. Centralized Weather State (Open-Meteo live API backed by baseline fallbacks)
  const [weatherMap, setWeatherMap] = useState(() => {
    const initial = {};
    Object.keys(CORRIDOR_COORDINATES).forEach((id) => {
      const c = CORRIDOR_COORDINATES[id];
      initial[id] = {
        trackId: id,
        location: c.location,
        temperature: c.baseTemp,
        precipitation: c.baseRain,
        humidity: 60,
        windSpeed: c.baseWind,
        isExtremeHeat: c.baseTemp >= 42,
        isHeavyRain: c.baseRain >= 35,
        isHighWind: c.baseWind >= 50,
        hazardLevel: 'Normal',
        alertMessage: 'Atmospheric conditions within design structural tolerances.',
        badgeColor: 'emerald',
        source: 'Edge Station Baseline',
        isLive: false,
        lastUpdated: 'Real-time sync',
      };
    });
    return initial;
  });

  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [weatherOverrides, setWeatherOverrides] = useState(null);

  // 4. Centralized Alerts State
  const [alerts, setAlerts] = useState(() =>
    generateAutomatedAlerts(TRACK_SECTIONS, weatherMap, RECENT_INSPECTIONS)
  );

  // 5. Modal States
  const [historyModalSection, setHistoryModalSection] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    type: 'info',
    content: null,
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const openModal = ({ title, subtitle, type = 'info', content }) => {
    setModalConfig({
      isOpen: true,
      title,
      subtitle,
      type,
      content,
    });
  };

  // Weather Sync Handler
  const syncWeather = async (overrides = weatherOverrides) => {
    setIsLoadingWeather(true);
    try {
      const results = {};
      await Promise.all(
        trackSections.map(async (t) => {
          const w = await fetchCorridorWeather(t.id, overrides);
          results[t.id] = w;
        })
      );
      setWeatherMap((prev) => ({ ...prev, ...results }));
    } catch (err) {
      console.warn('Weather fetch encountered a fallback:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Fetch weather on mount
  useEffect(() => {
    syncWeather();
  }, []);

  // Regenerate/sync alerts when tracks, inspections, or weather change
  useEffect(() => {
    setAlerts((prevAlerts) => {
      const generated = generateAutomatedAlerts(trackSections, weatherMap, inspections);
      // Preserve manually acknowledged / resolved statuses
      const existingStatusMap = {};
      prevAlerts.forEach((a) => {
        existingStatusMap[a.id] = a.status;
      });

      return generated.map((g) => ({
        ...g,
        status: existingStatusMap[g.id] || g.status,
      }));
    });
  }, [trackSections, weatherMap, inspections]);

  // --- HACKATHON DEMO SIMULATION HANDLERS ---
  const handleTriggerSimulation = (type) => {
    if (type === 'HEATWAVE') {
      const overrides = {
        'TRK-DL-AGR-01': {
          trackId: 'TRK-DL-AGR-01',
          location: 'Palwal – Mathura',
          temperature: 46,
          precipitation: 0,
          humidity: 24,
          windSpeed: 18,
          isExtremeHeat: true,
          isHeavyRain: false,
          isHighWind: false,
          hazardLevel: 'Severe Heatwave Alert',
          alertMessage: 'Extreme rail temperature (46°C). Critical danger of track buckling / sun-kink. 50 km/h TSR required.',
          badgeColor: 'rose',
          source: 'Simulated Weather Telemetry',
        },
        'TRK-JP-DL-03': {
          trackId: 'TRK-JP-DL-03',
          location: 'Alwar – Rewari',
          temperature: 45,
          precipitation: 0,
          humidity: 26,
          windSpeed: 20,
          isExtremeHeat: true,
          isHeavyRain: false,
          isHighWind: false,
          hazardLevel: 'Severe Heatwave Alert',
          alertMessage: 'Extreme heat surge (45°C). Thermal expansion joints expanded to limit.',
          badgeColor: 'rose',
          source: 'Simulated Weather Telemetry',
        },
      };
      setWeatherOverrides(overrides);
      setActiveSimulation('HEATWAVE');
      setWeatherMap((prev) => ({ ...prev, ...overrides }));
    } else if (type === 'MONSOON') {
      const overrides = {
        'TRK-LKO-CNB-04': {
          trackId: 'TRK-LKO-CNB-04',
          location: 'Unnao Sector',
          temperature: 26,
          precipitation: 85,
          humidity: 98,
          windSpeed: 48,
          isExtremeHeat: false,
          isHeavyRain: true,
          isHighWind: false,
          hazardLevel: 'Flash Flood Hazard',
          alertMessage: 'Monsoon deluge (85mm/hr). Track formation underwater, critical embankment scour alert.',
          badgeColor: 'rose',
          source: 'Simulated Weather Telemetry',
        },
        'TRK-GHY-LMG-08': {
          trackId: 'TRK-GHY-LMG-08',
          location: 'Hojai – Lanka Sector',
          temperature: 24,
          precipitation: 92,
          humidity: 99,
          windSpeed: 52,
          isExtremeHeat: false,
          isHeavyRain: true,
          isHighWind: true,
          hazardLevel: 'Monsoon Landslide Threat',
          alertMessage: 'Heavy downpour (92mm). Hill slope slip hazard on bridge approaches.',
          badgeColor: 'rose',
          source: 'Simulated Weather Telemetry',
        },
      };
      setWeatherOverrides(overrides);
      setActiveSimulation('MONSOON');
      setWeatherMap((prev) => ({ ...prev, ...overrides }));
    } else if (type === 'MICRO_FRACTURE') {
      setTrackSections((prev) =>
        prev.map((t) =>
          t.id === 'TRK-JP-DL-03'
            ? {
                ...t,
                currentCondition: 'Transverse Subsurface Rail Crack Identified near KM 142',
                condition: 'Transverse Subsurface Rail Crack Identified near KM 142',
                riskStatus: 'Critical',
                status: 'Critical',
                riskScore: 94,
                ballastCondition: 'Moderate',
                notes: 'EMERGENCY: USFD diagnostic echo indicates 12mm deep vertical crack on gauge face. Traffic halted.',
              }
            : t
        )
      );
      setActiveSimulation('MICRO_FRACTURE');
    }
  };

  const handleResetSimulation = () => {
    setActiveSimulation(null);
    setWeatherOverrides(null);
    setTrackSections(TRACK_SECTIONS);
    syncWeather(null);
  };

  // --- CRUD HANDLERS FOR TRACK SECTIONS ---
  const handleAddTrackSection = (newSection) => {
    setTrackSections((prev) => [newSection, ...prev]);
  };

  const handleUpdateTrackSection = (updatedSection) => {
    setTrackSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  const handleDeleteTrackSection = (sectionId) => {
    setTrackSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // --- CRUD HANDLERS FOR INSPECTIONS ---
  const handleAddInspection = (newInspection) => {
    setInspections((prev) => [newInspection, ...prev]);
    // Also update the last inspection date on that section!
    if (newInspection.trackSectionId) {
      setTrackSections((prev) =>
        prev.map((t) =>
          t.id === newInspection.trackSectionId
            ? {
                ...t,
                lastInspection: newInspection.inspectionDate,
                currentCondition: newInspection.condition,
                condition: newInspection.condition,
              }
            : t
        )
      );
    }
  };

  const handleUpdateInspection = (updatedInspection) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === updatedInspection.id ? updatedInspection : i))
    );
  };

  const handleDeleteInspection = (inspectionId) => {
    setInspections((prev) => prev.filter((i) => i.id !== inspectionId));
  };

  // --- ALERT RESOLUTION HANDLERS ---
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
  };

  const handleResolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((a) => (a.status === 'Active' ? { ...a, status: 'Acknowledged' } : a))
    );
  };

  // --- DYNAMIC DASHBOARD STATS COMPUTATION ---
  const { dynamicStats, dynamicDistribution, healthIndex, activeAlertsCount } = useMemo(() => {
    let healthyCount = 0;
    let moderateCount = 0;
    let highRiskCount = 0;
    let criticalCount = 0;
    let totalScore = 0;

    trackSections.forEach((t) => {
      const w = weatherMap[t.id];
      const risk = calculateTrackRisk(t, inspections, w);
      totalScore += risk.score;

      if (risk.riskLevel === 'Critical') criticalCount++;
      else if (risk.riskLevel === 'High Risk') highRiskCount++;
      else if (risk.riskLevel === 'Moderate') moderateCount++;
      else healthyCount++;
    });

    const total = trackSections.length || 1;
    const avgScore = Math.round(totalScore / total);
    const healthPercent = Math.max(10, 100 - Math.round(avgScore * 0.7));

    const stats = [
      {
        id: 'total_sections',
        label: 'Total Track Sections',
        value: total,
        unit: 'Monitored',
        change: `${total} Corridors Active`,
        status: 'neutral',
        icon: 'TrainTrack',
        description: 'Permanent Way corridors across operational railway divisions',
        accentColor: 'blue',
      },
      {
        id: 'healthy',
        label: 'Healthy',
        value: healthyCount,
        unit: `${Math.round((healthyCount / total) * 100)}%`,
        change: 'Tolerances Optimal',
        status: 'healthy',
        icon: 'ShieldCheck',
        description: 'Vibration frequency and geometric alignment normal',
        accentColor: 'emerald',
      },
      {
        id: 'observation',
        label: 'Under Observation',
        value: moderateCount,
        unit: `${Math.round((moderateCount / total) * 100)}%`,
        change: 'Ambient or wear alert',
        status: 'observation',
        icon: 'Eye',
        description: 'Scheduled for inspection within 14 days',
        accentColor: 'amber',
      },
      {
        id: 'high_risk',
        label: 'High & Critical Risk',
        value: highRiskCount + criticalCount,
        unit: `${Math.round(((highRiskCount + criticalCount) / total) * 100)}%`,
        change: 'Immediate Action Needed',
        status: 'high_risk',
        icon: 'AlertTriangle',
        description: 'Actionable fatigue or severe weather threshold exceeded',
        accentColor: 'rose',
      },
    ];

    const distribution = [
      {
        level: 'Healthy',
        count: healthyCount,
        percentage: Math.round((healthyCount / total) * 100),
        color: '#10b981',
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/30',
        description: 'Within safe design envelope with zero active safety alarms',
      },
      {
        level: 'Moderate',
        count: moderateCount,
        percentage: Math.round((moderateCount / total) * 100),
        color: '#f59e0b',
        bgClass: 'bg-amber-500',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/30',
        description: 'Early cyclic wear or ambient environmental stress detected',
      },
      {
        level: 'High Risk',
        count: highRiskCount,
        percentage: Math.round((highRiskCount / total) * 100),
        color: '#f97316',
        bgClass: 'bg-orange-500',
        textClass: 'text-orange-400',
        borderClass: 'border-orange-500/30',
        description: 'Vibration divergence or gauge misalignment flagged',
      },
      {
        level: 'Critical',
        count: criticalCount,
        percentage: Math.round((criticalCount / total) * 100),
        color: '#ef4444',
        bgClass: 'bg-rose-500',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-500/30',
        description: 'Severe anomaly or sun-kink risk requiring speed restriction',
      },
    ];

    const activeAlerts = alerts.filter((a) => a.status === 'Active').length;

    return {
      dynamicStats: stats,
      dynamicDistribution: distribution,
      healthIndex: `${healthPercent}%`,
      activeAlertsCount: activeAlerts,
    };
  }, [trackSections, weatherMap, inspections, alerts]);

  // Quick Action Handler
  const handleExecuteAction = (action) => {
    if (action.id === 'view_track_sections' || action.targetModule === 'track_sections') {
      setActiveTab('track_sections');
      return;
    }
    if (action.id === 'add_inspection' || action.targetModule === 'inspections') {
      setActiveTab('inspections');
      return;
    }
    if (action.id === 'analyze_risk' || action.targetModule === 'risk_analysis') {
      setActiveTab('risk_analysis');
      return;
    }
    if (action.id === 'generate_report' || action.targetModule === 'reports') {
      setActiveTab('reports');
      return;
    }

    openModal({
      title: action.title,
      subtitle: action.badge,
      type: 'info',
      content: <p className="text-xs text-slate-300">{action.description}</p>,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. LANDING VIEW */}
      {currentView === 'landing' ? (
        <LandingPage
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLearnMore={() => {
            setCurrentView('dashboard');
            setActiveTab('risk_analysis');
          }}
        />
      ) : (
        /* 2. MAIN DASHBOARD VIEW */
        <div className="flex h-screen overflow-hidden bg-[#0a0f1d]">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            onOpenLanding={() => setCurrentView('landing')}
            trackSectionsCount={trackSections.length}
            inspectionsCount={inspections.length}
            activeAlertsCount={activeAlertsCount}
          />

          {/* Main App Layout */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dashboard Header */}
            <Header
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
              onOpenLanding={() => setCurrentView('landing')}
              onOpenQuickModal={() => setActiveTab('alerts')}
            />

            {/* Scrollable Dashboard Body */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' ? (
                  <DashboardOverview
                    onExecuteAction={handleExecuteAction}
                    onSelectTrack={(t) => setHistoryModalSection(t)}
                    onSelectInspection={() => setActiveTab('inspections')}
                    onTriggerAiModal={() => setActiveTab('risk_analysis')}
                    sections={trackSections}
                    inspections={inspections}
                    alerts={alerts}
                    dynamicStats={dynamicStats}
                    dynamicDistribution={dynamicDistribution}
                    healthIndex={healthIndex}
                    activeSimulation={activeSimulation}
                    onTriggerSimulation={handleTriggerSimulation}
                    onResetSimulation={handleResetSimulation}
                    onViewAllAlerts={() => setActiveTab('alerts')}
                  />
                ) : activeTab === 'track_sections' ? (
                  <TrackSectionsPage
                    sections={trackSections}
                    onAddSection={handleAddTrackSection}
                    onUpdateSection={handleUpdateTrackSection}
                    onDeleteSection={handleDeleteTrackSection}
                    onOpenTrackHistory={(section) => setHistoryModalSection(section)}
                  />
                ) : activeTab === 'inspections' ? (
                  <InspectionsPage
                    inspections={inspections}
                    trackSections={trackSections}
                    onAddInspection={handleAddInspection}
                    onUpdateInspection={handleUpdateInspection}
                    onDeleteInspection={handleDeleteInspection}
                    onViewInspectionDetails={(insp) => {
                      openModal({
                        title: `Inspection Audit ${insp.id}`,
                        subtitle: `${insp.trackSection} (${insp.inspectionDate})`,
                        type: insp.riskLevel === 'Critical' || insp.riskLevel === 'High Risk' ? 'warning' : 'info',
                        content: (
                          <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-lg bg-[#0b1120] border border-slate-800 space-y-1">
                              <div>Inspector: <strong className="text-white">{insp.inspector}</strong></div>
                              <div>Testing Methodology: <span className="text-slate-300">{insp.method}</span></div>
                              <div>Condition Diagnosis: <span className="text-white font-semibold">{insp.condition}</span></div>
                              <div>Defects Noted: <span className="text-amber-300">{insp.defects || 'None'}</span></div>
                              <div>Status: <span className="text-emerald-400 font-bold">{insp.status}</span></div>
                            </div>
                            <p className="text-slate-300 italic bg-slate-900/60 p-3 rounded border border-slate-800">
                              "{insp.notes}"
                            </p>
                          </div>
                        ),
                      });
                    }}
                  />
                ) : activeTab === 'weather_environment' ? (
                  <WeatherPage
                    trackSections={trackSections}
                    weatherMap={weatherMap}
                    isLoadingWeather={isLoadingWeather}
                    onRefreshWeather={() => syncWeather(weatherOverrides)}
                  />
                ) : activeTab === 'risk_analysis' ? (
                  <RiskAnalysisPage
                    trackSections={trackSections}
                    inspections={inspections}
                    weatherMap={weatherMap}
                  />
                ) : activeTab === 'alerts' ? (
                  <AlertsPage
                    alerts={alerts}
                    onAcknowledgeAlert={handleAcknowledgeAlert}
                    onResolveAlert={handleResolveAlert}
                    onAcknowledgeAll={handleAcknowledgeAll}
                  />
                ) : activeTab === 'reports' ? (
                  <ReportsPage
                    trackSections={trackSections}
                    inspections={inspections}
                    weatherMap={weatherMap}
                    alerts={alerts}
                  />
                ) : (
                  <ModulePlaceholder
                    activeTab={activeTab}
                    onReturnToDashboard={() => setActiveTab('dashboard')}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Global Info / Dialog Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        type={modalConfig.type}
      >
        {modalConfig.content}
      </Modal>

      {/* Track Health History Modal */}
      <TrackHistoryModal
        isOpen={Boolean(historyModalSection)}
        onClose={() => setHistoryModalSection(null)}
        trackSection={historyModalSection}
        inspections={inspections}
      />
    </div>
  );
}
