import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { GoogleAuth } from "../../components/GoogleAuth";
import { useUser } from "../../context/UserContext";
import { SwapEatLogo } from "../../components/SwapEatLogo";

export const UserLoginScreen = (): JSX.Element => {
    const navigate = useNavigate();
    const { signInWithEmail, isLoading } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(''); // Clear error when user starts typing
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const result = await signInWithEmail(formData.email, formData.password);
            
            if (result.error) {
                setError(result.error);
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = () => {
        navigate('/home');
    };

    const handleGoogleError = (error: any) => {
        console.error('Google Auth Error:', error);
        setError('Google sign-in failed. Please try again.');
    };

    return (
        <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen px-4 sm:px-0">
            <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] min-h-screen relative border-0 shadow-none">
                <CardContent className="p-0 h-full">
                    <div className="flex flex-col min-h-screen">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 pt-16">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-white/20 rounded-full"
                            >
                                <ArrowLeft className="w-5 h-5 text-uigray-80" />
                            </Button>
                            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
                                Sign In
                            </h2>
                            <div className="w-9" />
                        </div>

                        <div className="flex-1 px-5 py-4">
                            {/* Logo and Welcome Text */}
                            <div className="text-center mb-8">
                                <SwapEatLogo size={64} className="mb-4" />
                                <h1 className="[font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-2xl mb-2">
                                    Welcome Back!
                                </h1>
                                <p className="[font-family:'Poppins',Helvetica] font-normal text-gray-600 text-base">
                                    Sign in to continue sharing food
                                </p>
                            </div>

                            {/* Google Auth */}
                            <div className="mb-6">
                                <GoogleAuth
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    text="Continue with Google"
                                />

                                <div className="flex items-center my-6">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="px-4 text-sm text-gray-500">or</span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                            className="w-full h-12 px-4 pr-12 bg-white border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right mb-6">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-brandmain font-semibold hover:underline text-sm"
                                >
                                    Forgot Password?
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="px-5 pb-8">
                            {/* Login Button */}
                            <Button
                                onClick={handleLogin}
                                disabled={isSubmitting || isLoading}
                                className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200 mb-4 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span className="font-bold text-white text-sm">Signing In...</span>
                                    </div>
                                ) : (
                                    <span className="font-bold text-white text-sm tracking-wide">
                                        SIGN IN
                                    </span>
                                )}
                            </Button>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                                    Don't have an account?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => navigate('/signup')}
                                        className="p-0 h-auto text-brandmain font-semibold hover:underline"
                                    >
                                        Sign Up
                                    </Button>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};