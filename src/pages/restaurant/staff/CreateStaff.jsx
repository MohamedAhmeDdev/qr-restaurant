import React, { useState } from 'react';
import StaffForm from '../../../components/forms/StaffForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function CreateStaff() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
    status: '',
    shift_type: '',
  });

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

      const response = await api.post('/staff', payload);
      toast.success(response?.data?.message);
       navigate("/app/staff");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-1 sm:p-4 max-w-3xl mx-auto space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <StaffForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Create Staff Member"
        />
    </div>
  );
}