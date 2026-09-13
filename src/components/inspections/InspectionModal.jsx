import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, Save, AlertTriangle, Calendar, UserCheck, Activity, Search } from 'lucide-react';

export default function InspectionModal({
  isOpen,
  onClose,
  onSave,
  trackSections = [],
  initialData = null,
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    id: '',
    trackSectionId: '',
    trackSection: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspector: 'Er. R. K. Inspector (SSE / P-Way)',
    method: 'Ultrasonic Flaw Detection (USFD)',
    condition: 'Optimal Geometry / Nominal Wear',
    defects: 'None detected / within tolerances',
    defectSeverity: 'None',
    riskLevel: 'Healthy',
    status: 'Verified Safe',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        trackSectionId: initialData.trackSectionId || '',
        trackSection: initialData.trackSection || '',
        inspectionDate: initialData.inspectionDate || new Date().toISOString().split('T')[0],
        inspector: initialData.inspector || 'Er. R. K. Inspector (SSE / P-Way)',
        method: initialData.method || 'Ultrasonic Flaw Detection (USFD)',
        condition: initialData.condition || '',
        defects: initialData.defects || 'None detected / within tolerances',
        defectSeverity: initialData.defectSeverity || 'None',
        riskLevel: initialData.riskLevel || 'Healthy',
        status: initialData.status || 'Verified Safe',
        notes: initialData.notes || '',
      });
    } else {
      const randomId = `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultTrack = trackSections[0] || {};
      setFormData({
        id: randomId,
        trackSectionId: defaultTrack.id || '',
        trackSection: defaultTrack.name || 'Delhi–Agra Section',
        inspectionDate: new Date().toISOString().split('T')[0],
        inspector: 'Er. R. K. Inspector (SSE / P-Way)',
        method: 'Ultrasonic Flaw Detection (USFD)',
        condition: 'Optimal Geometry / Nominal Wear',
        defects: 'None detected / within tolerances',
        defectSeverity: 'None',
        riskLevel: 'Healthy',
        status: 'Verified Safe',
        notes: 'Track tested with standard ultrasonic transducer probe. Transverse fatigue markers nominal.',
      });
    }
    setErrors({});
  }, [initialData, isOpen, trackSections]);

  if (!isOpen) return null;

  const handleTrackChange = (e) => {
    const selectedId = e.target.value;
    const found = trackSections.find((t) => t.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      trackSectionId: selectedId,
      trackSection: found ? found.name : prev.trackSection,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.trackSection) newErrors.trackSection = 'Track section is required';
    if (!formData.inspector.trim()) newErrors.inspector = 'Inspector name is required';
    if (!formData.inspectionDate) newErrors.inspectionDate = 'Inspection date is required';
    if (!formData.condition.trim()) newErrors.condition = 'Track condition is required';
    if (!formData.defects.trim()) newErrors.defects = 'Defects field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(initialData || {}),
      ...formData,
      trackCode: trackSections.find((t) => t.id === formData.trackSectionId)?.code || formData.trackSectionId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEdit ? 'Edit Inspection Record' : 'Log New Track Inspection'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit
                  ? `Updating report ${formData.id}`
                  : 'Document ultrasonic flaw detection, track gauge, or visual walk report'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          {/* Row 1: Track Section & Inspection ID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1.5">
                Target Track Section <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.trackSectionId}
                onChange={handleTrackChange}
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                {trackSections.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#111827]">
                    {t.name} ({t.id})
                  </option>
                ))}
              </select>
              {errors.trackSection && <p className="text-rose-400 mt-1 text-[11px]">{errors.trackSection}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Inspection ID
              </label>
              <input
                type="text"
                disabled
                value={formData.id}
                className="w-full px-3 py-2 font-mono rounded-lg border bg-[#0b1120] text-slate-400 border-slate-800 opacity-70 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 2: Inspection Date & Inspector Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Inspection Date <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
              {errors.inspectionDate && <p className="text-rose-400 mt-1 text-[11px]">{errors.inspectionDate}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Inspector & Designation <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <UserCheck className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  placeholder="e.g. Er. R. K. Inspector (SSE / P-Way)"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
              {errors.inspector && <p className="text-rose-400 mt-1 text-[11px]">{errors.inspector}</p>}
            </div>
          </div>

          {/* Row 3: Method & Defect Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Testing Methodology <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="Ultrasonic Flaw Detection (USFD)">Ultrasonic Flaw Detection (USFD)</option>
                <option value="Digital Track Gauge & Profiler">Digital Track Gauge & Profiler</option>
                <option value="Comprehensive OMS-2000 Run">Comprehensive OMS-2000 Recording Car</option>
                <option value="Visual Foot Patrol & Torque Check">Visual Foot Patrol & Torque Check</option>
                <option value="Drone Embankment & LiDAR Scan">Drone Embankment & LiDAR Scan</option>
                <option value="Acoustic Bearing & Rail Monitor">Acoustic Bearing & Rail Monitor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Defect Severity Tier
              </label>
              <select
                value={formData.defectSeverity}
                onChange={(e) => {
                  const sev = e.target.value;
                  const autoRisk =
                    sev === 'Critical'
                      ? 'Critical'
                      : sev === 'Severe'
                      ? 'High Risk'
                      : sev === 'Medium'
                      ? 'Moderate'
                      : 'Healthy';
                  const autoStatus =
                    sev === 'Critical' || sev === 'Severe'
                      ? 'Immediate Action Required'
                      : sev === 'Medium'
                      ? 'Scheduled for Re-tamping'
                      : 'Verified Safe';
                  setFormData({
                    ...formData,
                    defectSeverity: sev,
                    riskLevel: autoRisk,
                    status: autoStatus,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="None">None (Optimal / Within Tolerances)</option>
                <option value="Low">Low (Surface polishing / Minor wear)</option>
                <option value="Medium">Medium (Joint gap variance / Fastener slack)</option>
                <option value="Severe">Severe (Embankment settlement / 4mm divergence)</option>
                <option value="Critical">Critical (Rail micro-fracture / Slope displacement)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Condition & Specific Defects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Track Condition Summary <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                placeholder="e.g. Expansion Joint Variance near KM 88"
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              />
              {errors.condition && <p className="text-rose-400 mt-1 text-[11px]">{errors.condition}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Specific Defects Noted <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.defects}
                onChange={(e) => setFormData({ ...formData, defects: e.target.value })}
                placeholder="e.g. Ballast settling, thermal gap widening"
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              />
              {errors.defects && <p className="text-rose-400 mt-1 text-[11px]">{errors.defects}</p>}
            </div>
          </div>

          {/* Row 5: Risk Level & Action Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Risk Classification
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="Healthy">Healthy</option>
                <option value="Moderate">Moderate</option>
                <option value="High Risk">High Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Action Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="Verified Safe">Verified Safe</option>
                <option value="Maintenance Queued">Maintenance Queued</option>
                <option value="Scheduled for Re-tamping">Scheduled for Re-tamping</option>
                <option value="Immediate Action Required">Immediate Action Required</option>
              </select>
            </div>
          </div>

          {/* Row 6: Detailed Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Technical Audit Findings & Recommendations
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter ultrasonic wave telemetry observations, sleeper fastener tightness, or ballast profile notes..."
              className="w-full px-3 py-2 rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Record Changes' : 'Log Inspection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
