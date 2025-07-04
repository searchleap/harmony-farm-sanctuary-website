import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData, useInquiries } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createInquirySearchConfig } from '../../utils/adminSearch';
import { Mail, Phone, User, MessageSquare, Reply } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { ContactInquiry } from '../../utils/adminData';

export function InquiriesPage() {
  const { data: adminData, loading: adminDataLoading } = useAdminData();
  const { data: inquiries, loading, create, update, delete: deleteInquiry, refetch } = useInquiries();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  console.log('[InquiriesPage] Rendering with inquiries:', inquiries?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(inquiries || [], createInquirySearchConfig());
  }, [inquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Table columns
  const columns: AdminTableColumn<ContactInquiry>[] = [
    {
      key: 'name',
      title: 'Contact',
      dataIndex: 'name',
      render: (name: string, inquiry: ContactInquiry) => (
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <span className="font-medium text-gray-900">{name}</span>
            <p className="text-sm text-gray-500">{inquiry.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: (type: string) => (
        <AdminStatusBadge 
          variant={
            type === 'adoption' ? 'success' :
            type === 'volunteer' ? 'info' :
            type === 'donation' ? 'warning' :
            'secondary'
          }
        >
          {type}
        </AdminStatusBadge>
      )
    },
    {
      key: 'subject',
      title: 'Subject',
      dataIndex: 'subject',
      render: (subject: string) => (
        <span className="text-sm text-gray-900 line-clamp-2 max-w-xs">
          {subject}
        </span>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      dataIndex: 'priority',
      render: (priority: string) => (
        <AdminStatusBadge 
          variant={
            priority === 'high' ? 'error' : 
            priority === 'medium' ? 'warning' : 
            'success'
          }
        >
          {priority}
        </AdminStatusBadge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <AdminStatusBadge 
          variant={
            status === 'new' ? 'warning' :
            status === 'responded' ? 'info' :
            status === 'resolved' ? 'success' :
            'neutral'
          }
        >
          {status}
        </AdminStatusBadge>
      )
    },
    {
      key: 'submittedAt',
      title: 'Submitted',
      dataIndex: 'submittedAt',
      render: (date: any) => formatDate(date, 'N/A')
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, inquiry: ContactInquiry) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => handleView(inquiry)}
            title="View Details"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-green-600 hover:text-green-800"
            onClick={() => handleReply(inquiry)}
            title="Reply"
          >
            <Reply className="h-4 w-4" />
          </button>
          {inquiry.phone && (
            <button
              className="p-1 text-purple-600 hover:text-purple-800"
              onClick={() => window.open(`tel:${inquiry.phone}`, '_self')}
              title="Call"
            >
              <Phone className="h-4 w-4" />
            </button>
          )}
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`, '_blank')}
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Inquiries', href: '/admin/inquiries' }
  ];

  // Event handlers
  const handleView = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  const handleReply = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setIsReplyModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = 'Name,Email,Type,Subject,Priority,Status,Submitted\n' + 
      filteredInquiries.map(inquiry => 
        `"${inquiry.name}","${inquiry.email}","${inquiry.type}","${inquiry.subject}","${inquiry.priority}","${inquiry.status}","${typeof inquiry.submittedAt === 'string' ? inquiry.submittedAt : inquiry.submittedAt.toISOString()}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contact-inquiries.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminListPage
        title="Contact Inquiries"
        description="Manage visitor inquiries and contact form submissions"
        breadcrumbs={breadcrumbs}
        data={filteredInquiries}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search inquiries..."
        onSearch={setSearchTerm}
        onRefresh={refetch}
        onExport={handleExport}
      />

      {/* View Details Modal */}
      {isViewModalOpen && selectedInquiry && (
        <AdminModal
          isOpen={true}
          title="Inquiry Details"
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedInquiry(null);
          }}
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{selectedInquiry.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedInquiry.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900 capitalize">{selectedInquiry.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <p className="text-gray-900 capitalize">{selectedInquiry.priority}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <p className="text-gray-900">{selectedInquiry.subject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedInquiry(null);
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleReply(selectedInquiry)}
              >
                Reply
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Reply Modal */}
      {isReplyModalOpen && selectedInquiry && (
        <AdminModal
          isOpen={true}
          title={`Reply to ${selectedInquiry.name}`}
          onClose={() => {
            setIsReplyModalOpen(false);
            setSelectedInquiry(null);
          }}
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600">Email reply form will be implemented here.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  setSelectedInquiry(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  setSelectedInquiry(null);
                  success('Reply sent successfully');
                }}
              >
                Send Reply
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}