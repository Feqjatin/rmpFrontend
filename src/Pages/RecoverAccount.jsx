import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, resetPassword } from '../Api/Auth';
function RecoverAccount() {
  const [step, setStep] = useState(1);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    isCandidate: true,
    otp: '',
    newPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    const response = await sendOTP(formData); 
      if (response.msg != null) {
        setError(response.msg || 'Failed to send OTP');
      } else {
        setSuccess('If this email exists, OTP has been sent');
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 2000);
      }
   
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp || !formData.newPassword) {
      setError('Please enter OTP and new password');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const response = await resetPassword(formData);
      if (response.msg != null) {
        setError(response.msg || 'Failed to reset password');
      } else {
        setSuccess(response.msg || 'Password reset successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 1 ? 'Recover Your Account' : 'Reset Password'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="isCandidate"
                checked={formData.isCandidate}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">
                This is a candidate account
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : <img src="./assets/closeEye.png" width={'25px'} height={'25px'} alt="hide" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {success && (
          <p className="text-center text-sm text-green-600 mt-4">
            {success}
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-red-500 mt-4">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          {step === 1 ? (
            <>
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Back to Login
              </a>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-blue-600 hover:underline"
            >
              Back to Email
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default RecoverAccount;