import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import TableForm from '../../../components/forms/TableForm';

export default function CreateTable() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    table_number: '',
    capacity: '',
    status: '',
    is_active: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Table name is required';
    if (!formData.table_number) newErrors.table_number = 'Table number is required';
    else if (formData.table_number < 1) newErrors.table_number = 'Table number must be at least 1';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    else if (formData.capacity > 20) newErrors.capacity = 'Capacity cannot exceed 20';
    if (!formData.status) newErrors.status = 'Status is required';
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
        table_number: parseInt(formData.table_number),
        capacity: parseInt(formData.capacity),
        status: formData.status,
        is_active: formData.is_active === 'true'
      };

      const response = await api.post('/tables', payload);
      toast.success(response?.data?.message);
      navigate('/table');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/table');
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Add New Table</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create a new dining table and configure its settings.</p>
        </div>
      </div>

      <TableForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Create Table"
      />
    </div>
  );
}