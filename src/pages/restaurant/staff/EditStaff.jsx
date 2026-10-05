import React, { useState, useEffect, useCallback } from 'react';
import {useParams } from 'react-router-dom';
import StaffForm from '../../../components/forms/StaffForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import LoadingScreen from '../../../components/common/LoadingScreen';


export default function EditStaff() {
  const { id } = useParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
    status: '',
    shift_type: '',
  });

const fetchStaff = useCallback(async () => {
  try {
          setIsLoading(true);

    const response = await api.get(`/staff/${id}`);
    const data = response.data?.data;
    
    setFormData({
      name: data.name,
      email: data.email,
     role_id: data.role?.id,
      status: data.status,
      shift_type: data.shift_type,
    });
  } catch (err) {
    toast.error(err.response?.data?.message);
    navigate(`${basePath}/staff`);
  }finally {
      setIsLoading(false);
    }
}, [id, navigate,basePath]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

 const validate = () => {
  const newErrors = {};

  if (!formData.name?.trim()) {
    newErrors.name = 'Full name is required';
  }

  if (!formData.email?.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

  if (!formData.role_id) {
    newErrors.role_id = 'Role is required';
  }

  if (!formData.status?.trim()) {
    newErrors.status = 'Status is required';
  }

  if (!formData.shift_type?.trim()) {
    newErrors.shift_type = 'Shift type is required';
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
        email: formData.email.trim(),
       role_id: formData.role_id,
        status: formData.status,
        shift_type: formData.shift_type
        
      };

      const response = await api.put(`/staff/${id}`, payload);
      toast.success(response?.data?.message);
       navigate(`${basePath}/staff`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading) {
    return <LoadingScreen label="Loading staff details..." />;
  }


  return (
    <div className="p-1 sm:p-4 max-w-3xl mx-auto space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <StaffForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Update Staff Member"
          isEdit={true}
        />
    </div>
  );
}