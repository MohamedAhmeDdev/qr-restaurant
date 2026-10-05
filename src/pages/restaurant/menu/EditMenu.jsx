import React, { useState, useEffect, useCallback } from 'react';
import {useParams } from 'react-router-dom';
import MenuForm from '../../../components/forms/MenuForm';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import LoadingScreen from '../../../components/common/LoadingScreen';


export default function EditMenu() {
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

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

  const fetchMenuItem = useCallback(async () => {
    try {
        setIsLoading(true);
      const response = await api.get(`/menu-items/${id}`);
      const data = response.data?.data;

      const groupIds = Array.isArray(data.modifier_groups)
        ? data.modifier_groups.map((group) => (typeof group === 'object' ? group.id : Number(group)))
        : [];

      setFormData({
        name: data.name,
        category_id: data.category_id,
        price: data.price ? String(data.price) : '',
        description: data.description,
        is_available: data.is_available,
        image: null,
        modifier_groups: groupIds,
       is_active: Boolean(Number(data.is_active)),
      });

      // Set preview using the utility function
      if (data.image) {
        setImagePreview(getImageUrl(data.image));
      } else {
        setImagePreview(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMenuItem();
  }, [fetchMenuItem]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Menu item name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
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
      formDataToSend.append('_method', 'PUT');
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      formDataToSend.append('description', formData.description?.trim() || '');
      formDataToSend.append('is_available', formData.is_available ? '1' : '0');
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');

      if (Array.isArray(formData.modifier_groups)) {
        formData.modifier_groups.forEach((groupId) => {
          formDataToSend.append('modifier_groups[]', groupId);
        });
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post(`/menu-items/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response?.data?.message);
      navigate(`${basePath}/menu-items`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };


    if (isLoading) {
      return <LoadingScreen label="Loading menu item details..." />;
    }

  return (
    <div className="p-1 md:p-4 max-w-4xl mx-auto min-h-screen space-y-6 bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <MenuForm
        formData={formData}
        setFormData={setFormData}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Menu Item"
        isEdit={true}
      />
    </div>
  );
}