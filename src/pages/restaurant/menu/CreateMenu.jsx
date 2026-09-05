import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import MenuForm from '../../../components/forms/MenuForm';

export default function CreateMenu() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null); 

const [formData, setFormData] = useState({
  name: '',
  category_id: '',
  price: '',
  description: '',
  is_available:  false,
  is_active:  false, 
  image: null,
  modifier_groups: [],
});

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Menu item name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    // Optionally validate image
    if (!formData.image && !imagePreview) {
      newErrors.image = 'Menu item image is required';
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
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('description', formData.description?.trim());
     formDataToSend.append('is_available', formData.is_available ? 1 : 0);
    formDataToSend.append('is_active', formData.is_active ? 1 : 0);

      if (Array.isArray(formData.modifier_groups)) {
        formData.modifier_groups.forEach((groupId) => {
          formDataToSend.append('modifier_groups[]', groupId);
        });
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post('/menu-items', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response?.data?.message);
      navigate('/menu-items');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-1 md:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex items-center gap-4 pb-2 border-b border-gray-200/60 dark:border-slate-800">
        <button
          onClick={() => navigate('/menu-items')}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm transition-all active:scale-95"
          title="Back to Menu Items"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Add New Menu Item
            </h1>
          </div>
        </div>
      </div>

      <MenuForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/menu-items')}
        isSubmitting={isSubmitting}
        submitButtonText="Create Menu Item"
      />
    </div>
  );
}