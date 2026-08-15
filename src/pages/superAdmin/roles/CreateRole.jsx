import React, { useState } from 'react';
import RoleForm from '../../../components/forms/RoleForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateRole({ onCancel, onCreateRole }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required.';
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required.';
    } else if (!/^[a-z0-9_]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and underscores.';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newRole = {
      id: Date.now(),
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      usersCount: 0,
      permissions: []
    };
    
    console.log('Creating role:', newRole);
    if (onCreateRole) onCreateRole(newRole);
    setIsSubmitting(false);
  };

  return (

     <div className="p-2 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div>
        <Link
          to="/super-admin/roles" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Create Permission</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
             Define a new user role for your system.
          </p>
        </div>
      </div>

    <RoleForm
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitButtonText="Save Role"
    />
      </div>
  );
}