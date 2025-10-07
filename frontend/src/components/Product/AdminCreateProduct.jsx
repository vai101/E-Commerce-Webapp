import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const AdminCreateProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        brand: '',
        category: '',
        stock: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await apiClient.post('/products', {
                name: form.name,
                price: Number(form.price),
                description: form.description,
                image: form.image,
                brand: form.brand,
                category: form.category,
                stock: Number(form.stock),
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="max-w-2xl mx-auto p-6 text-center text-red-500">Admin access required.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Price</label>
                        <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Stock</label>
                        <input type="number" min="0" step="1" name="stock" value={form.stock} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                    <input name="image" value={form.image} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Brand</label>
                    <input name="brand" value={form.brand} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Category</label>
                    <input name="category" value={form.category} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {submitting ? 'Creating…' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateProduct;


