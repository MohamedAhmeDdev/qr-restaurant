import React, { useState, useEffect } from 'react';
import { UserPlus, Pencil, X, Building2, Shield, Clock, Activity } from 'lucide-react';

export default function StaffFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingMember = null,
  restaurants = [],
  roles = [],
  errors = {},
  isSubmitting = false,
  setErrors = () => {}, 
}) {
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [shiftType, setShiftType] = useState('');
  
  // FIX: Single value instead of an array
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        setStaffName(editingMember.name);
        setStaffEmail(editingMember.email);
        setRoleId(editingMember.role?.id);
        setAccountStatus(editingMember.status);
        setShiftType(editingMember.restaurants?.[0]?.shift_type);

        // FIX: Get the single assigned restaurant ID
        const assignedId = editingMember.restaurants?.[0]?.id;
        setSelectedRestaurantId(assignedId ? String(assignedId) : '');
      } else {
        setStaffName('');
        setStaffEmail('');
        setRoleId('');
        setAccountStatus('');
        setShiftType('');
        setSelectedRestaurantId('');
      }
    }
  }, [isOpen, editingMember, restaurants]);

  // FIX: Simple dropdown change handler
  const handleRestaurantChange = (e) => {
    setSelectedRestaurantId(e.target.value);
    clearFieldError('restaurant_ids');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: staffName,
      email: staffEmail,
      role_id: roleId,
      status: accountStatus,
      shift_type: shiftType,
      // Wrap in array to satisfy existing backend validation: formData.restaurant_ids.length === 0
      restaurant_ids: selectedRestaurantId ? [selectedRestaurantId] : [],
    }, e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl ring-1 ring-orange-500/20">
              {editingMember ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {editingMember ? 'Edit Staff Profile' : 'Add New Staff Member'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Configure account permissions, assign location, and set schedule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Name & Email Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={staffName}
                onChange={(e) => { setStaffName(e.target.value); clearFieldError('name'); }}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={staffEmail}
                onChange={(e) => { setStaffEmail(e.target.value); clearFieldError('email'); }}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* FIX: Standard Dropdown Select for Single Restaurant */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-orange-500" />
              Assigned Restaurant
            </label>
            <select
              value={selectedRestaurantId}
              onChange={handleRestaurantChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
            {errors.restaurant_ids && <p className="text-[11px] text-rose-500 mt-1">{errors.restaurant_ids}</p>}
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-gray-100 dark:border-slate-800/80">
            
            {/* Role & Permissions Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" /> Role
              </label>
              <select
                value={roleId}
                onChange={(e) => { setRoleId(e.target.value); clearFieldError('role_id'); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.role_id && <p className="text-[11px] text-rose-500 mt-1">{errors.role_id}</p>}
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" /> Status
              </label>
              <select
                value={accountStatus}
                onChange={(e) => { setAccountStatus(e.target.value); clearFieldError('status'); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer capitalize"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && <p className="text-[11px] text-rose-500 mt-1">{errors.status}</p>}
            </div>

            {/* Shift Schedule Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Shift Type
              </label>
              <select
                value={shiftType}
                onChange={(e) => { setShiftType(e.target.value); clearFieldError('shift_type'); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer capitalize"
              >
                <option value="">Select Shift</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
              {errors.shift_type && <p className="text-[11px] text-rose-500 mt-1">{errors.shift_type}</p>}
            </div>
          </div>

          {/* Form Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : editingMember ? (
                'Save Changes'
              ) : (
                'Create Staff Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}