import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RoleForm from '../../../components/forms/RoleForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial role details from backend
  const fetchRole = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/roles/${id}`);
      const data = response.data?.data;

      setFormData({
        name: data.name,
        description: data.description
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  // Form field change handler
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
      const response = await api.put(`/roles/${id}`, payload);
      toast.success(response?.data?.message);
      navigate('/roles');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div>
        <Link
          to="/roles"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Update Role
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            Modify role details and core system identifiers.
          </p>
        </div>
      </div>


   
        <RoleForm
          formData={formData}
          setFormData={handleFormChange}
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