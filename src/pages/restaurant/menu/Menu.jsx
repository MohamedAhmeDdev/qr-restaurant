import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Image as ImageIcon,
  UtensilsCrossed,
  Edit,
  ArrowUpDown,
  Power,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import StatusBadge from '../../../components/StatusBadge';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import Table from '../../../components/Table';
import CategoriesService from '../../../services/categories';
import { useFormatPrice } from '../../../contexts/useFormatPrice';

export default function MenuTable() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
const formatPrice = useFormatPrice();
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // UI & Action States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table Column Definitions
  const columns = [
    // {
    //   label: (
    //     <div className="flex items-center gap-1">
    //       <ArrowUpDown className="w-3 h-3" />
    //       <span>Order</span>
    //     </div>
    //   )
    // },
    { label: 'Item Details' },
    { label: 'Description' },
    { label: 'Category' },
    { label: 'Price' },
    { label: 'Availability' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' },
  ];

  useEffect(() => {
  CategoriesService.getCategories()
    .then((data) => setCategories(data || []))
    .catch((err) => {;
    setError(err.response?.data?.message); 
    });
}, []);

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: currentPage,
      per_page: 15,
    };

    if (selectedCategory !== 'all') {
      params.category_id = selectedCategory;
    }

    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }

    try {
      const res = await api.get('/menu-items', { params });
      const paginatedData = res.data.data;

      setItems(paginatedData.data || []);
      setCurrentPage(paginatedData.current_page || 1);
      setLastPage(paginatedData.last_page || 1);
      setTotalItems(paginatedData.total || 0);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleFilterChange = (filterLabel) => {
    setCurrentPage(1);
    if (filterLabel === 'All Items') {
      setSelectedCategory('all');
    } else {
      const category = categories.find((cat) => cat.name === filterLabel);
      setSelectedCategory(category ? category.id.toString() : 'all');
    }
  };

  const handleSearchChange = (query) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const filterLabels = ['All Items', ...categories.map((cat) => cat.name)];

  const getActiveFilterLabel = () => {
    if (selectedCategory === 'all') return 'All Items';
    const category = categories.find((cat) => cat.id === Number(selectedCategory));
    return category ? category.name : 'All Items';
  };

  // Toggle Item Availability Optimistically
  const handleToggleAvailability = async (id, currentStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: !currentStatus } : item))
    );

    try {
      const response = await api.patch(`/menu-items/${id}/toggle-availability`);
      toast.success(response?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchMenuItems();
    }
  };

  // Toggle Active/Inactive Status Optimistically
  const toggleStatus = async (item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i))
    );

    try {
      const response = await api.patch(`/menu-items/${item.id}/toggle-active`);
      toast.success(response?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchMenuItems();
    }
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(`/menu-items/${itemToDelete.id}`);
      toast.success(response?.data?.message);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchMenuItems();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderRow = (item) => {
    const category = item.category || categories.find((c) => c.id === item.category_id);

    return (
      <tr
        key={item.id}
        className="transition-colors border-b border-slate-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
      >
        {/* <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
            {item.sort_order}
          </span>
        </td> */}

        <td className="py-3.5 px-6">
          <div className="flex items-center gap-3">
            {item.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-11 h-11 rounded-lg object-cover border border-gray-100 dark:border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</div>
              {item.slug && (
                <div className="text-xs text-gray-400 dark:text-slate-500 font-mono truncate">
                  {item.slug}
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="py-3.5 px-6">
          <div className="text-xs text-gray-500 dark:text-slate-400 max-w-[200px] truncate">
            {item.description}
          </div>
        </td>

        <td className="py-3.5 px-6 text-xs">
          {category?.name}
        </td>

        <td className="py-3.5 px-6 font-semibold text-gray-900 dark:text-white tabular-nums">
          {formatPrice(item.price)}
        </td>

        <td className="py-3.5 px-6 whitespace-nowrap">
          <StatusBadge
            status={item.is_available ? 'available' : 'sold_out'}
          />
        </td>

        <td className="py-3.5 px-6">
          <StatusBadge
            status={item.is_active ? 'active' : 'inactive'}
          />
        </td>

        <td className="py-3.5 px-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleToggleAvailability(item.id, item.is_available)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${item.is_available
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50'
                }`}
            >
              {item.is_available ? 'Mark as Sold Out' : 'Mark Available'}
            </button>

            <button
              type="button"
              onClick={() => toggleStatus(item)}
              className={`p-2 rounded-lg transition-colors ${item.is_active
                  ? 'text-red-500 hover:bg-red-100/50 dark:text-red-400 dark:hover:bg-red-950/30'
                  : 'text-emerald-600 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                }`}
              title={item.is_active ? 'Deactivate' : 'Activate'}
            >
              <Power className="w-4 h-4" />
            </button>
              <Link
              to={`/menu-items-details/${item.id}`}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-green-600 transition-colors inline-block"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              to={`/menu-items/edit/${item.id}`}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleOpenDeleteModal(item)}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            Menu Inventory
          </h1>
          <p className="text-md text-gray-500 dark:text-slate-400 mt-1">
            Manage items, prices, and availability status.
          </p>
        </div>

        <Link
          to="/menu-items/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Add Menu Item</span>
        </Link>
      </div>

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search menu items..."
        filters={filterLabels}
        activeFilter={getActiveFilterLabel()}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          data={items}
          renderRow={renderRow}
          loading={loading}
          error={error}
          onRetry={fetchMenuItems}
          emptyIcon={UtensilsCrossed}
          emptyTitle={searchQuery || selectedCategory !== 'all' ? "No menu items found" : "No items added yet"}
          emptyDescription={
            searchQuery || selectedCategory !== 'all'
              ? "No menu items matched your current filter or search criteria."
              : "Get started by adding your first menu item to the inventory."
          }
        />

        {!loading && !error && items.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Item"
        message={
          <>
            Are you sure you want to delete the menu item{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              "{itemToDelete?.name}"
            </span>
            ? This action cannot be undone and may affect order history or reports.
          </>
        }
        isLoading={isDeleting}
        confirmText="Delete"
      />
    </div>
  );
}