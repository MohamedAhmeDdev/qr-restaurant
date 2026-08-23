import React, { useState } from 'react';
import RoleForm from '../../../components/forms/RoleForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function CreateRole({ onCancel, onCreateRole }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form field update handler
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    try {
      const response = await api.post('/roles', payload);
      const createdRole = response.data?.data;

      if (onCreateRole) {
        onCreateRole(createdRole);
      } else {
        toast.success('Role created successfully');
        navigate('/roles');
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/roles');
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div>
        <Link
          to="/roles"
          onClick={(e) => {
            if (onCancel) {
              e.preventDefault();
              onCancel();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Create Role
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            Define a new user role and its base parameters for your system.
          </p>
        </div>
      </div>

      {/* ROLE FORM COMPONENT */}
      <RoleForm
        formData={formData}
        setFormData={handleFormChange}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Save Role"
      />
    </div>
  );
}