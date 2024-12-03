import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

import {library} from "@fortawesome/fontawesome-svg-core"
import {fas} from "@fortawesome/free-solid-svg-icons" // Solid
import {far} from "@fortawesome/free-regular-svg-icons" // Regular
import {fab} from "@fortawesome/free-brands-svg-icons" // Brand

library.add(fas, far, fab)

createRoot(document.querySelector("main")!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
