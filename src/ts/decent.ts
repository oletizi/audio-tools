import {PathLike} from "fs";
import * as cheerio from 'cheerio'
import fs from "fs/promises"
import {Sample} from "./sample";

export async function getSamples(path: PathLike) {
    const $ = cheerio.load(await fs.readFile(path))
    const rv: Sample[] = []
    for (const sample of $('sample')) {
        rv.push(sample.attribs)
    }
    return rv
}