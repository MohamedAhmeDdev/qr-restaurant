import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PermissionForm from '../../../components/forms/PermissionForm';


export default function EditPermission() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    group: '',
    slug: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockPermission = {
        name: 'Export Financial Reports',
        group: 'Analytics',
        slug: 'export_reports',
        description: 'Allows users to export financial reports in various formats'
      };
      
      setFormData(mockPermission);
      setIsLoading(false);
    }, 600);
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.group.trim()) newErrors.group = 'Group is required.';
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

  
      setIsSubmitting(false);
      navigate('/super-admin/permissions');
  
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-slate-400">Loading permission data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div>
        <Link 
          to="/super-admin/permissions" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Permissions Directory
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Edit Permission</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            Update permission details.
          </p>
        </div>
      </div>

      <PermissionForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Permission"
      />
    </div>
  );
}