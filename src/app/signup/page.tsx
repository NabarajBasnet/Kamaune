import Link from 'next/link'
import {
    Eye,
    EyeOff,
    CheckCircle,
    RefreshCw,
    Smartphone
} from 'lucide-react'

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

            {/* Left Side - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 items-center justify-center p-12">
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
                        Promote brands, track links, earn on-the-go!
                    </h2>
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">Download on App Store</div>
                            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">Get it on Google Play</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            or <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Log in here</Link>
                        </p>
                    </div>

                    <form className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                placeholder="Email"
                            />
                        </div>

                        {/* Username Field */}
                        <div>
                            <input
                                type="text"
                                name="username"
                                className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                placeholder="Username"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full px-4 py-4 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Minimum 8 characters with a capital letter, symbol and number.
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full px-4 py-4 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                I agree with Involve Asia's <Link href="#" className="text-blue-600 hover:text-blue-700">Terms of Use</Link> and <Link href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all py-4 text-base font-medium rounded-lg"
                        >
                            Create Account
                        </button>

                        {/* Social Login Options */}
                        <div className="mt-8 space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Facebook</span>
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Apple</span>
                            </button>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500">OR</span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Are you a Brand? <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">Log in here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Success State Component (separate component you can conditionally render)
export function SignupSuccessState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Registration Successful!
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your account has been created. Redirecting to login...
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redirecting...</span>
                </div>
            </div>
        </div>
    )
}