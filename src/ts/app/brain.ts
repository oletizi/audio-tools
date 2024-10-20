import fs from "fs/promises";
import {Entry, DirList} from "./api.ts"
import path from "path";

export namespace brain {
    function exclude(entry: string) {
        return entry.startsWith('.') || entry.startsWith('$') || entry.startsWith('#')
    }

    export class Brain {
        private sourceHome: string;
        private source: string;
        private targetHome: string
        private target: string;

        constructor(home: string, target: string) {
            this.sourceHome = home
            this.source = this.sourceHome
            this.targetHome = target
            this.target = this.targetHome
        }

        async list(): Promise<DirList[]> {
            return [
                await this.getDirList(this.source),
                await this.getDirList(this.target)
            ]
        }

        async getDirList(dirpath): Promise<DirList> {
            const dirlist = await fs.readdir(dirpath);
            const entries: Entry[] = [
                {
                    directory: true,
                    name: '..'
                }
            ]
            for (const entryName of dirlist) {
                try {
                    let stats = await fs.stat(path.join(dirpath, entryName));
                    if (!exclude(entryName)) {
                        entries.push({
                            directory: stats.isDirectory(),
                            name: entryName
                        })
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return {
                entries: entries
            } as DirList
        }

        async cdFromDir(newdir: string) {
            const newpath = await this.cd(this.source, newdir)
            if (newpath.startsWith(this.sourceHome)) {
                this.source = newpath
            }
        }

        async cdToDir(newdir: string) {
            const newpath = await this.cd(this.target, newdir)
            console.log(`attempt to change target dir: ${newpath}`)
            if (newpath.startsWith(this.targetHome)) {
                this.target = newpath
                console.log(`New target dir: ${this.target}`)
            } else {
                console.log(`New target dir not a subdir of target home: ${this.targetHome}. Ignoring.`)
            }
        }

        private async cd(olddir, newdir: string) {
            console.log(`cd: newdir: ${newdir}`)
            const newpath = path.resolve(path.join(olddir, newdir))

            const stats = await fs.stat(newpath)
            if (newpath.startsWith(this.sourceHome)) {
                console.log(`Changing cwd to ${newpath}`)
            } else {
                console.log(`Won't change directories outside home dir.`)
            }
            return newpath
        }
    }
}