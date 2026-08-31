import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import CategoryForm from '../../../components/forms/CategoryForm';

export default function CreateCategory() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: '',
    is_active: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Category name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (formData.sort_order === '' || formData.sort_order === null) {
      newErrors.sort_order = 'Sort order is required';
    } else if (formData.sort_order < 0) {
      newErrors.sort_order = 'Sort order must be 0 or greater';
    } else if (formData.sort_order > 999) {
      newErrors.sort_order = 'Sort order cannot exceed 999';
    }
    if (formData.is_active === '') newErrors.is_active = 'Active status is required';
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
        description: formData.description.trim(),
        sort_order: parseInt(formData.sort_order),
        is_active: formData.is_active === 'true'
      };

      const response = await api.post('/categories', payload);
      toast.success(response?.data?.message);
      navigate('/categories');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  return (
    <div className="p-1 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
   
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={handleCancel}
            className="p-2.5 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Add New Category</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create a new category and configure its settings.</p>
          </div>
        </div>

        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Create Category"
        />
    </div>
  );
}