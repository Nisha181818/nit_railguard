import React, { useState, useEffect } from 'react';
import { X, TrainTrack, Save, AlertCircle, MapPin, Calendar, Activity, Check } from 'lucide-react';

export default function TrackSectionModal({
  isOpen,
  onClose,
  onSave,
  initialData = null, // if provided, we are editing; otherwise adding
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    startLocation: '',
    endLocation: '',
    trackLength: '',
    lastInspection: new Date().toISOString().split('T')[0],
    currentCondition: 'Optimal Geometry / Nominal Wear',
    riskStatus: 'Healthy',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        startLocation: initialData.startLocation || '',
        endLocation: initialData.endLocation || '',
        trackLength: initialData.trackLength ? String(initialData.trackLength).replace(/[^0-9.]/g, '') : (initialData.lengthKm ? String(initialData.lengthKm) : ''),
        lastInspection: initialData.lastInspection || new Date().toISOString().split('T')[0],
        currentCondition: initialData.currentCondition || initialData.condition || 'Optimal Geometry / Nominal Wear',
        riskStatus: initialData.riskStatus || initialData.status || 'Healthy',
        notes: initialData.notes || '',
      });
    } else {
      // Auto-generate a clean ID prefix for a new track
      const randomNum = Math.floor(10 + Math.random() * 90);
      setFormData({
        id: `TRK-SEC-${randomNum}`,
        name: '',
        startLocation: '',
        endLocation: '',
        trackLength: '',
        lastInspection: new Date().toISOString().split('T')[0],
        currentCondition: 'Optimal Geometry / Nominal Wear',
        riskStatus: 'Healthy',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.id.trim()) newErrors.id = 'Section ID is required';
    if (!formData.name.trim()) newErrors.name = 'Track/Route Name is required';
    if (!formData.startLocation.trim()) newErrors.startLocation = 'Start Location is required';
    if (!formData.endLocation.trim()) newErrors.endLocation = 'End Location is required';
    if (!formData.trackLength || isNaN(formData.trackLength) || Number(formData.trackLength) <= 0) {
      newErrors.trackLength = 'Valid length in km is required';
    }
    if (!formData.lastInspection) newErrors.lastInspection = 'Inspection date is required';
    if (!formData.currentCondition.trim()) newErrors.currentCondition = 'Current condition is required';
    if (!formData.riskStatus) newErrors.riskStatus = 'Risk status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numLength = parseFloat(formData.trackLength);
    const riskScoreMap = {
      Healthy: 15,
      'Under Observation': 45,
      'High Risk': 75,
      Critical: 95,
    };

    const sectionToSave = {
      ...(initialData || {}),
      id: formData.id.trim(),
      name: formData.name.trim(),
      startLocation: formData.startLocation.trim(),
      endLocation: formData.endLocation.trim(),
      lengthKm: numLength,
      trackLength: `${numLength} km`,
      lastInspection: formData.lastInspection,
      currentCondition: formData.currentCondition.trim(),
      riskStatus: formData.riskStatus,
      status: formData.riskStatus,
      riskLevel:
        formData.riskStatus === 'Healthy'
          ? 'Low'
          : formData.riskStatus === 'Under Observation'
          ? 'Moderate'
          : formData.riskStatus === 'High Risk'
          ? 'High'
          : 'Critical',
      riskScore: riskScoreMap[formData.riskStatus] || 25,
      location: `${formData.startLocation} – ${formData.endLocation}`,
      notes: formData.notes.trim() || 'Track section registered under inspector monitoring cycle.',
    };

    onSave(sectionToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrainTrack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEdit ? 'Edit Track Section' : 'Add New Railway Track Section'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit
                  ? `Modifying parameters for ${formData.id}`
                  : 'Register a new infrastructure corridor into RailGuard monitoring'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Row 1: Section ID & Route Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                disabled={isEdit}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. TRK-DL-AGR-01"
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border bg-[#0b1120] text-slate-200 focus:outline-none ${
                  isEdit ? 'opacity-60 cursor-not-allowed border-slate-800' : 'border-slate-700 focus:border-blue-500'
                } ${errors.id ? 'border-rose-500' : ''}`}
              />
              {errors.id && <p className="text-[11px] text-rose-400 mt-1">{errors.id}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Track / Route Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mumbai–Pune Expressway Section"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                  errors.name ? 'border-rose-500' : ''
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Row 2: Start Location & End Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Location <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.startLocation}
                  onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                  placeholder="e.g. Mumbai CSMT (CSMT)"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                    errors.startLocation ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.startLocation && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.startLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Location <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.endLocation}
                  onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                  placeholder="e.g. Pune Junction (PUNE)"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                    errors.endLocation ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.endLocation && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.endLocation}</p>
              )}
            </div>
          </div>

          {/* Row 3: Track Length & Last Inspection Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Track Length (in Kilometers) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.trackLength}
                  onChange={(e) => setFormData({ ...formData, trackLength: e.target.value })}
                  placeholder="e.g. 192.5"
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                    errors.trackLength ? 'border-rose-500' : ''
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  KM
                </span>
              </div>
              {errors.trackLength && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.trackLength}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Last Inspection Date <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={formData.lastInspection}
                  onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                    errors.lastInspection ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.lastInspection && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.lastInspection}</p>
              )}
            </div>
          </div>

          {/* Row 4: Current Condition & Risk Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Condition <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.currentCondition}
                onChange={(e) => setFormData({ ...formData, currentCondition: e.target.value })}
                placeholder="e.g. Optimal Geometry / Fasteners Intact"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 ${
                  errors.currentCondition ? 'border-rose-500' : ''
                }`}
              />
              {errors.currentCondition && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.currentCondition}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Risk Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.riskStatus}
                onChange={(e) => setFormData({ ...formData, riskStatus: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="Healthy">Healthy (Optimal tolerances)</option>
                <option value="Under Observation">Under Observation (Minor wear)</option>
                <option value="High Risk">High Risk (Elevated stress)</option>
                <option value="Critical">Critical (Immediate restriction needed)</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Inspector Notes & Structural Observations
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Ballast bed stable, USFD ultrasound car scheduled next week..."
              className="w-full px-3 py-2 text-xs rounded-lg border bg-[#0b1120] text-slate-200 border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Form Actions Footer */}
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
              <span>{isEdit ? 'Save Changes' : 'Create Track Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
