import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Bookmark,
  Share2,
  Maximize,
  Minimize,
  FileText,
  Eye,
  X
} from 'lucide-react';
import { EducationalResource } from '../../../types/faq';
import { AdminButton } from '../common';

interface PDFViewerProps {
  resource: EducationalResource;
  onClose: () => void;
}

interface Bookmark {
  id: string;
  title: string;
  page: number;
  timestamp: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  resource,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(12); // Mock total pages
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Introduction', page: 1, timestamp: '2024-01-15T10:00:00Z' },
    { id: '2', title: 'Getting Started', page: 3, timestamp: '2024-01-15T10:05:00Z' },
    { id: '3', title: 'Advanced Topics', page: 8, timestamp: '2024-01-15T10:10:00Z' }
  ]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [showNotes] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handlePageJump = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleBookmark = () => {
    const title = prompt('Enter bookmark title:');
    if (title) {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title,
        page: currentPage,
        timestamp: new Date().toISOString()
      };
      setBookmarks(prev => [...prev, newBookmark]);
    }
  };

  const handleNoteChange = (page: number, note: string) => {
    setNotes(prev => ({
      ...prev,
      [page]: note
    }));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      viewerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Mock PDF rendering - in real implementation, you'd use a library like react-pdf
  const renderPDFPage = () => {
    return (
      <div 
        className="bg-white shadow-lg mx-auto transition-all duration-200"
        style={{
          width: `${(8.5 * zoom) / 100}in`,
          height: `${(11 * zoom) / 100}in`,
          transform: `rotate(${rotation}deg)`,
          minHeight: '400px'
        }}
      >
        <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <FileText className="w-16 h-16 text-gray-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">{resource.title}</h3>
              <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
              <p className="text-xs text-gray-400">PDF Viewer Demo</p>
            </div>
          </div>
          
          {/* Mock content based on page */}
          <div className="absolute top-4 left-4 right-4 text-xs text-gray-600">
            {currentPage === 1 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Introduction</h4>
                <p>Welcome to our comprehensive guide on animal sanctuary management...</p>
              </div>
            )}
            {currentPage === 2 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Table of Contents</h4>
                <ul className="space-y-1">
                  <li>1. Introduction... 1</li>
                  <li>2. Getting Started... 3</li>
                  <li>3. Daily Operations... 5</li>
                  <li>4. Animal Care... 8</li>
                </ul>
              </div>
            )}
            {currentPage >= 3 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Chapter {currentPage - 2}</h4>
                <p>This chapter covers important aspects of sanctuary operations and animal welfare protocols...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={viewerRef} className="flex flex-col h-full max-h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AdminButton
              size="sm"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              icon={ChevronLeft}
            >
              Prev
            </AdminButton>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => handlePageJump(parseInt(e.target.value))}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                min="1"
                max={totalPages}
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
            
            <AdminButton
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              icon={ChevronRight}
            >
              Next
            </AdminButton>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <AdminButton
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              icon={ZoomOut}
            >
              -
            </AdminButton>
            <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
            <AdminButton
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              icon={ZoomIn}
            >
              +
            </AdminButton>
            <AdminButton
              size="sm"
              variant="outline"
              onClick={handleRotate}
              icon={RotateCw}
            >
              Rotate
            </AdminButton>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search in document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded w-48"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            size="sm"
            variant="outline"
            onClick={handleBookmark}
            icon={Bookmark}
          >
            Bookmark
          </AdminButton>
          
          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => setShowBookmarks(!showBookmarks)}
            icon={Eye}
          >
            Bookmarks
          </AdminButton>

          <AdminButton
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
            icon={isFullscreen ? Minimize : Maximize}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </AdminButton>

          <AdminButton
            size="sm"
            variant="outline"
            icon={Download}
          >
            Download
          </AdminButton>

          <AdminButton
            size="sm"
            variant="outline"
            icon={Share2}
          >
            Share
          </AdminButton>

          <AdminButton
            size="sm"
            variant="outline"
            onClick={onClose}
            icon={X}
          >
            Close
          </AdminButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {(showBookmarks || showNotes) && (
          <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setShowBookmarks(true)}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  showBookmarks ? 'bg-white text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bookmarks
              </button>
              <button
                onClick={() => setShowBookmarks(false)}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  !showBookmarks ? 'bg-white text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Notes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {showBookmarks ? (
                <div className="space-y-3">
                  {bookmarks.map(bookmark => (
                    <div
                      key={bookmark.id}
                      onClick={() => handlePageJump(bookmark.page)}
                      className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {bookmark.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Page {bookmark.page} • {new Date(bookmark.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes for Page {currentPage}
                    </label>
                    <textarea
                      value={notes[currentPage] || ''}
                      onChange={(e) => handleNoteChange(currentPage, e.target.value)}
                      placeholder="Add your notes for this page..."
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    />
                  </div>
                  
                  {Object.entries(notes).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">All Notes</h4>
                      <div className="space-y-2">
                        {Object.entries(notes).map(([page, note]) => (
                          <div key={page} className="p-2 bg-white rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Page {page}</div>
                            <div className="text-sm text-gray-700">{note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          <div className="flex justify-center">
            {renderPDFPage()}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Document: {resource.title}</span>
          <span>Size: {resource.fileSize ? `${Math.round(resource.fileSize / 1024)} KB` : 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Zoom: {zoom}%</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>
    </div>
  );
};