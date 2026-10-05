import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TableForm from '../../../components/forms/TableForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function EditTable() {
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    table_number: '',
    capacity: '',
    is_active: '',
  });

  const fetchTable = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/tables/${id}`);
      const data = response.data?.data

      setFormData({
        name: data.name,
        table_number: data.table_number,
        capacity: data.capacity,
        is_active: data.is_active !== undefined ? String(data.is_active) : '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Table name is required';
    if (!formData.table_number) newErrors.table_number = 'Table number is required';
    else if (formData.table_number < 1) newErrors.table_number = 'Table number must be at least 1';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    else if (formData.capacity > 20) newErrors.capacity = 'Capacity cannot exceed 20';
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
        is_active: formData.is_active === 'true'
      };

      const response = await api.put(`/tables/${id}`, payload);
      toast.success(response?.data?.message);
      navigate(`${basePath}/table`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return <LoadingScreen label="Loading table details..." />;
  }


  return (
    <div className="p-1 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">

      <TableForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Table"
        isEdit={true}
      />
    </div>
  );
}