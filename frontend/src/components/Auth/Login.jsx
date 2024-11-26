import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { login } from "../../../controllers/auth.js";

export const Login = () => {
    const [error, setError] = useState(null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-10 left-20 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                    {/* Content */}
                    <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-slide-in">
                        {/* Logo/Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-block p-2 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl">
                                <div className="bg-white p-3 rounded-xl shadow-soft">
                                    <img
                                        className="h-16 w-16 transform transition-transform hover:scale-110 duration-300"
                                        src="./LFUS.png"
                                        alt="Logo"
                                    />
                                </div>
                            </div>
                            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 animate-fade-in">
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800 font-medium">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            onSubmit={(values) => {
                                login(values).then((res) => {
                                    if (res.status === 200) {
                                        localStorage.setItem("id", res.id);
                                        localStorage.setItem("name", res.name);
                                        localStorage.setItem(
                                            "email",
                                            res.email
                                        );
                                        window.location.href = "/dashboard";
                                    } else {
                                        setError(res.message);
                                    }
                                });
                            }}
                        >
                            {({ values, errors }) => (
                                <Form className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email address
                                        </label>
                                        <div className="mt-1 relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                    />
                                                </svg>
                                            </div>
                                            <Field
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full pl-10 appearance-none rounded-xl border border-gray-200 bg-white/50 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm transition-all duration-300"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <div className="mt-1 relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300"
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
                                            <Field
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                className="block w-full pl-10 appearance-none rounded-xl border border-gray-200 bg-white/50 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm transition-all duration-300"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="relative w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2"
                                        >
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <svg
                                                    className="h-5 w-5 text-primary-300 group-hover:text-primary-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                            </span>
                                            Sign in
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};
