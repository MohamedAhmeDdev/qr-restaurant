import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserPlus,
  Mail,
  Building2,
  CheckCircle,
  RotateCw,
  Send,
  Users,
  User, // Added for invited by icon
  Calendar
} from 'lucide-react';
import RestaurantInviteModal from '../../components/modal/RestaurantInviteModal';
import StatsCard from '../../components/cards/StatsCard';
import Toolbar from '../../components/Toolbar';
import Table from '../../components/Table';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate';

export default function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  // New state for resend functionality
  const [resendTarget, setResendTarget] = useState(null); // Stores the invitation being resent

  // Fetch invitations on mount
  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/invitations');
      const data = response.data?.data;
      setInvitations(data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Send New Invitation Handler
  const handleSendInvite = async (email) => {
    try {
      setIsSending(true);
      setInviteResult(null);
      
      let response;
      
      // Check if we're resending or sending new
      if (resendTarget) {
        // Resend existing invitation
        response = await api.post('/invitations/resend', { 
          id: resendTarget.id, 
          email: email 
        });
      } else {
        // Send new invitation
        response = await api.post('/invitations/send', { email });
      }
      
      toast.success(response.data.message);
      
      // Close modal and fetch updated data
      setIsInviteModalOpen(false);
      setResendTarget(null); // Clear resend target
      fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSending(false);
    }
  };

  // Open modal for resending
  const handleResendInvitation = (invitation) => {
    setResendTarget(invitation);
    setInviteResult(null);
    setIsInviteModalOpen(true);
  };

  // Resend Existing Invitation Handler (alternative with confirmation)
  const handleResendWithConfirm = async (invitation) => {
    const targetEmail = invitation.email;
    if (!window.confirm(`Resend invitation to ${targetEmail}?`)) return;

    try {
      setResendingId(invitation.id);
      const response = await api.post('/invitations/resend', { 
        id: invitation.id, 
        email: targetEmail 
      });
      toast.success(response.data.message);
      fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setResendingId(null);
    }
  };

  // Filter dataset by search query
  const filteredInvitations = useMemo(() => {
    return invitations.filter((item) => {
      const emailMatch = item.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const orgMatch = (item.organization?.name || item.organization || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const invitedByMatch = (item.invited_by?.name || item.invited_by || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return emailMatch || nameMatch || orgMatch || invitedByMatch;
    });
  }, [invitations, searchQuery]);

  // Dynamic Statistics
  const metrics = useMemo(() => {
    const total = invitations.length;
    const pending = invitations.filter((i) => 
      i.status?.toLowerCase() === 'pending' || !i.accepted_at
    ).length;
    const accepted = invitations.filter((i) => 
      i.status?.toLowerCase() === 'accepted' || i.accepted_at
    ).length;

    return { total, pending, accepted };
  }, [invitations]);

  // Helper for generating fallback initials
  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  const columns = [
    { label: 'Recipient', align: 'left' },
    { label: 'Organization', align: 'left' },
    { label: 'Invited By', align: 'left' }, // New column
    { label: 'Status', align: 'left' },
    { label: 'Actions', align: 'right' }
  ];

const renderRow = (item, idx) => {
  const isResending = resendingId === item.id;
  const isAccepted = Boolean(item.accepted_at);

  const invitedByName = item.invited_by?.name;
  const invitedByEmail = item.invited_by?.email;

  return (
    <tr 
      key={item.id} 
      className={`hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-200 ${
        idx !== filteredInvitations.length - 1 ? 'border-b border-gray-100 dark:border-slate-800' : ''
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
            {getInitials(item.name, item.email)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-slate-100 transition-colors duration-200">
              {item.name || 'Invited User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 transition-colors duration-200">
              <Mail className="w-3 h-3" /> {item.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors duration-200">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
          {item.organization?.name || item.organization || 'N/A'}
        </div>
      </td>

      <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors duration-200">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
          <div>
            <p className="font-medium text-gray-900 dark:text-slate-100">
              {invitedByName}
            </p>
            {invitedByEmail && (
              <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {invitedByEmail}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Dynamic Status Display */}
      <td className="px-6 py-4">
        {isAccepted ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(item.accepted_at)}</span>
          </div>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Pending
          </span>
        )}
      </td>

      {/* Actions: Hide button if accepted */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {!isAccepted && (
            <button
              onClick={() => handleResendInvitation(item)}
              disabled={isResending}
              title="Resend Invitation"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Invitation</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

  // Get modal title and description based on context
  const getModalConfig = () => {
    if (resendTarget) {
      return {
        title: 'Resend Invitation',
        description: `Resend onboarding registration link to ${resendTarget.email}`,
        buttonText: 'Resend Invitation'
      };
    }
    return {
      title: 'Invite Restaurant',
      description: 'Send an onboarding registration link to a new manager.',
      buttonText: 'Send Invitation'
    };
  };

  const modalConfig = getModalConfig();

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 dark:from-orange-500/30 dark:to-pink-500/30">
            <Send className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Invitations</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">
              Send and manage restaurant onboarding invitations across the platform.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setResendTarget(null); // Clear any resend target
            setInviteResult(null);
            setIsInviteModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Send New Invitation
        </button>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Total Invitations" 
          value={loading ? '...' : metrics.total} 
          icon={<Users className="w-4 h-4 text-gray-400" />}
        />
        <StatsCard 
          label="Pending Invitations" 
          value={loading ? '...' : metrics.pending} 
          valueColor="text-amber-600 dark:text-amber-400"
          icon={<Send className="w-4 h-4 text-amber-400" />}
        />
        <StatsCard 
          label="Accepted Invitations" 
          value={loading ? '...' : metrics.accepted} 
          valueColor="text-emerald-600 dark:text-emerald-400"
          icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search invitations by email, name, organization, or inviter..."
          filters={['All']}
          activeFilter="All"
          onFilterChange={() => {}}
        />

        <Table
          columns={columns}
          data={filteredInvitations}
          loading={loading}
          error={error}
          onRetry={fetchInvitations}
          emptyIcon={Send}
          emptyTitle="No invitations found"
          emptyDescription={
            searchQuery
              ? 'No invitations match your search parameters.'
              : 'No invitations have been sent yet.'
          }
          renderRow={renderRow}
        />
      </div>

      {/* INVITATION MODAL */}
      <RestaurantInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setResendTarget(null); // Clear resend target when closing
        }}
        onSendInvite={handleSendInvite}
        inviteData={inviteResult}
        isSending={isSending}
        // Pass context to modal for customization
        isResend={!!resendTarget}
        resendEmail={resendTarget?.email}
        modalConfig={modalConfig}
      />
    </div>
  );
}