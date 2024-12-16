/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                c1: "var(--c1)",
                c2: "var(--c2)",
                c3: "var(--c3)",
                c4: "var(--c4)",
                c1e: "var(--c1e)",
                c2e: "var(--c2e)",
                c3e: "var(--c3e)",
                c4e: "var(--c4e)",
                cp: "var(--cp)",
                cs: "var(--cs)",
            },
            fontSize: {
                'xxs': '.7rem',
            },
            borderWidth: {
                1: '1px',
            },
            // To hell with mobile-first...
            screens: {
              'xs': { max: '639px' },   // max-width: 639px
              'sm': { max: '767px' },   // max-width: 767px
              'md': { max: '1023px' },  // max-width: 1023px
              'lg': { max: '1279px' },  // max-width: 1279px
              'xl': { max: '1535px' },  // max-width: 1535px
            }
        },
    },
    plugins: [],
}  