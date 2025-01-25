import React, {useState} from 'react';
import {Box, Text, render, useApp, useInput, useStdout} from 'ink';
import {CliApp, newFileApp} from "@/cli/cli-app.js";
import {newStreamOutput} from "@/lib/process-output.js";
import {KeygroupHeader, Program, ProgramHeader, Sample, SampleHeader} from "@/midi/devices/s3000xl.js";
import {Button} from "@/cli/components/button.js";
import {loadClientConfig, newServerConfig} from "@/lib/config-server.js";
import {Device} from "@/midi/akai-s3000xl.js";
import fs from "fs";
import path from "path";
import {akaiFormat, AkaiToolsConfig, ExecutionResult} from "@/akaitools/akaitools.js";
import {FileChooser} from "@/cli/components/file-chooser.js";


const serverConfig = await newServerConfig()
const config = await loadClientConfig()
const logstream = fs.createWriteStream(serverConfig.logfile)
const out = newStreamOutput(logstream, logstream, true, 'cli-s3000xl-local')
const diskFilePath = path.join(serverConfig.targetRoot, 'akai.img')
const akaiToolsConfig: AkaiToolsConfig = {akaiToolsPath: "../akaitools-1.5", diskFile: diskFilePath}
function Main({app}: { app: CliApp }) {
    const [screen, setScreen] = useState(<FileChooser defaultDirectory={serverConfig.sourceRoot} onSubmit={v => {
        setScreen(<Box><Text>You chose: {v}</Text></Box>)
    }}/>)
    const {exit} = useApp()
    const stdout = useStdout()

    app.addListener('screen', (s) => {
        setScreen(s)
    })

    function quit() {
        exit()
    }

    useInput((i: string) => {
        if (!app.getIsEditing()) {
            switch (i.toUpperCase()) {
                case 'C':
                    app.doChop()
                    break
                case 'P':
                    app.doProgram()
                    break
                case 'S':
                    app.doSample()
                    break
                case 'F':
                    app.doFormat()
                    break
                case ';':
                    app.doConfig()
                    break
                case 'Q':
                    quit()
                    break
            }
        }
    })
    return (
        <>
            <Box borderStyle='single' padding='1' height={stdout.rows - 4}>{screen}</Box>
            <Box>
                <Button onClick={app.doChop}>C: Chop</Button>
                <Button onClick={app.doProgram}>P: Program</Button>
                <Button onClick={app.doSample}>S: Sample</Button>
                <Button onClick={app.doFormat}>F: Format</Button>
                <Button onClick={app.doConfig}>;: Config</Button>
                <Button onClick={quit}>Q: Quit</Button>
            </Box>
        </>
    )
}

class FileDevice implements Device {

    fetchKeygroupHeader(programNumber: number, keygroupNumber: number, header: KeygroupHeader): Promise<KeygroupHeader> {
        throw new Error("Implement Me!")
    }

    fetchProgramHeader(programNumber: number, header: ProgramHeader): Promise<ProgramHeader> {
        throw new Error("Implement Me!")
    }

    fetchProgramNames(names: string[]): Promise<string[]> {
        throw new Error("Implement Me!")
    }

    fetchSampleHeader(sampleNumber: number, header: SampleHeader): Promise<SampleHeader> {
        throw new Error("Implement Me!")
    }

    fetchSampleNames(names: any[]): Promise<String[]> {
        throw new Error("Implement Me!")
    }

    getCurrentProgram(): Program {
        throw new Error("Implement Me!")
    }

    getProgram(programNumber: number): Promise<Program> {
        throw new Error("Implement Me!")
    }

    getProgramHeader(programName: string): ProgramHeader {
        throw new Error("Implement Me!")
    }

    getProgramNames(names: string[]): string[] {
        throw new Error("Implement Me!")
    }

    getSample(sampleName: string): Promise<Sample> {
        throw new Error("Implement Me!")
    }

    getSampleNames(names: string[]): string[] {
        throw new Error("Implement Me!")
    }

    init(): Promise<void> {
        throw new Error("Implement Me!")
    }

    send(opcode: number, data: number[]) {
    }

    sendRaw(message: number[]) {
    }

    writeProgramName(header: ProgramHeader, name: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    writeProgramPolyphony(header: ProgramHeader, polyphony: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    format(partitionSize: number, partitionCount: number): Promise<ExecutionResult> {
        return akaiFormat(akaiToolsConfig, partitionSize, partitionCount)
    }
}

render(<Main app={newFileApp(config, new FileDevice(), out, diskFilePath)}/>)