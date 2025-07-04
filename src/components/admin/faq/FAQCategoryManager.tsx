import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import { FAQCategory } from '../../../types/faq';
import { AdminModal, AdminFormField, AdminButton } from '../common';

interface FAQCategoryManagerProps {
  categories: FAQCategory[];
  onCategoryCreate: (category: Omit<FAQCategory, 'id'>) => void;
  onCategoryUpdate: (id: string, category: Partial<FAQCategory>) => void;
  onCategoryDelete: (id: string) => void;
  onCategoryMove: (categoryId: string, newParentId?: string) => void;
}

interface CategoryTreeNode extends FAQCategory {
  children: CategoryTreeNode[];
  expanded: boolean;
}

const iconOptions = [
  'HelpCircle', 'Info', 'Heart', 'Shield', 'Users', 'Home', 'Leaf', 'Sun',
  'Star', 'Settings', 'FileText', 'Book', 'Lightbulb', 'Target', 'Gift'
];

const colorOptions = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export const FAQCategoryManager: React.FC<FAQCategoryManagerProps> = ({
  categories,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  onCategoryMove
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'HelpCircle',
    color: '#3B82F6',
    parentId: '',
    priority: 0,
    isActive: true
  });
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  // Build hierarchical tree from flat categories
  useEffect(() => {
    const buildTree = (parentId?: string, depth = 0): CategoryTreeNode[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .sort((a, b) => a.priority - b.priority)
        .map(category => ({
          ...category,
          children: buildTree(category.id, depth + 1),
          expanded: true
        }));
    };

    setCategoryTree(buildTree());
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      depth: formData.parentId ? 
        (categories.find(c => c.id === formData.parentId)?.depth || 0) + 1 : 0,
      path: buildCategoryPath(formData.parentId, formData.name),
      questionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCategory) {
      onCategoryUpdate(editingCategory.id, categoryData);
    } else {
      onCategoryCreate(categoryData);
    }

    resetForm();
  };

  const buildCategoryPath = (parentId?: string, name?: string): string => {
    if (!parentId) return name || '';
    
    const parent = categories.find(c => c.id === parentId);
    if (!parent) return name || '';
    
    return `${parent.path} > ${name}`;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'HelpCircle',
      color: '#3B82F6',
      parentId: '',
      priority: 0,
      isActive: true
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (category: FAQCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parentId: category.parentId || '',
      priority: category.priority,
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleToggleExpanded = (categoryId: string) => {
    const updateExpanded = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
      return nodes.map(node => ({
        ...node,
        expanded: node.id === categoryId ? !node.expanded : node.expanded,
        children: updateExpanded(node.children)
      }));
    };
    
    setCategoryTree(updateExpanded(categoryTree));
  };

  const handleDragStart = (categoryId: string) => {
    setDraggedCategory(categoryId);
  };

  const handleDrop = (targetCategoryId: string) => {
    if (draggedCategory && draggedCategory !== targetCategoryId) {
      onCategoryMove(draggedCategory, targetCategoryId);
    }
    setDraggedCategory(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderCategoryNode = (node: CategoryTreeNode, level = 0) => (
    <div key={node.id} className="select-none">
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group ${
          draggedCategory === node.id ? 'opacity-50' : ''
        }`}
        style={{ marginLeft: level * 20 }}
        draggable
        onDragStart={() => handleDragStart(node.id)}
        onDrop={() => handleDrop(node.id)}
        onDragOver={handleDragOver}
      >
        {/* Expand/Collapse Button */}
        {node.children.length > 0 && (
          <button 
            onClick={() => handleToggleExpanded(node.id)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {node.expanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </button>
        )}
        
        {/* Category Icon */}
        <div 
          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: node.color }}
        >
          {node.expanded && node.children.length > 0 ? 
            <FolderOpen className="w-4 h-4" /> : 
            <Folder className="w-4 h-4" />
          }
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {node.name}
            </span>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              node.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {node.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-sm text-gray-500">
              ({node.questionCount} questions)
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {node.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCategoryUpdate(node.id, { isActive: !node.isActive })}
            className="p-1 hover:bg-gray-200 rounded"
            title={node.isActive ? 'Hide category' : 'Show category'}
          >
            {node.isActive ? 
              <Eye className="w-4 h-4 text-gray-600" /> : 
              <EyeOff className="w-4 h-4 text-gray-400" />
            }
          </button>
          <button
            onClick={() => handleEdit(node)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit category"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onCategoryDelete(node.id)}
            className="p-1 hover:bg-red-200 rounded"
            title="Delete category"
            disabled={node.questionCount > 0}
          >
            <Trash2 className={`w-4 h-4 ${
              node.questionCount > 0 ? 'text-gray-300' : 'text-red-600'
            }`} />
          </button>
        </div>
      </div>

      {/* Render children if expanded */}
      {node.expanded && node.children.map(child => 
        renderCategoryNode(child, level + 1)
      )}
    </div>
  );

  const availableParents = categories.filter(cat => 
    cat.depth < 3 && (!editingCategory || cat.id !== editingCategory.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            FAQ Category Management
          </h3>
          <p className="text-sm text-gray-600">
            Organize FAQ categories with hierarchical structure (max 4 levels)
          </p>
        </div>
        <AdminButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Add Category
        </AdminButton>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {categories.length}
          </div>
          <div className="text-sm text-blue-800">Total Categories</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </div>
          <div className="text-sm text-green-800">Active</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {categories.filter(c => c.depth === 0).length}
          </div>
          <div className="text-sm text-orange-800">Root Categories</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(...categories.map(c => c.depth), 0) + 1}
          </div>
          <div className="text-sm text-purple-800">Max Depth</div>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Category Hierarchy</h4>
          <p className="text-sm text-gray-600">
            Drag and drop to reorganize. Click folder icons to expand/collapse.
          </p>
        </div>
        <div className="p-4 space-y-1">
          {categoryTree.length > 0 ? (
            categoryTree.map(node => renderCategoryNode(node))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <AdminModal
          isOpen={showModal}
          title={editingCategory ? 'Edit FAQ Category' : 'Create FAQ Category'}
          onClose={resetForm}
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <AdminFormField
                label="Category Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="e.g., Animal Care"
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None (Root Category)</option>
                  {availableParents.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.path}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AdminFormField
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              type="textarea"
              placeholder="Brief description of this category..."
              rows={3}
            />

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <AdminFormField
                label="Priority"
                type="number"
                value={formData.priority.toString()}
                onChange={(value) => setFormData({ ...formData, priority: parseInt(value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active (visible to users)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <AdminButton 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                icon={X}
              >
                Cancel
              </AdminButton>
              <AdminButton 
                type="submit" 
                variant="primary"
                icon={Save}
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
};