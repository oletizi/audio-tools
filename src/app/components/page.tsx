"use client"
import {Knob} from "@/components/knob";
import {useState} from "react";
import {Button, Stack} from "@mui/material";

import {DoubleThrowSwitch} from "@/components/components-core";
import {AkaiDiskView} from "@/app/chopper/akai-disk-view";
import {AkaiDisk} from "@/akaitools/akaitools";

export default function Page() {
    const mainColor = "#aaaaaa"
    const [value, setValue] = useState(1)
    const [thingy, setThingy] = useState(0)
    const json = '{ "timestamp": "0", "name":"akai-1738276851687.img","partitions":[{"block":0,"name":"1","size":0,"type":"S3000 PARTITION","volumes":[{"block":3,"name":"/vol_1","records":[{"block":5,"name":"/vol_1/test_program","size":384,"type":"S3000 PROGRAM"}],"size":0,"type":"S3000 VOLUME"}]},{"block":0,"name":"2","size":0,"type":"S3000 PARTITION","volumes":[{"block":3,"name":"/vol_1","records":[{"block":5,"name":"/vol_1/test_program","size":384,"type":"S3000 PROGRAM"}],"size":0,"type":"S3000 VOLUME"}]},{"block":0,"name":"3","size":0,"type":"S3000 PARTITION","volumes":[{"block":3,"name":"/vol_1","records":[{"block":5,"name":"/vol_1/test_program","size":384,"type":"S3000 PROGRAM"}],"size":0,"type":"S3000 VOLUME"}]}]}';
    const akaiDisk: AkaiDisk = JSON.parse(json)
    const subscribers = new Set()
    const dataSource = {
        subscribe: ((onStoreChange) => {
            subscribers.add(onStoreChange)
            return () => {
                subscribers.delete(onStoreChange)
            }
        }),
        getSnapshot: () => value,
        getServerSnapshot: () => 0
    }
    return (<div className="container pt-10">
        <div className="flex gap-5">
        <AkaiDiskView data={akaiDisk} update={() => {
            const rv = JSON.parse(json)
            rv.timestampe = new Date().getTime()
            return rv
        }}/>
            <Stack className="flex flex-col items-center gap-5">
                <Knob strokeWidth={3}
                      onChange={(v) => {
                          console.log(`new value: ${v}`)
                          setValue(v)
                      }}
                      min={0}
                      max={5}
                      step={1}
                      dataSource={dataSource}
                      defaultValue={value}/>
                <div style={{color: mainColor}}>{value}</div>
                <Button onClick={() => setValue(4)}>Set Value to 4</Button>
                {thingy ? <><Knob defaultValue={64} min={0} max={127}/>
                        <div>Thingy B</div>
                    </>
                    : <><Knob defaultValue={127} min={0} max={127}/>
                        <div>Thingy A</div>
                    </>}
                <DoubleThrowSwitch aLabel="A Label" bLabel="B Label"
                                   onChange={(v) => setThingy(v)}/>
            </Stack>
        </div>
    </div>)
}

