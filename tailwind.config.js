/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Because screw line #2 in .prettierignore
                "bg1": /*    */ "var(--bg-primary)",
                "bg2": /*    */ "var(--bg-accent)",
                "fg1": /*    */ "var(--fg)",
                "fg2": /*    */ "var(--fg-dim)",
                "border1": /**/ "var(--b-primary)",
                "border2": /**/ "var(--b-accent)",
                "borderF": /**/ "var(--b-focus)",

            }
        },
    },
    plugins: [],
}  