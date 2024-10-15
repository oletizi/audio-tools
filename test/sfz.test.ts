import antlr, {ErrorNode, ParserRuleContext, TerminalNode} from 'antlr4'
import SfzLexer from '../src/js/SfzLexer.js'
import SfzParser from '../src/js/SfzParser.js'
import fs from "fs/promises";
import {ParseTreeListener} from "antlr4/src/antlr4/tree";
import SfzListener from "../src/js/SfzListener.js";


class MyParseTreeListener extends SfzListener {
    enterSfz(ctx) {
    }

    exitSfz(ctx) {
    }

    enterSfzObject(ctx) {
    }

    exitSfzObject(ctx) {
    }

    // Enter a parse tree produced by SfzParser#headerObject.
    enterHeaderObject(ctx) {
    }

    // Exit a parse tree produced by SfzParser#headerObject.
    exitHeaderObject(ctx) {
    }


    // Enter a parse tree produced by SfzParser#header.
    enterHeader(ctx) {
    }

    // Exit a parse tree produced by SfzParser#header.
    exitHeader(ctx) {
    }


    // Enter a parse tree produced by SfzParser#opcodeStatement.
    enterOpcodeStatement(ctx) {
    }

    // Exit a parse tree produced by SfzParser#opcodeStatement.
    exitOpcodeStatement(ctx) {
    }


    // Enter a parse tree produced by SfzParser#opcode.
    enterOpcode(ctx) {
    }

    // Exit a parse tree produced by SfzParser#opcode.
    exitOpcode(ctx) {
        console.log(`exit opcode: ${ctx.getText()}`)
    }


    // Enter a parse tree produced by SfzParser#value.
    enterValue(ctx) {
    }

    // Exit a parse tree produced by SfzParser#value.
    exitValue(ctx) {
        console.log(`exit value: ${ctx.getText()}`)
    }
}
describe('Parser', () => {

    it('Instantiates a parser...', async () => {
        const input = new antlr.InputStream((await fs.readFile('test/data/sfz/Oscar.sfz')).toString())
        const lexer = new SfzLexer(input)
        const tokens = new antlr.CommonTokenStream(lexer)
        const parser = new SfzParser(tokens)
        parser.addParseListener(new MyParseTreeListener())
        parser.buildParseTrees = true
        parser.sfz()
    })
})