import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import CategoryForm from '../../../components/forms/CategoryForm';

export default function CreateCategory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // sort_order: '',
    is_active: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Category name is required';
    // if (formData.sort_order === '' || formData.sort_order === null) {
    //   newErrors.sort_order = 'Sort order is required';
    // } else if (formData.sort_order < 0) {
    //   newErrors.sort_order = 'Sort order must be 0 or greater';
    // } else if (formData.sort_order > 999) {
    //   newErrors.sort_order = 'Sort order cannot exceed 999';
    // }
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
        // sort_order: parseInt(formData.sort_order),
        is_active: formData.is_active === 'true'
      };

      const response = await api.post('/categories', payload);
      toast.success(response?.data?.message);
      navigate(`${basePath}/categories`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-1 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Create Category"
        />
    </div>
  );
}