import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RestaurantForm from '../../../components/forms/RestaurantForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';

export default function CreateRestaurant() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    logo: null,
    currency: '',
    background_image: null,
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    if (!formData.currency) newErrors.currency = 'Currency is required.';

    // Enforce file uploads if they haven't been provided or pre-loaded
    if (!formData.logo && !imagePreview) {
      newErrors.logo = 'Restaurant logo is required.';
    }
    if (!formData.background_image && !bgImagePreview) {
      newErrors.background_image = 'Background image is required.';
    }

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
      formDataToSend.append('currency', formData.currency);

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      if (formData.background_image) {
        formDataToSend.append('background_image', formData.background_image);
      }

      const response = await api.post('/restaurants', formDataToSend, {
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

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCancel}
            className="p-2.5  text-gray-600 dark:text-slate-300 active:scale-[0.98]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Add New Restaurant
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Register a new location and set up its initial profile.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <RestaurantForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          bgImagePreview={bgImagePreview}
          setBgImagePreview={setBgImagePreview}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Create Restaurant"
        />
      </div>
    </div>
  );
}