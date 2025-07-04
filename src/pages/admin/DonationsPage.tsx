import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createDonationSearchConfig } from '../../utils/adminSearch';
import { DollarSign, Calendar, CreditCard, Receipt, TrendingUp } from 'lucide-react';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { DonationRecord } from '../../utils/adminData';

export function DonationsPage() {
  const { data: adminData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  console.log('[DonationsPage] Rendering with donations:', adminData.donations?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(adminData.donations || [], createDonationSearchConfig());
  }, [adminData.donations]);

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const donations = filteredDonations || [];
    const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const monthly = donations.filter(d => {
      const donationDate = typeof d.donatedAt === 'string' ? new Date(d.donatedAt) : d.donatedAt;
      const now = new Date();
      return donationDate && donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
    }).reduce((sum, d) => sum + (d.amount || 0), 0);
    
    return {
      total: total.toFixed(2),
      monthly: monthly.toFixed(2),
      count: donations.length,
      average: donations.length > 0 ? (total / donations.length).toFixed(2) : '0.00'
    };
  }, [filteredDonations]);

  // Table columns
  const columns: AdminTableColumn<DonationRecord>[] = [
    {
      key: 'donorName',
      title: 'Donor',
      dataIndex: 'donorName',
      render: (name: string, donation: DonationRecord) => (
        <div className="flex items-center space-x-3">
          <DollarSign className="h-5 w-5 text-green-500" />
          <div>
            <span className="font-medium text-gray-900">{name || 'Anonymous'}</span>
            <p className="text-sm text-gray-500">{donation.donorEmail}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          ${amount ? amount.toFixed(2) : '0.00'}
        </span>
      )
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: (type: string) => (
        <AdminStatusBadge 
          variant={
            type === 'monthly' ? 'info' :
            type === 'memorial' ? 'secondary' :
            type === 'sponsorship' ? 'warning' :
            'success'
          }
        >
          {type}
        </AdminStatusBadge>
      )
    },
    {
      key: 'method',
      title: 'Method',
      dataIndex: 'method',
      render: (method: string) => (
        <div className="flex items-center space-x-1">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className="text-sm capitalize">{method}</span>
        </div>
      )
    },
    {
      key: 'purpose',
      title: 'Purpose',
      dataIndex: 'purpose',
      render: (purpose: string) => (
        <span className="text-sm text-gray-600 line-clamp-1 max-w-xs">
          {purpose || 'General Fund'}
        </span>
      )
    },
    {
      key: 'donatedAt',
      title: 'Date',
      dataIndex: 'donatedAt',
      render: (date: string | Date) => {
        const donationDate = typeof date === 'string' ? new Date(date) : date;
        return donationDate ? donationDate.toLocaleDateString() : 'N/A';
      }
    },
    {
      key: 'isRecurring',
      title: 'Recurring',
      dataIndex: 'isRecurring',
      render: (isRecurring: boolean) => (
        <AdminStatusBadge variant={isRecurring ? 'info' : 'neutral'}>
          {isRecurring ? 'Yes' : 'No'}
        </AdminStatusBadge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, donation: DonationRecord) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => handleView(donation)}
            title="View Details"
          >
            <Receipt className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-green-600 hover:text-green-800"
            onClick={() => window.open(`mailto:${donation.donorEmail}?subject=Thank you for your donation`, '_blank')}
            title="Send Thank You"
          >
            <DollarSign className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Donations', href: '/admin/donations' }
  ];

  // Event handlers
  const handleView = (donation: DonationRecord) => {
    setSelectedDonation(donation);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = 'Donor,Email,Amount,Type,Method,Purpose,Date,Recurring\n' + 
      filteredDonations.map(donation => 
        `"${donation.donorName || 'Anonymous'}","${donation.donorEmail}","${donation.amount || 0}","${donation.type}","${donation.method}","${donation.purpose || 'General Fund'}","${typeof donation.donatedAt === 'string' ? donation.donatedAt : donation.donatedAt.toISOString()}","${donation.isRecurring ? 'Yes' : 'No'}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'donations.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.monthly}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Count</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Average</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.average}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminListPage
        title="Donation Management"
        description="Track and manage donations from supporters"
        breadcrumbs={breadcrumbs}
        data={filteredDonations}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search donations..."
        onSearch={setSearchTerm}
        onRefresh={refetch}
        onExport={handleExport}
      />

      {/* View Details Modal */}
      {isViewModalOpen && selectedDonation && (
        <AdminModal
          isOpen={true}
          title="Donation Details"
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedDonation(null);
          }}
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Donor Name</label>
                <p className="text-gray-900">{selectedDonation.donorName || 'Anonymous'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedDonation.donorEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="text-2xl font-semibold text-green-600">${selectedDonation.amount?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Method</label>
                <p className="text-gray-900 capitalize">{selectedDonation.method}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900 capitalize">{selectedDonation.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recurring</label>
                <p className="text-gray-900">{selectedDonation.isRecurring ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <p className="text-gray-900">{selectedDonation.purpose || 'General Fund'}</p>
            </div>
            {selectedDonation.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedDonation.notes}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedDonation(null);
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => window.open(`mailto:${selectedDonation.donorEmail}?subject=Thank you for your donation`, '_blank')}
              >
                Send Thank You
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}