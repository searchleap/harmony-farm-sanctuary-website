import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Eye, EyeOff } from 'lucide-react';

interface AnimalStoryEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export function AnimalStoryEditor({
  value,
  onChange,
  label = "Animal Story",
  placeholder = "Tell this animal's story...",
  readOnly = false,
  className = ''
}: AnimalStoryEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [content, setContent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log('[AnimalStoryEditor] Rendering with content length:', content.length);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const insertMarkdown = (markdownSyntax: string) => {
    if (!textareaRef.current || readOnly) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText: string;
    let newCursorPos: number;

    switch (markdownSyntax) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = selectedText ? end + 4 : start + 2;
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = selectedText ? end + 2 : start + 1;
        break;
      case 'list':
        const listText = selectedText || 'List item';
        newText = content.substring(0, start) + `\n- ${listText}` + content.substring(end);
        newCursorPos = start + listText.length + 3;
        break;
      case 'numbered-list':
        const numberedText = selectedText || 'List item';
        newText = content.substring(0, start) + `\n1. ${numberedText}` + content.substring(end);
        newCursorPos = start + numberedText.length + 4;
        break;
      case 'quote':
        const quoteText = selectedText || 'Quote text';
        newText = content.substring(0, start) + `\n> ${quoteText}` + content.substring(end);
        newCursorPos = start + quoteText.length + 3;
        break;
      default:
        return;
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

  const formatMarkdownToHtml = (markdown: string) => {
    return markdown
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Unordered lists
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
      // Quotes
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return content.length;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <p className="text-sm text-gray-500">
            {getWordCount()} words • {getCharacterCount()} characters
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
        <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
          <button
            onClick={() => insertMarkdown('bold')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => insertMarkdown('italic')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={() => insertMarkdown('list')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => insertMarkdown('numbered-list')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={() => insertMarkdown('quote')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          
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
          <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
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
            rows={12}
            className="w-full p-4 resize-none focus:outline-none focus:ring-0 border-0"
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
                }
              }
            }}
          />
        )}
      </div>

      {/* Help text */}
      {!readOnly && !isPreviewMode && (
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Formatting tips:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>• **bold text** for emphasis</div>
            <div>• *italic text* for style</div>
            <div>• - bullet points for lists</div>
            <div>• 1. numbered lists</div>
            <div>• &gt; quotes for special text</div>
            <div>• Ctrl+B/I for quick formatting</div>
          </div>
        </div>
      )}

      {/* Character limit warning */}
      {!readOnly && content.length > 1000 && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          Story is getting long ({content.length} characters). Consider breaking into sections.
        </div>
      )}
    </div>
  );
}