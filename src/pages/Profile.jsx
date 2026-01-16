import React, { useState, useEffect } from "react";
import { base44 } from '../api/base44Client';
import { motion } from "framer-motion";
import { UserIcon, Mail, Calendar, Edit3, Save, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setIsLoading(true);
        try {
            const userData = await base44.auth.me();
            setUser(userData);
            setEditData(userData);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await base44.auth.updateMe(editData);
            setUser(editData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setEditData(user);
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-gray-200 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-48" />
                                <div className="h-4 bg-gray-200 rounded w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Please sign in to view your profile
                    </h2>
                    <Button onClick={() => base44.auth.redirectToLogin()}>
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account information</p>
                </motion.div>

                <div className="grid gap-6">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5" />
                                Personal Information
                            </CardTitle>
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="gap-2"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarFallback className="text-xl">
                                        {getInitials(user.full_name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-4">
                                    {isEditing ? (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="full_name">Full Name</Label>
                                                    <Input
                                                        id="full_name"
                                                        value={editData.full_name || ''}
                                                        onChange={(e) => setEditData({
                                                            ...editData,
                                                            full_name: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        value={user.email}
                                                        disabled
                                                        className="bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input
                                                        id="phone"
                                                        value={editData.phone || ''}
                                                        onChange={(e) => setEditData({
                                                            ...editData,
                                                            phone: e.target.value
                                                        })}
                                                        placeholder="Enter your phone number"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input
                                                        id="address"
                                                        value={editData.address || ''}
                                                        onChange={(e) => setEditData({
                                                            ...editData,
                                                            address: e.target.value
                                                        })}
                                                        placeholder="Enter your address"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {user.full_name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Member since {new Date(user.created_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                                                    <p className="text-gray-600">
                                                        {user.phone || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                                                    <p className="text-gray-600">
                                                        {user.address || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Account Status</h4>
                                        <p className="text-sm text-gray-600">Your account is active</p>
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        Active
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Role</h4>
                                        <p className="text-sm text-gray-600">Account type</p>
                                    </div>
                                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                                        {user.role}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Sign Out</h4>
                                        <p className="text-sm text-gray-600">Sign out from your account</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => base44.auth.logout()}
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}