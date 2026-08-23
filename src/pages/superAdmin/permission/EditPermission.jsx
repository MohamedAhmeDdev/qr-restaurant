import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PermissionForm from '../../../components/forms/PermissionForm';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function EditPermission() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    group: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch permission details on mount
  const fetchPermission = async () => {
    try {
      const response = await api.get(`/permissions/${id}`);
      const data = response.data?.data;

      setFormData({
        name: data.name,
        group: data.group,
        description: data.description
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
      navigate('/permissions');
    }
  };

  useEffect(() => {
    if (id) fetchPermission();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.group.trim()) newErrors.group = 'Group is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const response = await api.put(`/permissions/${id}`, formData);
      toast.success(response.data.message);
      navigate('/permissions');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div>
        <Link
          to="/permissions"
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