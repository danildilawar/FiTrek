import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';

interface LoginFormProps {
  onComplete: () => void;
}

export function LoginForm({ onComplete }: LoginFormProps) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  const { login, signup } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (isNewUser && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      if (isNewUser) {
        const result = await signup(formData.email, formData.password, formData.username);
        
        console.log('📝 Signup result:', result);
        if (result.needsEmailConfirmation) {
          setSuccess(`Welcome ${formData.username}! Please check your email for a confirmation link to complete your registration.`);
          return;
        }
        console.log('🎯 Signup successful, calling onComplete');
      } else {
        const result = await login(formData.email, formData.password);
        
        console.log('🔑 Login result:', result);
        if (result.needsEmailConfirmation) {
          setError('Please confirm your email address before logging in. Check your email inbox for the confirmation link.');
          return;
        }
        console.log('🎯 Login successful, calling onComplete');
      }

      onComplete();
    } catch (err) {
      console.error('Auth error:', err);
      
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          errorMessage = 'Connection failed. Please check your internet connection and Supabase configuration.';
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-montserrat mb-2">
              FiTrek
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {isNewUser ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm sm:text-base">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {isNewUser && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="input-field pl-12"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="input-field pl-12"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {isNewUser && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    className="input-field pl-12"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="button-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {isNewUser ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsNewUser(!isNewUser);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-primary hover:text-primary/80 text-sm font-medium block text-center transition-all duration-300 hover:scale-105 active:scale-95 py-2 px-4 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10"
              >
                {isNewUser ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}