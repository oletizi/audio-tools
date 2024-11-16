import {createRoot} from "react-dom/client";
import * as React from "react"
import { Provider } from "@/components/ui/provider"

function App() {
    return (
        <Provider>
            <div>Hi</div>
        </Provider>
    )
}

const appRoot = createRoot(document.getElementById('app'))


appRoot.render(<App/>)