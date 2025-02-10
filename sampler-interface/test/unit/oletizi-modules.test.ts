import {hello, description} from '@oletizi/sampler-translate'
import {pad} from '@oletizi/sampler-lib'
import {expect} from "chai";

describe('Testing @oletizi modules', () => {
    it('Says hello.', () => {
        expect(hello()).eq("Hello")
    })
    it ('Exports description() from @oletizi/sampler-translate', () => {
        console.log(description())
    })

    it('Exports pad() from @oletizi/sampler-lib', () => {
    	expect(pad).to.exist()
    })
})