import {newProgress, Progress} from "../src/ts/model/progress.ts"
import {expect} from "chai";

describe('Progress', () => {
    it('Calculates progress', () => {
        const progress = newProgress()
        expect(progress.getProgress()).to.eq(0)

        progress.setTotal(-1)
        expect(progress.getProgress()).to.eq(0)


        progress.setTotal(100)
        expect(progress.getProgress()).to.eq(0)

        progress.setCompleted(-1)
        expect(progress.getProgress()).to.eq(0)

        progress.setCompleted(0)
        progress.incrementCompleted(1)
        expect(progress.getProgress()).to.eq(0.01)

        progress.setCompleted(99)
        expect(progress.getProgress()).to.eq(0.99)

        progress.setCompleted(100)
        expect(progress.getProgress()).to.eq(1)

        progress.setCompleted(200)
        expect(progress.getProgress()).to.eq(1)
    })
})