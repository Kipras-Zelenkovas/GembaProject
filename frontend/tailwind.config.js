/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                custom: "var(--tw-shadow)",
                soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                "soft-xl":
                    "0 5px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
            colors: {
                background: "#f8fafc",
                text: "#0f172a",
                primary: {
                    50: "#f0fdf4",
                    100: "#dcfce7",
                    200: "#bbf7d0",
                    300: "#86efac",
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a",
                    700: "#15803d",
                    800: "#166534",
                    900: "#14532d",
                },
                secondary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                },
            },
            width: {
                "1/10": "10%",
                "2/10": "20%",
                "3/10": "30%",
                "4/10": "40%",
                "5/10": "50%",
                "6/10": "60%",
                "7/10": "70%",
                "8/10": "80%",
                "9/10": "90%",
                "main-window": "100%",
            },
            maxWidth: {
                "1/10": "10%",
                "2/10": "20%",
                "3/10": "30%",
                "4/10": "40%",
                "5/10": "50%",
                "6/10": "60%",
                "7/10": "70%",
                "8/10": "80%",
                "9/10": "90%",
                "main-window": "100%",
            },
            height: {
                "audit-question": "calc(100vh - 4rem)",
            },
            maxHeight: {
                "audit-question": "calc(100vh - 4rem)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-in": "slideIn 0.5s ease-out",
                "scale-in": "scaleIn 0.5s ease-out",
                blob: "blob 7s infinite",
                ping: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateY(-10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
