import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogAdmin() {
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        coverImage: '',
        tags: '',
        content: '',
        publishedAt: new Date().toISOString()
    });

    useEffect(() => {
        loadUser();
        loadPosts();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
            if (currentUser.role !== 'admin') {
                toast.error('يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة');
            }
        } catch (error) {
            base44.auth.redirectToLogin();
        }
    };

    const loadPosts = async () => {
        const data = await base44.entities.Post.list('-publishedAt', 50);
        setPosts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const postData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        };

        if (editingPost) {
            await base44.entities.Post.update(editingPost.id, postData);
            toast.success('تم تحديث المقالة بنجاح');
        } else {
            await base44.entities.Post.create(postData);
            toast.success('تم إضافة المقالة بنجاح');
        }

        resetForm();
        loadPosts();
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            coverImage: post.coverImage || '',
            tags: post.tags?.join(', ') || '',
            content: post.content,
            publishedAt: post.publishedAt || new Date().toISOString()
        });
        setIsEditing(true);
    };

    const handleDelete = async (postId) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
            await base44.entities.Post.delete(postId);
            toast.success('تم حذف المقالة');
            loadPosts();
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            coverImage: '',
            tags: '',
            content: '',
            publishedAt: new Date().toISOString()
        });
        setEditingPost(null);
        setIsEditing(false);
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-3xl font-bold">غير مصرح لك بالدخول</h1>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] bg-clip-text text-transparent">
                    إدارة المدونة
                </h1>
                {!isEditing && (
                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-purple)]"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        مقالة جديدة
                    </Button>
                )}
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">
                        {editingPost ? 'تعديل المقالة' : 'مقالة جديدة'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">العنوان</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="عنوان المقالة"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">الرابط (Slug)</label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                placeholder="سيتم إنشاؤه تلقائياً من العنوان"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                            <Input
                                value={formData.coverImage}
                                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">الوسوم (مفصولة بفاصلة)</label>
                            <Input
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                placeholder="منتجات غريبة, تسوق, مراجعات"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">المحتوى (Markdown)</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                required
                                rows={15}
                                placeholder="اكتب محتوى المقالة هنا..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" />
                                حفظ
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                <X className="w-4 h-4 mr-2" />
                                إلغاء
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex justify-between items-center">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(post.publishedAt).toLocaleDateString('ar-SA')}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(post)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}