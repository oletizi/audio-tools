import {createRoot} from "react-dom/client";
import * as React from "react"
import {Provider} from "@/components/ui/provider"
import {
    Box,
    Button, Card, Container,
    createListCollection, Field, Flex, HStack,
    SelectContent, SelectItem,
    SelectLabel,
    SelectRoot,
    SelectValueText, Stack, Tabs
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

function Tabber() {
    return (
        <Tabs.Root defaultValue="thing-3">
            <Tabs.List>
                <Tabs.Trigger value="thing-1">Thing 1</Tabs.Trigger>
                <Tabs.Trigger value="thing-2">Thing 2</Tabs.Trigger>
                <Tabs.Trigger value="thing-3">Thing 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="thing-1">Tab content for thing 1.</Tabs.Content>
            <Tabs.Content value="thing-2">Tab content for thing 2.</Tabs.Content>
            <Tabs.Content value="thing-3">
                <Card.Root>
                    <Card.Body>
                        Tab content for thing 3.
                    </Card.Body>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>
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
                <Flex align={'top'} gap={3} wrap="wrap">
                    <Card.Root>
                        <Card.Body gap={3}>
                            <Card.Description>
                                Hi. This is a nice thing in a nice card.
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Body gap={10}>
                            <Stack gap={5}>
                                <Button>Click me.</Button>
                                <Button>Click me, too.</Button>
                            </Stack>
                            <Card.Description>
                                This is a nice description. It must be text, though.
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Body>
                            <Selector data={data}/>
                        </Card.Body>
                    </Card.Root>
                    <Box flexGrow={1}>
                        <Tabber/>
                    </Box>
                </Flex>
            </Container>
        </Provider>
    )
}

const appRoot = createRoot(document.getElementById('app'))


appRoot.render(<App/>)