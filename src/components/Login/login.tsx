"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle,
    RefreshCw,
    Smartphone,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginService } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/states/store/authSlice";

// Zod validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .max(100, { message: "Email must be less than 100 characters" })
        .transform((email) => email.toLowerCase().trim()),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(4, { message: "Password must be at least 8 characters" })
        .max(50, { message: "Password must be less than 50 characters" })
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //     {
    //         message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    //     }
    // ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginComponent() {
    const dispatch = useDispatch();

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting, isLoading, isValid, isDirty },
        handleSubmit,
        clearErrors,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onHandleSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            setServerError(null);
            clearErrors();

            const res = await loginService(data);
            if (res?.data) {
                setIsSuccess(true);
                dispatch(
                    setCredentials({
                        email: res.data.email,
                        access: "", // stored in httpOnly cookie
                        refresh: "", // stored in httpOnly cookie
                    })
                );
                setTimeout(() => {
                    const params = new URLSearchParams(window.location.search);
                    const next = params.get('next') || "/dashboard";
                    router.push(next);
                }, 1000);
            } else {
                if (res.errors) {
                    if ((res.errors as any).form) {
                        setServerError((res.errors as any).form as string);
                    }
                    Object.entries(res.errors).forEach(([field, message]) => {
                        setError(field as keyof LoginFormData, {
                            type: "server",
                            message: message as string,
                        });
                    });
                }
            }
        } catch (error: any) {
            console.error("Error: ", error);
        }
    };

    // Clear server error when user starts typing
    const handleInputChange = (field: keyof LoginFormData) => {
        if (serverError) {
            setServerError(null);
        }
        if (errors[field]) {
            clearErrors(field);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 text-center glass">
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-brand" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Login Successful!
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Welcome back! Redirecting you to your dashboard...
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Loading your dashboard...</span>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full dark:bg-gray-900 min-h-screen bg-gray-50 flex">
            {/* Left Side - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="mb-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-blue-300 rounded-full blur-2xl opacity-50"></div>
                            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-72 h-96 mx-auto flex items-center justify-center">
                                <Smartphone className="w-32 h-32 text-gray-300" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        Welcome back to Kamaune!
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Track your earnings, manage campaigns, and grow your affiliate
                        income.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Log In
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            or{" "}
                            <Link
                                href="/signup"
                                className="text-green-500 hover:text-brand-600 font-medium"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {isLocked && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Account temporarily locked</p>
                                <p>Too many failed attempts. Please try again in 5 minutes.</p>
                            </div>
                        </div>
                    )}

                    {serverError && !isLocked && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Login failed</p>
                                <p>{serverError}</p>
                            </div>
                        </div>
                    )}

                    {loginAttempts > 0 && !isLocked && (
                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
                            <p>Failed attempts: {loginAttempts}/5</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit(onHandleSubmit)}>
                        {/* Email Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="email"
                                    {...register('email')}
                                    onChange={(e) => {
                                        register('email').onChange(e);
                                        handleInputChange('email');
                                    }}
                                    className={cn(
                                        "w-full px-4 py-4 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base transition-colors",
                                        errors.email
                                            ? "border-red-300 dark:border-red-700 focus:ring-red-200 focus:border-red-400"
                                            : "border-gray-200 dark:border-gray-700"
                                    )}
                                    placeholder="Email"
                                    disabled={isLoading || isLocked}
                                />
                                <Mail className={cn(
                                    "absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                                    errors.email ? "text-red-400" : "text-gray-400"
                                )} />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    onChange={(e) => {
                                        register('password').onChange(e);
                                        handleInputChange('password');
                                    }}
                                    className={cn(
                                        "w-full px-4 py-4 pr-12 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base transition-colors",
                                        errors.password
                                            ? "border-red-300 dark:border-red-700 focus:ring-red-200 focus:border-red-400"
                                            : "border-gray-200 dark:border-gray-700"
                                    )}
                                    placeholder="Password"
                                    disabled={isLoading || isLocked}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        disabled={isLoading || isLocked}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                    <Lock className={cn(
                                        "w-5 h-5",
                                        errors.password ? "text-red-400" : "text-gray-400"
                                    )} />
                                </div>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password.message}
                                </p>
                            )}
                            {!errors.password && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                                </p>
                            )}
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                                    disabled={isLoading || isLocked}
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-green-500 hover:text-brand-600 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || isLocked || !isValid || !isDirty}
                            className="w-full text-white cursor-pointer bg-green-500 hover:bg-brand-600 transition-all py-6 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                                    Logging In...
                                </>
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>

                        {/* Social Login Options */}
                        <div className="mt-8 space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                disabled={isLoading || isLocked}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#1877F2"
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Continue with Facebook
                                </span>
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                disabled={isLoading || isLocked}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Continue with Google
                                </span>
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                disabled={isLoading || isLocked}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Continue with Apple
                                </span>
                            </button>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500">
                                    OR
                                </span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Are you a Brand?{" "}
                            <Link
                                href="/brand/login"
                                className="text-green-500 hover:text-brand-600 font-medium transition-colors"
                            >
                                Log in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}