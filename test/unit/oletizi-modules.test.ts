import {hello} from '@oletizi/translate'
import {expect} from "chai";

describe('Testing @oletizi modules', () => {
    it('Says hello.', () => {
        expect(hello()).eq("Hello")
    })
})