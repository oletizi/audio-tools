import {hello} from '@/index'
import {expect} from "chai";

describe('Top-level export works.', () => {
    it('Says hello.', () => {
        expect(hello()).eq('Hello')
    })
})