import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Archive, Save, X, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  priority: number;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

const AdminFAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'general',
    status: 'draft',
    priority: 1
  });

  const categories = ['general', 'technical', 'billing', 'shipping', 'returns', 'account'];

  // Mock data for demonstration
  useEffect(() => {
    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I track my order?',
        answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You will find tracking information and estimated delivery dates there.',
        category: 'shipping',
        status: 'active',
        priority: 1,
        views: 245,
        helpful: 32,
        notHelpful: 3,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for orders above $100.',
        category: 'billing',
        status: 'active',
        priority: 2,
        views: 198,
        helpful: 28,
        notHelpful: 1,
        createdAt: '2024-01-08T09:15:00Z',
        updatedAt: '2024-01-12T16:20:00Z'
      },
      {
        id: '3',
        question: 'How do I return or exchange an item?',
        answer: 'Items can be returned within 30 days of purchase. Please ensure items are in original condition with tags attached. Visit our Returns Center to initiate a return request.',
        category: 'returns',
        status: 'active',
        priority: 3,
        views: 167,
        helpful: 22,
        notHelpful: 5,
        createdAt: '2024-01-05T11:30:00Z',
        updatedAt: '2024-01-10T13:45:00Z'
      },
      {
        id: '4',
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard SSL encryption to protect your personal and payment information. We never share your data with third parties without your consent.',
        category: 'technical',
        status: 'active',
        priority: 4,
        views: 134,
        helpful: 19,
        notHelpful: 2,
        createdAt: '2024-01-03T14:20:00Z',
        updatedAt: '2024-01-08T10:15:00Z'
      },
      {
        id: '5',
        question: 'How do I change my password?',
        answer: 'To change your password, go to Account Settings > Security > Change Password. Enter your current password and choose a new strong password.',
        category: 'account',
        status: 'draft',
        priority: 5,
        views: 89,
        helpful: 12,
        notHelpful: 1,
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-05T12:30:00Z'
      }
    ];
    
    setTimeout(() => {
      setFaqs(mockFaqs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => a.priority - b.priority);

  const handleSaveFaq = () => {
    if (!formData.question || !formData.answer) {
      alert('Please fill in both question and answer');
      return;
    }

    if (editingFaq) {
      // Update existing FAQ
      setFaqs(faqs.map(faq => 
        faq.id === editingFaq.id 
          ? { 
              ...faq, 
              ...formData,
              updatedAt: new Date().toISOString()
            } as FAQ
          : faq
      ));
      setEditingFaq(null);
    } else {
      // Add new FAQ
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.question!,
        answer: formData.answer!,
        category: formData.category || 'general',
        status: formData.status || 'draft',
        priority: formData.priority || faqs.length + 1,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFaqs([...faqs, newFaq]);
    }

    // Reset form
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      status: 'draft',
      priority: 1
    });
    setShowAddForm(false);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData(faq);
    setShowAddForm(true);
  };

  const handleDeleteFaq = (faqId: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(faq => faq.id !== faqId));
    }
  };

  const handleStatusChange = (faqId: string, newStatus: FAQ['status']) => {
    setFaqs(faqs.map(faq => 
      faq.id === faqId 
        ? { ...faq, status: newStatus, updatedAt: new Date().toISOString() }
        : faq
    ));
  };

  const moveFaqPriority = (faqId: string, direction: 'up' | 'down') => {
    const faq = faqs.find(f => f.id === faqId);
    if (!faq) return;

    const newPriority = direction === 'up' ? faq.priority - 1 : faq.priority + 1;
    if (newPriority < 1) return;

    // Swap priorities with the FAQ at the target position
    const targetFaq = faqs.find(f => f.priority === newPriority);
    
    setFaqs(faqs.map(f => {
      if (f.id === faqId) return { ...f, priority: newPriority };
      if (targetFaq && f.id === targetFaq.id) return { ...f, priority: faq.priority };
      return f;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingFaq(null);
            setFormData({
              question: '',
              answer: '',
              category: 'general',
              status: 'draft',
              priority: faqs.length + 1
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total FAQs</p>
              <p className="text-2xl font-bold text-blue-900">{faqs.length}</p>
            </div>
            <HelpCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {faqs.filter(f => f.status === 'active').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 font-medium">Draft</p>
              <p className="text-2xl font-bold text-yellow-900">
                {faqs.filter(f => f.status === 'draft').length}
              </p>
            </div>
            <Edit2 className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-purple-900">
                {faqs.reduce((sum, f) => sum + f.views, 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">#{faq.priority}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveFaqPriority(faq.id, 'up')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={faq.priority === 1}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveFaqPriority(faq.id, 'down')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={faq.priority === faqs.length}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900 line-clamp-2">{faq.question}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">{faq.answer}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={faq.status}
                      onChange={(e) => handleStatusChange(faq.id, e.target.value as FAQ['status'])}
                      className={`text-sm border rounded px-2 py-1 ${getStatusColor(faq.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{faq.views}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      <span className="text-green-600">↑{faq.helpful}</span>
                      <span className="text-red-600 ml-2">↓{faq.notHelpful}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit FAQ Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingFaq(null);
                    setFormData({
                      question: '',
                      answer: '',
                      category: 'general',
                      status: 'draft',
                      priority: 1
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={formData.question || ''}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the FAQ question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={formData.answer || ''}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Enter the answer to this question"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category || 'general'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as FAQ['status'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <input
                      type="number"
                      value={formData.priority || 1}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingFaq(null);
                    setFormData({
                      question: '',
                      answer: '',
                      category: 'general',
                      status: 'draft',
                      priority: 1
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFaq}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQs;