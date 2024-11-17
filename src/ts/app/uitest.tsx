import {createRoot} from "react-dom/client";
import * as React from "react"
import {Provider} from "@/components/ui/provider"
import {
    Button, Card, Container,
    createListCollection, Field, Flex, HStack,
    SelectContent, SelectItem,
    SelectLabel,
    SelectRoot,
    SelectValueText
} from "@chakra-ui/react";
import {SelectTrigger} from "@/components/ui/select";

function Selector({data}) {
    return (
        <SelectRoot collection={data}>
            <SelectLabel>Select a thingy</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder={'Select a thingy...'}/>
            </SelectTrigger>
            <SelectContent>
                {data.items.map((item) => (
                    <SelectItem item={item} key={item.value}>{item.label}</SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}

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
            <Container>
                <Flex align={'center'} gap={3}>
                    <Card.Root>
                        <Card.Body>
                            <Card.Description>
                                Hi. This is a nice thing in a nice card.
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                    <Selector data={data}/>
                </Flex>
            </Container>
        </Provider>
    )
}

const appRoot = createRoot(document.getElementById('app'))


appRoot.render(<App/>)