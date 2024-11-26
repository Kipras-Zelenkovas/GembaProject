import { Link } from "react-router-dom";

export const Page500 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
            <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative text-center animate-slide-in">
                    {/* Icon container */}
                    <div className="relative inline-flex mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-primary-100 rounded-2xl blur opacity-50"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl">
                            <svg
                                className="w-12 h-12 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Error content */}
                    <div className="relative px-8 py-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl">
                        <h1 className="text-8xl font-bold bg-gradient-to-br from-yellow-600 to-primary-600 bg-clip-text text-transparent mb-4">
                            500
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Server Error
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Oops! Something went wrong on our end. Our team has
                            been notified and is working to fix the issue.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Return to Dashboard
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-lg shadow-gray-200/10 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
