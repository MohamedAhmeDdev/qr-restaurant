import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import ModifierGroupForm from '../../../components/forms/ModifierGroupsForm';

export default function CreateModifierGroup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_select: 0,
    max_select: 1,
    is_required: false,
    is_active: false,
    options: [{ name: '', price: '0.00', is_available: false }],
  });

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
        description: formData.description?.trim(),
        min_select: formData.min_select,
        max_select: formData.max_select,
        is_required: Boolean(formData.is_required),
        is_active: Boolean(formData.is_active),
        options: formData.options.map(opt => ({
          name: opt.name.trim(),
          price: parseFloat(opt.price) || 0,
          is_available: opt.is_available !== false,
        })),
      };

      const response = await api.post('/modifier-groups', payload);
      toast.success(response?.data?.message);
      navigate(`${basePath}/modifier-groups`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="p-1 md:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <ModifierGroupForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Modifier Group"
      />
    </div>
  );
}