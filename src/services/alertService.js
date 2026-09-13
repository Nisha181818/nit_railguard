/**
 * Automated Safety Alert Engine for RailGuard
 * Scans track risks, weather hazards, and inspection defects
 * to synthesize real-time railway alerts with acknowledgment workflows.
 */

import { calculateTrackRisk } from './riskEngine';

export function generateAutomatedAlerts(trackSections = [], weatherMap = {}, inspections = []) {
  const alerts = [];
  let alertCounter = 1;

  trackSections.forEach((track) => {
    const weather = weatherMap[track.id];
    const risk = calculateTrackRisk(track, inspections, weather);

    // 1. Critical Risk Alert
    if (risk.riskLevel === 'Critical') {
      alerts.push({
        id: `ALT-CRIT-${String(alertCounter++).padStart(3, '0')}`,
        trackId: track.id,
        trackName: track.name,
        severity: 'Critical',
        type: 'STRUCTURAL_CRITICAL',
        title: `Critical Risk Detected on ${track.name}`,
        message: `Safety risk score escalated to ${risk.score}/100. ${risk.recommendation.advisory}`,
        recommendation: risk.recommendation.action,
        timestamp: 'Just now',
        status: 'Active',
      });
    } else if (risk.riskLevel === 'High Risk') {
      alerts.push({
        id: `ALT-WARN-${String(alertCounter++).padStart(3, '0')}`,
        trackId: track.id,
        trackName: track.name,
        severity: 'Warning',
        type: 'STRUCTURAL_HIGH',
        title: `High Risk Threshold Flagged on ${track.name}`,
        message: `Structural fatigue index at ${risk.score}/100. Inspection required within 24 hours.`,
        recommendation: risk.recommendation.action,
        timestamp: '12 mins ago',
        status: 'Active',
      });
    }

    // 2. Weather Extreme Alerts
    if (weather && weather.isExtremeHeat) {
      alerts.push({
        id: `ALT-WEATH-${String(alertCounter++).padStart(3, '0')}`,
        trackId: track.id,
        trackName: track.name,
        severity: 'Critical',
        type: 'WEATHER_HEAT',
        title: `Sun-Kink Hazard: Extreme Rail Temp (${weather.temperature}°C)`,
        message: `Ambient heat wave in ${track.startLocation} sector exceeds rail neutral temp. High risk of track buckling.`,
        recommendation: 'Enforce Daylight Speed Restriction (TSR 50 km/h)',
        timestamp: '25 mins ago',
        status: 'Active',
      });
    }

    if (weather && weather.isHeavyRain) {
      alerts.push({
        id: `ALT-WEATH-${String(alertCounter++).padStart(3, '0')}`,
        trackId: track.id,
        trackName: track.name,
        severity: 'Warning',
        type: 'WEATHER_RAIN',
        title: `Monsoon Deluge: Ballast Scour Warning (${weather.precipitation}mm)`,
        message: `Heavy rainfall rate risks track bed scouring along ${track.name} embankment.`,
        recommendation: 'Deploy Monsoon Patrol Foot Gang',
        timestamp: '40 mins ago',
        status: 'Active',
      });
    }
  });

  // 3. Inspection Defect Alerts
  inspections.forEach((insp) => {
    if (insp.defectSeverity === 'Critical' || insp.defectSeverity === 'Severe') {
      alerts.push({
        id: `ALT-INSP-${String(alertCounter++).padStart(3, '0')}`,
        trackId: insp.trackSectionId,
        trackName: insp.trackSection,
        severity: insp.defectSeverity === 'Critical' ? 'Critical' : 'Warning',
        type: 'DEFECT_ANOMALY',
        title: `USFD Anomaly: ${insp.condition}`,
        message: `Inspector ${insp.inspector} flagged: "${insp.defects}".`,
        recommendation: insp.status,
        timestamp: insp.inspectionDate,
        status: 'Active',
      });
    }
  });

  return alerts;
}
