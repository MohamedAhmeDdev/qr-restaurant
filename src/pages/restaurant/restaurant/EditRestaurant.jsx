import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RestaurantForm from '../../../components/forms/RestaurantForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function EditRestaurant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    status: 'active',
    removeLogo: false,
  });

  const fetchRestaurant = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/restaurants/${id}`);
      const data = response.data?.data;

      setFormData({
        name: data.name,
        status: data.status,
        logo: null,
        removeLogo: false,
      });

      const logoUrl = data.logo;
      const baseURL = import.meta.env.VITE_API_URL
      if (logoUrl) {
        setImagePreview(`${baseURL}${logoUrl}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('status', formData.status);

      // Method spoofing to ensure backend receives multipart headers cleanly
      formDataToSend.append('_method', 'PUT');

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      if (formData.removeLogo) {
        formDataToSend.append('remove_logo', '1');
      }

      // Send as POST for multipart handling compatibility
      const response = await api.post(`/restaurants/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response?.data?.message);
      navigate('/restaurant');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/restaurant');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-slate-400">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 md:p-10 transition-colors">
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2.5 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Edit Restaurant
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Update restaurant details and branding.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <RestaurantForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Update Restaurant"
          isEdit={true}
        />
      </div>
    </div>
  );
}