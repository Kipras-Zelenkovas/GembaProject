import { Link } from "react-router-dom";

export const Page403 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
            <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative text-center animate-slide-in">
                    {/* Icon container */}
                    <div className="relative inline-flex mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-primary-100 rounded-2xl blur opacity-50"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl">
                            <svg
                                className="w-12 h-12 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Error content */}
                    <div className="relative px-8 py-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl">
                        <h1 className="text-8xl font-bold bg-gradient-to-br from-red-600 to-primary-600 bg-clip-text text-transparent mb-4">
                            403
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Sorry, you don't have permission to access this
                            page. Please contact your administrator if you
                            believe this is a mistake.
                        </p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};
