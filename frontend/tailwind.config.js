/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                galaxy: {
                    900: '#0a0a1a', // Deep space
                    800: '#1a1a2e', // Nebula dark
                    700: '#16213e', // Nebula lighter
                },
                accent: {
                    cyan: '#00ddeb',
                    pink: '#ff00ff',
                    purple: '#bd00ff',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
