import React, { useState } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge } from '../../components/admin/common';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';

// Mock event interface
interface Event {
  id: string;
  title: string;
  type: 'tour' | 'volunteer' | 'fundraiser' | 'educational';
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  price?: number;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: 'event_1',
    title: 'Farm Tour - Morning Group',
    type: 'tour',
    date: new Date('2025-01-10'),
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Main Entrance',
    capacity: 15,
    registered: 12,
    status: 'upcoming',
    description: 'Guided tour of the sanctuary with meet & greet with our animal residents.',
    price: 15
  },
  {
    id: 'event_2',
    title: 'Volunteer Orientation',
    type: 'volunteer',
    date: new Date('2025-01-12'),
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    location: 'Education Center',
    capacity: 20,
    registered: 8,
    status: 'upcoming',
    description: 'Introduction to volunteer opportunities and sanctuary procedures.',
    price: 0
  },
  {
    id: 'event_3',
    title: 'Annual Fundraising Gala',
    type: 'fundraiser',
    date: new Date('2025-02-14'),
    startTime: '6:00 PM',
    endTime: '10:00 PM',
    location: 'Community Center',
    capacity: 100,
    registered: 67,
    status: 'upcoming',
    description: 'Annual celebration and fundraising event with dinner and live auction.',
    price: 75
  }
];

export function EventsPage() {
  const { success, error } = useAdminNotifications();
  const [events] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[EventsPage] Rendering with events:', events.length);

  // Filter events based on search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns: AdminTableColumn<Event>[] = [
    {
      key: 'title',
      title: 'Event',
      dataIndex: 'title',
      render: (title: string, event: Event) => (
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-blue-500" />
          <div>
            <span className="font-medium text-gray-900">{title}</span>
            <p className="text-sm text-gray-500 capitalize">{event.type}</p>
          </div>
        </div>
      )
    },
    {
      key: 'date',
      title: 'Date & Time',
      dataIndex: 'date',
      render: (date: Date, event: Event) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {formatDate(date)}
          </div>
          <div className="text-sm text-gray-500">
            {event.startTime} - {event.endTime}
          </div>
        </div>
      )
    },
    {
      key: 'location',
      title: 'Location',
      dataIndex: 'location',
      render: (location: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{location}</span>
        </div>
      )
    },
    {
      key: 'capacity',
      title: 'Attendance',
      dataIndex: 'capacity',
      render: (capacity: number, event: Event) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {event.registered}/{capacity}
          </span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => (
        <span className="text-sm font-medium">
          {price ? `$${price}` : 'Free'}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <AdminStatusBadge 
          variant={
            status === 'upcoming' ? 'info' :
            status === 'ongoing' ? 'warning' :
            status === 'completed' ? 'success' :
            'error'
          }
        >
          {status}
        </AdminStatusBadge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, event: Event) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => handleView(event)}
            title="View Details"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Events', href: '/admin/events' }
  ];

  // Event handlers
  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = 'Title,Type,Date,Start Time,End Time,Location,Capacity,Registered,Status,Price\n' + 
      filteredEvents.map(event => 
        `"${event.title}","${event.type}","${formatDate(event.date)}","${event.startTime}","${event.endTime}","${event.location}","${event.capacity}","${event.registered}","${event.status}","${event.price || 0}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminListPage
        title="Events Management"
        description="Manage tours, workshops, and special events"
        breadcrumbs={breadcrumbs}
        data={filteredEvents}
        columns={columns}
        loading={false}
        searchPlaceholder="Search events..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={() => success('Events refreshed')}
        onExport={handleExport}
        addButtonText="Add Event"
      />

      {/* View Event Modal */}
      {isViewModalOpen && selectedEvent && (
        <AdminModal
          isOpen={true}
          title="Event Details"
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedEvent(null);
          }}
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <p className="text-gray-900">{selectedEvent.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900 capitalize">{selectedEvent.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{formatDate(selectedEvent.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <p className="text-gray-900">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">{selectedEvent.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <p className="text-gray-900">{selectedEvent.price ? `$${selectedEvent.price}` : 'Free'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-900">{selectedEvent.description}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedEvent(null);
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedEvent(null);
                  success('Event updated successfully');
                }}
              >
                Edit Event
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <AdminModal
          isOpen={true}
          title="Add New Event"
          onClose={() => setIsAddModalOpen(false)}
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600">Event creation form will be implemented here.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsAddModalOpen(false);
                  success('Event created successfully');
                }}
              >
                Create Event
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}