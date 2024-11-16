import {createRoot} from "react-dom/client"
import React from 'react'
import { chakra } from "@chakra-ui/react"
import { Provider } from "@/components/ui/provider"

const appRoot = createRoot(document.getElementById('app'))

appRoot.render(<div className={'container'}>Hi!</div>)