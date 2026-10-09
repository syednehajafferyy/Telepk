import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/ecommerce';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  Check,
  X,
  Layers,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const CatalogManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateProductStock, categories } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form for New / Edit Product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: 'Anker',
    category: 'Wireless Earbuds',
    price: 4999,
    originalPrice: 6500,
    stock: 25,
    lowStockThreshold: 5,
    sku: 'TLX-NEW-01',
    description: 'High-performance audio gear with premium warranty support.',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    reviewCount: 15,
    features: ['Official 1-Year TeleX Pakistan Warranty', 'Fast Type-C Charging'],
    specs: { 'Bluetooth': '5.3', 'Battery': '30 Hours' },
    variants: [
      { id: 'v1', colorName: 'Midnight Black', colorHex: '#0f172a', priceDelta: 0, stock: 15 },
      { id: 'v2', colorName: 'Ceramic White', colorHex: '#ffffff', priceDelta: 0, stock: 10 },
    ],
    tags: ['New Arrival'],
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'QCY Official',
      category: 'Wireless Earbuds',
      price: 4999,
      originalPrice: 6500,
      stock: 20,
      lowStockThreshold: 5,
      sku: `TLX-${Math.floor(1000 + Math.random() * 9000)}`,
      description: 'Authentic imported gadgets with check warranty.',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
      rating: 4.8,
      reviewCount: 12,
      features: ['Official Warranty', 'Original Box'],
      specs: { 'Origin': 'Original Import' },
      variants: [
        { id: 'v1', colorName: 'Black', colorHex: '#000000', priceDelta: 0, stock: 10 },
        { id: 'v2', colorName: 'White', colorHex: '#ffffff', priceDelta: 0, stock: 10 },
      ],
      tags: ['New Arrival'],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData,
      } as Product);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name!,
        slug: formData.name!.toLowerCase().replace(/\s+/g, '-'),
        brand: formData.brand || 'TeleX Genuine',
        category: formData.category || 'Wireless Earbuds',
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock: Number(formData.stock || 10),
        lowStockThreshold: Number(formData.lowStockThreshold || 5),
        sku: formData.sku || `TLX-${Date.now().toString().slice(-4)}`,
        description: formData.description || '',
        images: formData.images || ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
        rating: 4.9,
        reviewCount: 1,
        features: formData.features || [],
        specs: formData.specs || {},
        variants: formData.variants || [],
        tags: formData.tags || ['New Arrival'],
      };
      addProduct(newProduct);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950">
            Catalog & Inventory Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage multi-variant gadgets, SKU stock thresholds, bulk pricing, and specifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: 'var(--color-primary)' }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-md shadow-gray-300 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-gray-700 cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (PKR)</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 truncate">{p.name}</p>
                          <span className="font-mono text-[10px] text-gray-400 block">
                            SKU: {p.sku} • {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      Rs. {p.price.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            isLowStock
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-3 h-3" />}
                          {p.stock} units {isLowStock ? '(Low Stock)' : ''}
                        </span>

                        {/* Inline quick stock adjuster */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px]"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 5)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-gray-500">
                        {p.variants?.length || 0} color(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-gray-950 mb-4">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Tech Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. QCY Crossky GTR Wireless Earbuds"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={formData.category || 'Wireless Earbuds'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">SKU Code</label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-full py-3 text-white font-bold rounded-xl shadow transition"
                >
                  {editingProduct ? 'Save Product Updates' : 'Publish Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
