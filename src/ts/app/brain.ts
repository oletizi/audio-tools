import fs from "fs/promises";
import {Entry, FromList} from "./api.ts"
import path from "path";

export namespace brain {
    function exclude(entry:string) {
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
            const entries: Entry[] = []
            for (const l of dirlist) {
                let stats = await fs.stat(path.join(this.cwd.toString(), l));
                if (!exclude(l)) {
                    entries.push({
                        directory: stats.isDirectory(),
                        name: l
                    })
                }
            }
            return {
                entries: entries
            } as FromList
        }

        cd(newdir: string) {
            this.cwd = path.join(this.cwd, newdir)
        }
    }
}