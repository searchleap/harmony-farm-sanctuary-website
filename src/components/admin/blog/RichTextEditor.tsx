import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Eye, EyeOff, Image, Video, Link, Code, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from 'lucide-react';
import type { BlogMedia, BlogSection } from '../../../types/blog';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string, sections?: BlogSection[]) => void;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  allowMedia?: boolean;
  allowSections?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Write your content here...",
  readOnly = false,
  allowMedia = true,
  allowSections = true,
  className = ''
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [content, setContent] = useState(value);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log('[RichTextEditor] Rendering with content length:', content.length);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const insertText = (insertValue: string, wrapText = false, cursorOffset = 0) => {
    if (!textareaRef.current || readOnly) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText: string;
    let newCursorPos: number;

    if (wrapText) {
      newText = content.substring(0, start) + insertValue.replace('%s', selectedText) + content.substring(end);
      newCursorPos = selectedText ? end + insertValue.length - 2 : start + insertValue.length / 2;
    } else {
      newText = content.substring(0, start) + insertValue + content.substring(end);
      newCursorPos = start + insertValue.length + cursorOffset;
    }

    handleContentChange(newText);

    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertMarkdown = (markdownType: string) => {
    switch (markdownType) {
      case 'bold':
        insertText('**%s**', true);
        break;
      case 'italic':
        insertText('*%s*', true);
        break;
      case 'h1':
        insertText('\n# ', false);
        break;
      case 'h2':
        insertText('\n## ', false);
        break;
      case 'h3':
        insertText('\n### ', false);
        break;
      case 'list':
        insertText('\n- ', false);
        break;
      case 'numbered-list':
        insertText('\n1. ', false);
        break;
      case 'quote':
        insertText('\n> ', false);
        break;
      case 'code':
        insertText('`%s`', true);
        break;
      case 'link':
        setShowLinkModal(true);
        break;
      case 'image':
        setShowMediaModal(true);
        break;
    }
  };

  const insertLink = (url: string, text: string) => {
    insertText(`[${text}](${url})`);
    setShowLinkModal(false);
  };

  const insertMedia = (url: string, alt: string, type: 'image' | 'video' = 'image') => {
    if (type === 'image') {
      insertText(`\n![${alt}](${url})\n`);
    } else {
      insertText(`\n<video controls>\n  <source src="${url}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n`);
    }
    setShowMediaModal(false);
  };

  const formatMarkdownToHtml = (markdown: string) => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      // Lists
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Quotes
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.ceil(words / 200); // Average reading speed: 200 words per minute
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', label: 'Bold (Ctrl+B)' },
    { icon: Italic, action: 'italic', label: 'Italic (Ctrl+I)' },
    { type: 'separator' },
    { icon: Heading1, action: 'h1', label: 'Heading 1' },
    { icon: Heading2, action: 'h2', label: 'Heading 2' },
    { icon: Heading3, action: 'h3', label: 'Heading 3' },
    { type: 'separator' },
    { icon: List, action: 'list', label: 'Bullet List' },
    { icon: ListOrdered, action: 'numbered-list', label: 'Numbered List' },
    { icon: Quote, action: 'quote', label: 'Quote' },
    { type: 'separator' },
    { icon: Code, action: 'code', label: 'Inline Code' },
    { icon: Link, action: 'link', label: 'Insert Link' },
  ];

  if (allowMedia) {
    toolbarButtons.push(
      { icon: Image, action: 'image', label: 'Insert Image' },
      { icon: Video, action: 'video', label: 'Insert Video' }
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <p className="text-sm text-gray-500">
            {getWordCount()} words • {getReadingTime()} min read • {content.length} characters
          </p>
        </div>
        
        {!readOnly && (
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
        )}
      </div>

      {/* Toolbar */}
      {!readOnly && !isPreviewMode && (
        <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-md flex-wrap">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'separator') {
              return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
            }

            const Icon = button.icon!;
            return (
              <button
                key={index}
                onClick={() => insertMarkdown(button.action!)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title={button.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
          
          <div className="flex-1" />
          
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            Markdown supported
          </div>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className="border border-gray-300 rounded-md overflow-hidden">
        {isPreviewMode ? (
          // Preview mode
          <div className="p-4 min-h-[300px] prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-code:bg-gray-100 prose-code:text-gray-800">
            {content ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdownToHtml(content) 
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No content to preview</p>
            )}
          </div>
        ) : (
          // Edit mode
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            rows={16}
            className="w-full p-4 resize-none focus:outline-none focus:ring-0 border-0 font-mono text-sm"
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 'b':
                    e.preventDefault();
                    insertMarkdown('bold');
                    break;
                  case 'i':
                    e.preventDefault();
                    insertMarkdown('italic');
                    break;
                  case 'k':
                    e.preventDefault();
                    insertMarkdown('link');
                    break;
                }
              }
            }}
          />
        )}
      </div>

      {/* Help text */}
      {!readOnly && !isPreviewMode && (
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Formatting guide:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>• **bold** and *italic*</div>
            <div>• # H1, ## H2, ### H3</div>
            <div>• `code` and &gt; quotes</div>
            <div>• - lists and 1. numbered</div>
            <div>• [link text](url)</div>
            <div>• ![alt text](image-url)</div>
          </div>
        </div>
      )}

      {/* Character limit warning */}
      {!readOnly && content.length > 5000 && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          Long content ({content.length} characters). Consider breaking into sections or using page breaks.
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  id="link-text"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Click here"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  id="link-url"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const text = (document.getElementById('link-text') as HTMLInputElement)?.value || 'link';
                  const url = (document.getElementById('link-url') as HTMLInputElement)?.value || '#';
                  insertLink(url, text);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insert Media</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media URL
                </label>
                <input
                  id="media-url"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text / Caption
                </label>
                <input
                  id="media-alt"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe the image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <select
                  id="media-type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const url = (document.getElementById('media-url') as HTMLInputElement)?.value || '';
                  const alt = (document.getElementById('media-alt') as HTMLInputElement)?.value || 'Media';
                  const type = (document.getElementById('media-type') as HTMLSelectElement)?.value as 'image' | 'video';
                  insertMedia(url, alt, type);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
              >
                Insert Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}