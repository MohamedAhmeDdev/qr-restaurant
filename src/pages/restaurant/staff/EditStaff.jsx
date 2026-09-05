import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StaffForm from '../../../components/forms/StaffForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function EditStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    shift_type: '',
  });

const fetchStaff = useCallback(async () => {
  try {
    const response = await api.get(`/staff/${id}`);
    const data = response.data?.data;
    console.log(response);
    
    setFormData({
      name: data.name,
      email: data.email,
     role_id: data.role?.id,
      status: data.status,
      shift_type: data.shift_type,
    });
  } catch (err) {
    toast.error(err.response?.data?.message);
    navigate('/staff');
  }
}, [id, navigate]);

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

  if (!formData.role?.trim()) {
    newErrors.role = 'Role is required';
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
      navigate('/staff');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/staff');
  };



  return (
    <div className="p-1 sm:p-4 max-w-3xl mx-auto space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={handleCancel}
            className="p-2.5 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Edit Staff Member</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Update employee details and permissions.</p>
          </div>
        </div>

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