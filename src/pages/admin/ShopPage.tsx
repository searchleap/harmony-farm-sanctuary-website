import React, { useState } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge } from '../../components/admin/common';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { ShoppingBag, Package, DollarSign, TrendingUp, Truck } from 'lucide-react';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';

// Mock product interface
interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  description: string;
  sku: string;
}

// Mock data
const mockProducts: ShopProduct[] = [
  {
    id: 'product_1',
    name: 'Harmony Farm T-Shirt',
    category: 'Apparel',
    price: 25.00,
    stock: 45,
    sold: 23,
    status: 'active',
    description: 'Comfortable cotton t-shirt with sanctuary logo',
    sku: 'HF-TSHIRT-001'
  },
  {
    id: 'product_2',
    name: 'Sanctuary Tote Bag',
    category: 'Accessories',
    price: 15.00,
    stock: 12,
    sold: 31,
    status: 'active',
    description: 'Eco-friendly canvas tote bag',
    sku: 'HF-TOTE-001'
  },
  {
    id: 'product_3',
    name: 'Animal Sponsorship Package',
    category: 'Sponsorship',
    price: 50.00,
    stock: 0,
    sold: 89,
    status: 'active',
    description: 'One-year animal sponsorship with updates and photos',
    sku: 'HF-SPONSOR-001'
  },
  {
    id: 'product_4',
    name: 'Farm Calendar 2025',
    category: 'Merchandise',
    price: 20.00,
    stock: 0,
    sold: 156,
    status: 'out_of_stock',
    description: 'Beautiful calendar featuring sanctuary animals',
    sku: 'HF-CAL-2025'
  }
];

export function ShopPage() {
  const { success, error } = useAdminNotifications();
  const [products] = useState<ShopProduct[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[ShopPage] Rendering with products:', products.length);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const stats = {
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sold), 0).toFixed(2),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    activeProducts: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length
  };

  // Table columns
  const columns: AdminTableColumn<ShopProduct>[] = [
    {
      key: 'name',
      title: 'Product',
      dataIndex: 'name',
      render: (name: string, product: ShopProduct) => (
        <div className="flex items-center space-x-3">
          <Package className="h-5 w-5 text-blue-500" />
          <div>
            <span className="font-medium text-gray-900">{name}</span>
            <p className="text-sm text-gray-500">{product.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      render: (category: string) => (
        <AdminStatusBadge variant="secondary">
          {category}
        </AdminStatusBadge>
      )
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => (
        <span className="font-semibold text-green-600">
          ${price.toFixed(2)}
        </span>
      )
    },
    {
      key: 'stock',
      title: 'Stock',
      dataIndex: 'stock',
      render: (stock: number) => (
        <div className="flex items-center space-x-1">
          <Package className="h-4 w-4 text-gray-400" />
          <span className={`text-sm ${stock < 10 ? 'text-red-600 font-medium' : stock < 20 ? 'text-yellow-600' : 'text-gray-900'}`}>
            {stock}
          </span>
        </div>
      )
    },
    {
      key: 'sold',
      title: 'Sold',
      dataIndex: 'sold',
      render: (sold: number) => (
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm">{sold}</span>
        </div>
      )
    },
    {
      key: 'revenue',
      title: 'Revenue',
      dataIndex: 'price',
      render: (price: number, product: ShopProduct) => (
        <span className="font-semibold text-gray-900">
          ${(price * product.sold).toFixed(2)}
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
            status === 'active' ? 'success' :
            status === 'out_of_stock' ? 'error' :
            'neutral'
          }
        >
          {status.replace('_', ' ')}
        </AdminStatusBadge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, product: ShopProduct) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => handleView(product)}
            title="View Details"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Shop', href: '/admin/shop' }
  ];

  // Event handlers
  const handleView = (product: ShopProduct) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = 'Name,SKU,Category,Price,Stock,Sold,Revenue,Status\n' + 
      filteredProducts.map(product => 
        `"${product.name}","${product.sku}","${product.category}","${product.price}","${product.stock}","${product.sold}","${(product.price * product.sold).toFixed(2)}","${product.status}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shop-products.csv';
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
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Items Sold</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSold}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminListPage
        title="Shop Management"
        description="Manage merchandise inventory and sales"
        breadcrumbs={breadcrumbs}
        data={filteredProducts}
        columns={columns}
        loading={false}
        searchPlaceholder="Search products..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={() => success('Products refreshed')}
        onExport={handleExport}
        addButtonText="Add Product"
      />

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <AdminModal
          isOpen={true}
          title="Product Details"
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProduct(null);
          }}
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <p className="text-gray-900">{selectedProduct.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <p className="text-gray-900">{selectedProduct.sku}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <p className="text-gray-900">{selectedProduct.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <p className="text-2xl font-semibold text-green-600">${selectedProduct.price.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <p className="text-gray-900">{selectedProduct.stock}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sold</label>
                <p className="text-gray-900">{selectedProduct.sold}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-900">{selectedProduct.description}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedProduct(null);
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedProduct(null);
                  success('Product updated successfully');
                }}
              >
                Edit Product
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AdminModal
          isOpen={true}
          title="Add New Product"
          onClose={() => setIsAddModalOpen(false)}
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600">Product creation form will be implemented here.</p>
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
                  success('Product created successfully');
                }}
              >
                Create Product
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}