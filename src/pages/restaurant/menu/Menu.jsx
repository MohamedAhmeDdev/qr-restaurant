import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, CheckCircle2, 
  XCircle, Image as ImageIcon, UtensilsCrossed, 
  Search, Edit, PlusCircle, Power 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import Table from '../../../components/Table';

export default function MenuTable() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    { label: 'Item Details' },
    { label: 'Category' },
    { label: 'Price' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' },
  ];

  // Fetch Categories once on mount
  useEffect(() => {
    api.get('/option/categories')
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch Paginated & Filtered Menu Items from Backend
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
      setError(err.response?.data?.message || 'Failed to fetch menu items.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  // Refetch items whenever filters, search, or page changes
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Filter & Search Handlers
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
      const response = await api.put(`/menu-items/${id}`, { is_available: !currentStatus });
      toast.success(response?.data?.message || 'Availability updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update availability.');
      fetchMenuItems(); // Revert state on failure
    }
  };

  // Delete Action Handlers
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(`/menu-items/${itemToDelete.id}`);
      toast.success(response?.data?.message || 'Menu item deleted.');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchMenuItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete menu item.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Row Renderer for Table
  const renderRow = (item) => {
    const category = item.category || categories.find((c) => c.id === item.category_id);

    return (
      <tr 
        key={item.id} 
        className="transition-colors border-b border-slate-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
      >
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
              <div className="text-xs text-gray-500 dark:text-slate-400 max-w-[200px] truncate">
                {item.description || 'No description provided.'}
              </div>
            </div>
          </div>
        </td>

        <td className="py-3.5 px-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            {category ? category.name : 'Uncategorized'}
          </span>
        </td>

        <td className="py-3.5 px-6 font-bold text-gray-900 dark:text-white tabular-nums">
          ${parseFloat(item.price || 0).toFixed(2)}
        </td>

        <td className="py-3.5 px-6">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            item.is_available 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {item.is_available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {item.is_available ? 'Available' : 'Sold Out'}
          </span>
        </td>

        <td className="py-3.5 px-6 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleToggleAvailability(item.id, item.is_available)}
              className={`p-2 rounded-lg transition-colors ${
                item.is_available 
                  ? 'text-green-500 hover:text-green-600 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20' 
                  : 'text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
              title={item.is_available ? 'Mark as Sold Out' : 'Mark as Available'}
            >
              <Power className="w-4 h-4" />
            </button>

            <Link 
              to={`/menu-items/edit/${item.id}`}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>

            <button 
              type="button"
              onClick={() => handleOpenDeleteModal(item)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              Menu Inventory
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Manage items, prices, and availability status.
            </p>
          </div>

          <Link 
            to="/menu-items/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>

        {/* Toolbar */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search menu items..."
          filters={filterLabels}
          activeFilter={getActiveFilterLabel()}
          onFilterChange={handleFilterChange}
        />

        {/* Generic Table Component handling Loading, Error, Empty, and List States */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <Table
            columns={columns}
            data={items}
            renderRow={renderRow}
            loading={loading}
            error={error}
            onRetry={fetchMenuItems}
            emptyIcon={Search}
            emptyTitle={searchQuery || selectedCategory !== 'all' ? "No menu items found" : "No items added yet"}
            emptyDescription={
              searchQuery || selectedCategory !== 'all'
                ? "No menu items matched your current filter or search criteria."
                : "Get started by adding your first menu item to the inventory."
            }
          />

          {/* Pagination Component */}
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
      </div>

      {/* Confirmation Modal */}
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