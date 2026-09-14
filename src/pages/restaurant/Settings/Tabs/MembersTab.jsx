import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, UserPlus, Mail, Search, X, Trash2, Pencil,
    RotateCcw, Building2, AlertCircle, Filter
} from 'lucide-react';
import api from '../../../../services/api';
import toast from 'react-hot-toast';
import { RestaurantService } from '../../../../services/restaurant';
import StaffFormModal from '../../../../components/forms/StaffFormModal';
import RoleService from '../../../../services/Roles';
import Pagination from '../../../../components/common/Pagination';
import Table from '../../../../components/Table';
import { formatDate } from '../../../../utils/formatDate';
import StatusBadge from '../../../../components/StatusBadge';

export default function MembersTab() {
    const [members, setMembers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [roles, setRoles] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [statusFilter, setStatusFilter] = useState('active');
    const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const fetchRestaurants = useCallback(async () => {
        try {
            const response = await RestaurantService.getRestaurants();
            setRestaurants(response);
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await RoleService.getRoles();
            setRoles(response);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    }, []);

    const fetchMembers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                per_page: 15,
            };

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            if (selectedRestaurantFilter !== 'all') {
                params.restaurant_id = selectedRestaurantFilter;
            }

            // 3. Backend soft-delete parameters
            if (statusFilter === 'trash') {
                params.trashed = 1;
            } else if (statusFilter === 'all') {
                params.with_trashed = 1;
            }

            const response = await api.get('/organization/staff', { params });
            
            setMembers(response.data?.data);
            setLastPage(response.data?.pagination?.last_page || 1);
            setTotalItems(response.data?.pagination?.total || 0);
            
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedRestaurantFilter, statusFilter, currentPage]);

    useEffect(() => {
        fetchRestaurants();
        fetchRoles();
    }, [fetchRestaurants, fetchRoles]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedRestaurantFilter, statusFilter]);

    const validate = (formData) => {
        const newErrors = {};
        if (!formData?.name?.trim()) newErrors.name = 'Full name is required.';
        if (!formData?.email?.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData?.role_id) newErrors.role_id = 'Role selection is required.';
        if (!formData?.restaurant_ids || formData.restaurant_ids.length === 0) {
            newErrors.restaurant_ids = 'Select a restaurant.';
        }
        if (!formData?.status) newErrors.status = 'Account status is required.';
        if (!formData?.shift_type) newErrors.shift_type = 'Shift type is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (formData, e) => {
        if (e) e.preventDefault();
        if (!validate(formData)) return;

        try {
            setIsSubmitting(true);

            if (editingMember) {
                const response = await api.put(`/organization/staff/${editingMember.id}`, formData);
                toast.success(response?.data?.message);
            } else {
                const response = await api.post('/organization/staff', formData);
                toast.success(response?.data?.message);

                // Reset view filters on addition
                setSearchQuery('');
                setStatusFilter('active');
                setSelectedRestaurantFilter('all');
                setCurrentPage(1);
            }

            setIsModalOpen(false);
            setEditingMember(null);
            setErrors({});
            fetchMembers();
        } catch (err) {
            toast.error(err.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingMember(null);
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = async (member) => {
        try {
            setErrors({});
            const response = await api.get(`/organization/staff/${member.id}`);
            setEditingMember(response.data?.data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const getDeleteParams = () => {
        return selectedRestaurantFilter !== 'all' ? `?restaurant_id=${selectedRestaurantFilter}` : '';
    };

    const handleMoveToTrash = async (member) => {
        try {
            const response = await api.delete(`/organization/staff/${member.id}${getDeleteParams()}`);
            toast.success(response?.data?.message);
            fetchMembers();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleRestoreMember = async (member) => {
        try {
            const response = await api.patch(`/organization/staff/${member.id}/restore${getDeleteParams()}`);
            toast.success(response?.data?.message);
            fetchMembers();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    // Table Column Definitions
    const columns = [
        { label: 'ID', align: 'left' },
        { label: 'Member', align: 'left' },
        { label: 'Role', align: 'left' },
        { label: 'Restaurant', align: 'left' },
        { label: 'Shift', align: 'left' },
        { label: 'Started At', align: 'left' },
        { label: 'Status', align: 'left' },
        { label: 'Actions', align: 'right' }
    ];

    // Table Row Renderer
    const renderRow = (member) => {
        const isTrashed = Boolean(member.deleted_at);
        const assignedRestaurant = member.restaurants?.[0];

        return (
            <tr 
                key={member.id} 
                className={`transition-colors ${isTrashed ? 'bg-rose-50/20 dark:bg-rose-950/10' : 'hover:bg-gray-50/60 dark:hover:bg-slate-800/30'}`}
            >
                <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
                    #{member.id}
                </td>
                <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate flex items-center gap-1">
                                <Mail className="w-3 h-3 shrink-0" /> {member.email}
                            </p>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                        {member.role?.name}
                    </span>
                </td>

                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 dark:text-slate-300 ">
                            {assignedRestaurant.name}
                        </span>
                </td>

                <td className="px-6 py-3.5">
                    <span className="capitalize text-slate-700 dark:text-slate-300 text-xs">
                        {assignedRestaurant?.shift_type}
                    </span>
                </td>

                <td className="px-6 py-3.5 text-xs">
                    {formatDate(assignedRestaurant?.started_at)}
                </td>

                <td className="px-6 py-3.5">
                  <StatusBadge status={member.status} />
                </td>

                <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                        {isTrashed ? (
                             <>
                            <button 
                                type="button" 
                                onClick={() => handleRestoreMember(member)} 
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> 
                                <span> Restore Member</span>
                            </button>

                                   {/* <button type="button" onClick={() => handleOpenDeleteModal(member)} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer" title="Delete Permanently">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button> */}
                                                            </>
                        ) : (
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => openEditModal(member)} 
                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer" 
                                    title="Edit Info"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleMoveToTrash(member)} 
                                    className="p-1.5 text-gray-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer" 
                                    title="Move to Trash"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="max-w-7xl space-y-6 relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200/80 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Staff & Permissions
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            Manage roles, account statuses, shift schedules, and staff access.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer shrink-0"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Staff Member
                </button>
            </div>

            {/* Filter and Search Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search staff by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-9 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative min-w-[150px] w-full sm:w-auto">
                        <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs appearance-none cursor-pointer"
                        >
                            <option value="active">Active Staff</option>
                            <option value="trash">Trash</option>
                            <option value="all">All Members</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative min-w-[180px] w-full sm:w-auto">
                        <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
                        <select
                            value={selectedRestaurantFilter}
                            onChange={(e) => setSelectedRestaurantFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs appearance-none cursor-pointer"
                        >
                            <option value="all">All Restaurants</option>
                            {restaurants.map((restaurant) => (
                                <option key={restaurant.id} value={restaurant.id}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container Card */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                <Table
                    columns={columns}
                    data={members}
                    renderRow={renderRow}
                    loading={isLoading}
                    error={error}
                    onRetry={fetchMembers}
                    emptyIcon={searchQuery ? Search : Users}
                    emptyTitle={searchQuery ? 'No matching staff members' : statusFilter === 'trash' ? 'Trash is empty' : 'No staff members added'}
                    emptyDescription={searchQuery ? `No members found matching "${searchQuery}".` : statusFilter === 'trash' ? 'Members moved to trash will appear here.' : 'Start adding staff members to manage restaurant access.'}
                />

                {/* Pagination Component */}
                {!isLoading && !error && members.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        totalRecords={totalItems}
                        onPageChange={handlePageChange}
                        maxVisible={5}
                    />
                )}
            </div>

            <StaffFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                editingMember={editingMember}
                restaurants={restaurants}
                roles={roles}
                errors={errors}
                isSubmitting={isSubmitting}
                setErrors={setErrors}
            />

            {/* <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (!isDeleting) {
                        setIsDeleteModalOpen(false);
                        setMemberToDelete(null);
                    }
                }}
                onConfirm={handlePermanentDelete}
                title="Permanently Delete Member"
                message={
                    <>
                        Are you sure you want to permanently delete{' '}
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            "{memberToDelete?.name}"
                        </span>
                        ? This action cannot be undone.
                    </>
                }
                isLoading={isDeleting}
                confirmText="Delete Permanently"
            /> */}
        </div>
    );
}