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
            },
            fontSize: {
                'xxs': '.7rem',
            },
            borderWidth: {
                1: '1px',
            }
        },
    },
    plugins: [],
}  