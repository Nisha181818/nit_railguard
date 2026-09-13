/**
 * Explainable Risk Analysis & AI Recommendation Engine for RailGuard
 * Computes deterministic multi-factor railway risk scores (0-100)
 * and generates actionable prescriptive safety advisories.
 */

export function calculateTrackRisk(trackSection, recentInspections = [], weatherData = null) {
  let score = 0;
  const reasons = [];

  // --- FACTOR 1: Track & Ballast Condition (Max 35 pts) ---
  const cond = (trackSection.currentCondition || trackSection.condition || '').toLowerCase();
  const ballast = (trackSection.ballastCondition || '').toLowerCase();

  let conditionScore = 5;
  if (cond.includes('fracture') || cond.includes('critical') || ballast.includes('critical')) {
    conditionScore = 34;
    reasons.push({
      factor: 'Structural Integrity',
      impact: '+34 pts',
      description: 'Severe structural anomaly: Micro-fracture or slope displacement reported.',
      severity: 'critical',
    });
  } else if (cond.includes('settlement') || cond.includes('fatigue') || ballast.includes('degraded')) {
    conditionScore = 28;
    reasons.push({
      factor: 'Embankment & Ballast',
      impact: '+28 pts',
      description: 'Significant embankment fatigue or ballast fouling affecting load distribution.',
      severity: 'high',
    });
  } else if (cond.includes('expansion') || cond.includes('variance') || cond.includes('wear') || ballast.includes('fair') || ballast.includes('moderate')) {
    conditionScore = 16;
    reasons.push({
      factor: 'Mechanical Wear',
      impact: '+16 pts',
      description: 'Moderate expansion joint misalignment or commuter load wear noted.',
      severity: 'moderate',
    });
  } else {
    conditionScore = 4;
    reasons.push({
      factor: 'Geometric Soundness',
      impact: '+4 pts',
      description: 'Nominal rail profile (UIC 60kg) and sound sleeper fasteners within tolerances.',
      severity: 'low',
    });
  }
  score += conditionScore;

  // --- FACTOR 2: Inspection Recency (Max 20 pts) ---
  const lastDate = trackSection.lastInspection ? new Date(trackSection.lastInspection) : new Date();
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now - lastDate) / (1000 * 60 * 60 * 24)));

  let recencyScore = 3;
  if (diffDays > 45) {
    recencyScore = 19;
    reasons.push({
      factor: 'Inspection Overdue',
      impact: '+19 pts',
      description: `Track has not undergone ultrasonic flaw detection in ${diffDays} days (>45 day limit).`,
      severity: 'high',
    });
  } else if (diffDays > 20) {
    recencyScore = 11;
    reasons.push({
      factor: 'Inspection Interval',
      impact: '+11 pts',
      description: `Last field audit logged ${diffDays} days ago; approaching routine cycle deadline.`,
      severity: 'moderate',
    });
  } else {
    recencyScore = 3;
    reasons.push({
      factor: 'Audit Currency',
      impact: '+3 pts',
      description: `Recently audited (${diffDays} days ago); diagnostic USFD records are fresh.`,
      severity: 'low',
    });
  }
  score += recencyScore;

  // --- FACTOR 3: Weather & Environmental Stress (Max 25 pts) ---
  let weatherScore = 4;
  if (weatherData) {
    if (weatherData.isExtremeHeat) {
      weatherScore = 24;
      reasons.push({
        factor: 'Thermal Expansion Hazard',
        impact: '+24 pts',
        description: `Ambient temp ${weatherData.temperature}°C elevates rail temperature to ~55°C (Sun-kink buckling risk).`,
        severity: 'critical',
      });
    } else if (weatherData.isHeavyRain) {
      weatherScore = 20;
      reasons.push({
        factor: 'Monsoon Flood & Scour',
        impact: '+20 pts',
        description: `Rainfall ${weatherData.precipitation}mm/hr risks ballast wash-away and track sub-grade softening.`,
        severity: 'high',
      });
    } else if (weatherData.isHighWind) {
      weatherScore = 12;
      reasons.push({
        factor: 'Gale Wind Shear',
        impact: '+12 pts',
        description: `Wind gusts of ${weatherData.windSpeed} km/h on open track sections.`,
        severity: 'moderate',
      });
    } else {
      weatherScore = 3;
      reasons.push({
        factor: 'Atmospheric Stability',
        impact: '+3 pts',
        description: 'Ambient weather conditions within standard operational tolerance envelope.',
        severity: 'low',
      });
    }
  }
  score += weatherScore;

  // --- FACTOR 4: Traffic Axle Loading Factor (Max 20 pts) ---
  const corridorName = (trackSection.name || '').toLowerCase();
  let trafficScore = 8;
  if (corridorName.includes('delhi') || corridorName.includes('mumbai') || corridorName.includes('howrah')) {
    trafficScore = 16;
    reasons.push({
      factor: 'High-Density Corridor',
      impact: '+16 pts',
      description: 'High daily gross tonnage (GMT) with frequent 25-tonne heavy axle loading freight & express trains.',
      severity: 'moderate',
    });
  } else if (corridorName.includes('hill') || corridorName.includes('lumding')) {
    trafficScore = 18;
    reasons.push({
      factor: 'Terrain Incline Loading',
      impact: '+18 pts',
      description: 'Steep track curvature and braking gradients creating intense lateral rail head thrust.',
      severity: 'high',
    });
  } else {
    trafficScore = 8;
    reasons.push({
      factor: 'Standard Traffic Flow',
      impact: '+8 pts',
      description: 'Balanced passenger and freight frequency under standard axle loading.',
      severity: 'low',
    });
  }
  score += trafficScore;

  // Final Score Normalization (0-100)
  score = Math.min(100, Math.max(5, score));

  // Risk Classification
  let riskLevel = 'Healthy';
  let badgeColor = 'emerald';
  let recommendation = {
    action: 'Routine Inspection',
    urgency: 'Quarterly Cycle',
    advisory: 'Maintain regular track recording car runs and standard periodic visual patrol.',
    badgeColor: 'emerald',
    icon: 'ShieldCheck',
  };

  if (score >= 80) {
    riskLevel = 'Critical';
    badgeColor = 'rose';
    recommendation = {
      action: 'Maintenance Required / Speed Restriction',
      urgency: 'Emergency / Immediate (Within 2 hrs)',
      advisory: 'Impose temporary speed restriction (TSR 30 km/h). Mobilize emergency track maintenance gang & ballast tamper immediately.',
      badgeColor: 'rose',
      icon: 'AlertTriangle',
    };
  } else if (score >= 60) {
    riskLevel = 'High Risk';
    badgeColor = 'orange';
    recommendation = {
      action: 'Immediate Inspection',
      urgency: 'High Priority (Within 24 hrs)',
      advisory: 'Dispatch Senior Section Engineer for on-site USFD rail flaw calibration and gauge alignment check.',
      badgeColor: 'orange',
      icon: 'AlertCircle',
    };
  } else if (score >= 35) {
    riskLevel = 'Moderate';
    badgeColor = 'amber';
    recommendation = {
      action: 'Inspect Soon',
      urgency: 'Moderate Priority (Within 7–14 days)',
      advisory: 'Schedule targeted ultrasonic weld probe and fastener re-torquing during upcoming maintenance window.',
      badgeColor: 'amber',
      icon: 'Clock',
    };
  }

  return {
    score,
    riskLevel,
    badgeColor,
    reasons,
    recommendation,
  };
}
