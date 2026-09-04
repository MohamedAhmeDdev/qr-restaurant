import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import ModifierGroupForm from '../../../components/forms/ModifierGroupsForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function EditModifierGroup() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_select: 0,
    max_select: 1,
    is_required: false,
    is_active: true,
    options: [{ name: '', price: '0.00', is_available: true }],
  });

  const fetchModifierGroup = useCallback(async () => {
    try {
      const response = await api.get(`/modifier-groups/${id}`);
      const data = response.data?.data;

      setFormData({
        name: data.name || '',
        description: data.description || '',
        min_select: data.min_select ?? 0,
        max_select: data.max_select ?? 1,
        is_required: data.is_required ?? false,
        is_active: data.is_active ?? true,
        options: data.options?.length
          ? data.options.map(o => ({
              name: o.name || '',
              price: String(o.price || 0),
              is_available: o.is_available !== false,
            }))
          : [{ name: '', price: '0.00', is_available: true }],
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }, [id]);

  useEffect(() => {
    fetchModifierGroup();
  }, [fetchModifierGroup]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Modifier group name is required';
    if (formData.min_select < 0) newErrors.min_select = 'Min selection must be 0 or greater';
    if (formData.max_select < 1) newErrors.max_select = 'Max selection must be at least 1';
    if (formData.max_select < formData.min_select) {
      newErrors.max_select = 'Max selection must be greater than or equal to min selection';
    }
    if (!formData.options?.length || formData.options.some(opt => !opt.name?.trim())) {
      newErrors.options = 'All options must have a name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        min_select: formData.min_select,
        max_select: formData.max_select,
        is_required: formData.is_required,
        is_active: formData.is_active,
        options: formData.options.map(opt => ({
          name: opt.name.trim(),
          price: parseFloat(opt.price) || 0,
          is_available: opt.is_available !== false,
        })),
      };

      const response = await api.put(`/modifier-groups/${id}`, payload);
      toast.success(response?.data?.message);
      navigate('/modifier-groups');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/modifier-groups');
  };

  return (
    <div className="p-1 md:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center gap-4 pb-2 border-b border-gray-200/60 dark:border-slate-800">
        <button 
          onClick={handleCancel}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm transition-all active:scale-95"
          title="Back to Modifier Groups"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Edit Modifier Group</h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <Edit3 className="w-3 h-3" /> Editing
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Update modifier group details and configuration.</p>
        </div>
      </div>

      <ModifierGroupForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Update Modifier Group"
        isEdit={true}
      />
    </div>
  );
}