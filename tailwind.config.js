/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "bg1":     "var(--bg-primary)",
                "bg2":     "var(--bg-accent)",
                "fg1":     "var(--fg)",
                "fg2":     "var(--fg-dim)",
                "b1":      "var(--b-primary)",
                "b2":      "var(--b-accent)",
                "bF":      "var(--b-focus)",

            },
            fontSize: {
                'xxs': '.6rem',
            },
        },
    },
    plugins: [],
}  