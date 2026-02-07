import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError?.message || 'Failed to sign in');
        return;
      }
      
      // Success - close modal
      onClose();
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <Icon name="X" size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Sign In to Research Portal
          </h2>
          <p className="font-body text-text-secondary">
            Access your research collaboration dashboard and connect with fellow researchers.
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-cta text-sm font-semibold text-text-primary mb-3">
            Demo Credentials
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-text-primary">Admin User</p>
                <p className="font-body text-xs text-text-secondary">admin@nara.gov.lk / admin123</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useDemoCredentials('admin@nara.gov.lk', 'admin123')}
              >
                Use
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-text-primary">Senior Researcher</p>
                <p className="font-body text-xs text-text-secondary">researcher1@nara.gov.lk / researcher123</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useDemoCredentials('researcher1@nara.gov.lk', 'researcher123')}
              >
                Use
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-text-primary">Researcher</p>
                <p className="font-body text-xs text-text-secondary">researcher2@nara.gov.lk / researcher456</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useDemoCredentials('researcher2@nara.gov.lk', 'researcher456')}
              >
                Use
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="font-body text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-cta text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              placeholder="researcher@nara.gov.lk"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-cta text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e?.target?.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={loading}
            iconName={loading ? "Loader2" : "LogIn"}
            iconPosition="left"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-text-secondary">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;