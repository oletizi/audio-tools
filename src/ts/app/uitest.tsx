import {createRoot} from "react-dom/client";
import * as React from "react"

const appRoot = createRoot(document.getElementById('app'))
appRoot.render(<div className={'container'}>Hi</div>)