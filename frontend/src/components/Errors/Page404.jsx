import { Link } from "react-router-dom";

export const Page404 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
            <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative text-center animate-slide-in">
                    {/* Icon container */}
                    <div className="relative inline-flex mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-2xl blur opacity-50"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl">
                            <svg
                                className="w-12 h-12 text-secondary-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Error content */}
                    <div className="relative px-8 py-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl">
                        <h1 className="text-8xl font-bold bg-gradient-to-br from-secondary-600 to-primary-600 bg-clip-text text-transparent mb-4">
                            404
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Page Not Found
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Sorry, we couldn't find the page you're looking for.
                            The page might have been moved or deleted.
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
                                onClick={() => window.history.back()}
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
                                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                                    />
                                </svg>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
