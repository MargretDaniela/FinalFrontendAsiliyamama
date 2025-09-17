import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner, Alert } from 'react-bootstrap';

// Removed all react-image-crop imports as image functionality is removed
// Removed canvasPreview import as image functionality is removed

// The onProfileUpdate prop is used to notify the DashboardApp about name changes
const AdminProfileSettingsPage = ({ onProfileUpdate }) => {
    // Removed all image-related states
    // const [profilePicPreview, setProfilePicPreview] = useState(null);
    // const [isUploadingPic, setIsUploadingPic] = useState(false);
    // const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState('https://placehold.co/150x150/800000/FFFFFF?text=PROFILE');

    // Removed all image-related refs and cropping states
    // const imgRef = useRef(null);
    // const previewCanvasRef = useRef(null);
    // const [imgSrc, setImgSrc] = useState('');
    // const [crop, setCrop] = useState();
    // const [completedCrop, setCompletedCrop] = useState();
    // const [scale, setScale] = useState(1);
    // const [rotate, setRotate] = useState(0);
    // const aspect = 1 / 1;

    // State for Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // State for General Profile Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
    const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

    // Effect to fetch user profile details on component mount
    useEffect(() => {
        const fetchUserProfileDetails = async () => {
            setIsLoadingProfile(true);
            setFetchError(null);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    toast.error("Not authenticated. Please log in.");
                    setIsLoadingProfile(false);
                    return;
                }
                const response = await axios.get(`${AUTH_API_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = response.data;
                setFirstName(userData.first_name || '');
                setLastName(userData.last_name || '');
                setContact(userData.contact || '');
                setEmail(userData.email || '');
                // Removed currentProfilePicUrl update
            } catch (error) {
                console.error('Error fetching user profile details:', error.response?.data || error.message);
                setFetchError(error.response?.data?.message || 'Failed to fetch user profile details.');
                toast.error(error.response?.data?.message || 'Failed to fetch user profile details.');
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchUserProfileDetails();
    }, [AUTH_API_URL, API_BASE_URL]);
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill all password fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New password and confirm new password do not match.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        setIsChangingPassword(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${AUTH_API_URL}/profile/change_password`, {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success(response.data.message || "Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error changing password:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // --- General Profile Info Update Handler ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${AUTH_API_URL}/profile/update`, {
                first_name: firstName,
                last_name: lastName,
                contact: contact,
                email: email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success(response.data.message || "Profile updated successfully!");
            if (onProfileUpdate) {
                onProfileUpdate(firstName, lastName);
            }
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    // Calculate initials and full name for display
    const userInitials = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : '';
    const userFullName = (firstName && lastName) ? `${firstName} ${lastName}` : '';


    if (isLoadingProfile) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading profile...</span>
                </Spinner>
                <p className="mt-2">Loading profile details...</p>
            </div>
        );
    }

    if (fetchError) {
        return <Alert variant="danger" className="m-4">Error: {fetchError}</Alert>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Profile Settings</h2>

            {/* User Initials Display */}
            <div className="d-flex flex-column align-items-center mb-4">
                <div
                    className="rounded-full bg-maroon text-white d-flex justify-content-center align-items-center font-bold shadow-lg"
                    style={{
                        width: '100px',
                        height: '100px',
                        fontSize: '3rem',
                        backgroundColor: '#800000', // Maroon background for the circle
                        color: '#FFFFFF', // White text for initials
                        borderRadius: '50%', // Makes it a perfect circle
                        border: '3px solid #FFD700', // Gold border for emphasis
                    }}
                >
                    {userInitials}
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-gray-800">{userFullName}</h3>
                <p className="text-gray-600">You are managing your profile information.</p>
            </div>

            {/* General Profile Information Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>General Information</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contact" className="form-label">Contact</label>
                            <input type="text" className="form-control" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Removed Profile Picture Update Section entirely */}

            {/* Change Password Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Change Password</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                            <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileSettingsPage;
