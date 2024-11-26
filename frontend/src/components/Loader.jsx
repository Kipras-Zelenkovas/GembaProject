export const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="relative">
                {/* Background blur effects */}
                <div className="absolute -inset-4">
                    <div className="w-full h-full mx-auto rotate-180">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 blur-lg opacity-20 animate-pulse"></div>
                    </div>
                </div>

                {/* Main loader */}
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-[spin_1s_linear_infinite]"></div>

                    {/* Middle spinning ring */}
                    <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-4 border-secondary-100 border-t-secondary-600 animate-[spin_1.5s_linear_infinite]"></div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-ping"></div>
                            <div className="relative rounded-full bg-white w-full h-full flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600 animate-pulse">
                        Loading...
                    </span>
                </div>
            </div>
        </div>
    );
};
