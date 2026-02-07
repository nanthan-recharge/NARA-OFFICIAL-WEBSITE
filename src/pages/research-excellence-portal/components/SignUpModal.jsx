import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    institution: '',
    department: '',
    positionTitle: '',
    role: 'researcher',
    bio: '',
    researchInterests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const roleOptions = [
    { value: 'researcher', label: 'Researcher' },
    { value: 'postdoc', label: 'Postdoctoral Researcher' },
    { value: 'phd_student', label: 'PhD Student' },
    { value: 'senior_researcher', label: 'Senior Researcher' },
    { value: 'collaborator', label: 'External Collaborator' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Create account with Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, formData?.email, formData?.password);
      const uid = cred?.user?.uid;

      // Create researcher profile in Firestore
      const profileDoc = {
        uid,
        email: formData?.email,
        full_name: formData?.fullName,
        institution: formData?.institution || '',
        department: formData?.department || '',
        position_title: formData?.positionTitle || '',
        role: formData?.role,
        bio: formData?.bio || '',
        research_interests: formData?.researchInterests?.split(',')?.map(i => i?.trim())?.filter(Boolean) || [],
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(doc(db, 'researcherProfiles', uid), profileDoc);

      setSuccess(true);
    } catch (error) {
      setError(error?.message || 'An unexpected error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        institution: '',
        department: '',
        positionTitle: '',
        role: 'researcher',
        bio: '',
        researchInterests: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <Icon name="X" size={24} />
        </button>

        {/* Success State */}
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
              Account Created Successfully!
            </h2>
            <p className="font-body text-text-secondary mb-6">
              Please check your email for a verification link to complete your registration.
            </p>
            <Button
              variant="default"
              onClick={onClose}
              iconName="Mail"
              iconPosition="left"
            >
              Check Email
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
                Join the Research Community
              </h2>
              <p className="font-body text-text-secondary">
                Create your researcher profile and start collaborating with marine scientists worldwide.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="font-body text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={formData?.fullName}
                    onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                    placeholder="Dr. Jane Smith"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    placeholder="jane.smith@university.edu"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Password *
                  </label>
                  <Input
                    type="password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    placeholder="Minimum 6 characters"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Confirm Password *
                  </label>
                  <Input
                    type="password"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Institution
                  </label>
                  <Input
                    type="text"
                    value={formData?.institution}
                    onChange={(e) => handleInputChange('institution', e?.target?.value)}
                    placeholder="University of Colombo"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Department
                  </label>
                  <Input
                    type="text"
                    value={formData?.department}
                    onChange={(e) => handleInputChange('department', e?.target?.value)}
                    placeholder="Marine Biology Department"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Position Title
                  </label>
                  <Input
                    type="text"
                    value={formData?.positionTitle}
                    onChange={(e) => handleInputChange('positionTitle', e?.target?.value)}
                    placeholder="Research Scientist"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                    Role *
                  </label>
                  <Select
                    options={roleOptions}
                    value={formData?.role}
                    onChange={(value) => handleInputChange('role', value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                  Bio
                </label>
                <textarea
                  value={formData?.bio}
                  onChange={(e) => handleInputChange('bio', e?.target?.value)}
                  placeholder="Brief description of your research background and interests..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={loading}
                />
              </div>

              {/* Research Interests */}
              <div>
                <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                  Research Interests
                </label>
                <Input
                  type="text"
                  value={formData?.researchInterests}
                  onChange={(e) => handleInputChange('researchInterests', e?.target?.value)}
                  placeholder="Marine Biology, Coral Reefs, Climate Change (comma-separated)"
                  disabled={loading}
                />
                <p className="font-body text-xs text-text-secondary mt-1">
                  Separate multiple interests with commas
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={loading}
                iconName={loading ? "Loader2" : "UserPlus"}
                iconPosition="left"
              >
                {loading ? 'Creating Account...' : 'Create Research Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="font-body text-sm text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToSignIn}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;