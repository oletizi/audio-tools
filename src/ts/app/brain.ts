import fs from "fs/promises";
import {Entry, FromList} from "./api.ts"
import path from "path";

export namespace brain {
    function exclude(entry: string) {
        return entry.startsWith('.') || entry.startsWith('$') || entry.startsWith('#')
    }

    export class Brain {
        private home: string;
        private cwd: string;

        constructor(home: string) {
            this.home = home
            this.cwd = this.home
        }

        async getFromList(): Promise<FromList> {
            const dirlist = await fs.readdir(this.cwd);
            const entries: Entry[] = [
                {
                    directory: true,
                    name: '..'
                }
            ]
            for (const l of dirlist) {
                try {
                    let stats = await fs.stat(path.join(this.cwd.toString(), l));
                    if (!exclude(l)) {
                        entries.push({
                            directory: stats.isDirectory(),
                            name: l
                        })
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return {
                entries: entries
            } as FromList
        }

        async cd(newdir: string) {
            console.log(`cd: newdir: ${newdir}`)
            const newpath = path.resolve(path.join(this.cwd, newdir))
            // this.cwd = path.resolve(path.join(this.cwd, newdir))

            try {
                const stats = await fs.stat(newpath)
                if (newpath.startsWith(this.home)) {
                    console.log(`Changing cwd to ${newpath}`)
                    this.cwd = newpath
                } else {
                    console.log(`Won't change directories outside home dir.`)
                }
            } catch (e) {
                console.error(e)
            }
            return await this.getFromList()
        }
    }
}