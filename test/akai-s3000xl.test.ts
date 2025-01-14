import * as midi from 'midi'
import {expect} from "chai";

describe('s3000xl midi tests', () => {
    it('gets a midi input', () => {
        const input = new midi.Input()
        expect(input).to.exist
        expect(input.getPortCount()).gte(1)
        for (let i=0; i<input.getPortCount(); i++){
            console.log(`Input [${i}]: ${input.getPortName(i)}`)
        }
    })

    it ('gets a midi output', () => {
        const output = new midi.Output()
        expect(output).to.exist
        expect(output.getPortCount()).gte(1)
        for (let i=0; i<output.getPortCount(); i++) {
            console.log(`Output [${i}]: ${output.getPortName(i)}`)
        }
    })
})

