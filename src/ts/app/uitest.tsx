import {createRoot} from "react-dom/client";
import * as React from "react"
import {Provider} from "@/components/ui/provider"
import {
    Button,
    createListCollection,
    HStack,
    SelectContent, SelectItem,
    SelectLabel,
    SelectRoot,
    SelectValueText
} from "@chakra-ui/react";
import {SelectTrigger} from "@/components/ui/select";

function App() {
    const data = createListCollection({
        items: [
            {label: "React.js", value: "react"},
            {label: "Vue.js", value: "vue"},
            {label: "Angular", value: "angular"},
            {label: "Svelte", value: "svelte"},
        ]
    })
    return (
        <Provider>
            <div>Hi</div>
            <HStack>
                <Button>Click me</Button>
                <Button>Click me</Button>
            </HStack>
            <SelectRoot collection={data}>
                <SelectLabel>Select a thingy</SelectLabel>
                <SelectTrigger>
                    <SelectValueText placeholder={'Select a thingy...'}/>
                </SelectTrigger>
                <SelectContent>
                    {data.items.map((item)=>(
                        <SelectItem item={item} key={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </Provider>
    )
}

const appRoot = createRoot(document.getElementById('app'))


appRoot.render(<App/>)