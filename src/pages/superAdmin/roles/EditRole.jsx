import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RoleForm from '../../../components/forms/RoleForm';
import { ArrowLeft } from 'lucide-react';


export default function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockRole = {
        name: 'Regional Store Director',
        slug: 'regional_store_director',
        description: 'Oversees store operations across multiple locations and manages store managers.'
      };
      
      setFormData(mockRole);
      setIsLoading(false);
    }, 600);
  }, [id]);

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

    const updatedRole = {
      id: parseInt(id),
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      usersCount: 0,
      permissions: []
    };

    console.log('Updating role:', updatedRole);
    setIsSubmitting(false);
    navigate('/super-admin/roles');
  };

  const handleCancel = () => {
    navigate('/super-admin/roles');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Update Role</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
             Update role details.
          </p>
        </div>
      </div>
    <RoleForm
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      submitButtonText="Update Role"
    />
     </div>
  );
}