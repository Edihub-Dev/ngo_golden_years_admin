'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { blogApi } from '@/lib/api';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Blog {
  _id: string;
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Impact Report',
    image: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getAll();
      if (response.success) {
        setBlogs(response.data as Blog[]);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const response = await blogApi.update(editingBlog._id, formData);
        if (response.success) {
          alert('Blog updated successfully');
          setEditingBlog(null);
        }
      } else {
        const response = await blogApi.create(formData);
        if (response.success) {
          alert('Blog created successfully');
        }
      }
      setIsFormOpen(false);
      setFormData({ title: '', category: 'Impact Report', image: '', excerpt: '', content: '' });
      fetchBlogs();
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Failed to save blog');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await blogApi.delete(id);
      if (response.success) {
        alert('Blog deleted successfully');
        fetchBlogs();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      image: blog.image,
      excerpt: blog.excerpt,
      content: blog.content
    });
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
            <p className="text-gray-600">Create and edit stories for your journal</p>
          </div>
          <button 
            onClick={() => { setIsFormOpen(true); setEditingBlog(null); setFormData({ title: '', category: 'Impact Report', image: '', excerpt: '', content: '' }); }}
            className="bg-[#00b749] hover:bg-[#00a040] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Blog
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-6">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00b749] outline-none" 
                  placeholder="Enter blog title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00b749] outline-none"
                  required
                >
                  <option>Impact Report</option>
                  <option>Community Story</option>
                  <option>Health & Wellness</option>
                  <option>Event Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00b749] outline-none"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
                <textarea 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00b749] outline-none h-20 resize-none"
                  placeholder="Briefly describe what this blog is about..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00b749] outline-none h-60 resize-none"
                  placeholder="Write the full blog content here..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#00b749] text-white rounded-lg hover:bg-[#00a040] font-semibold transition-colors"
                >
                  {editingBlog ? 'Update Post' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading blogs...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blog Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-16 bg-gray-100 rounded mr-3 overflow-hidden">
                          <img src={blog.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{blog.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{blog.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
