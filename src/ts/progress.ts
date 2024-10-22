export function newProgress(): Progress {
    return new BasicProgress()
}

export interface Progress {
    getProgress(): number

    setTotal(total: number)

    setCompleted(completed: number)

    incrementCompleted(i: number)

    reset()

    addListener(fn: (progress: number) => void)
}

export const nullProgress: Progress = {
    reset() {
    },
    addListener(fn: (progress: number) => void) {
    },
    getProgress(): number {
        return 0;
    }, incrementCompleted(i: number) {
    }, setCompleted(completed: number) {
    }, setTotal(total: number) {
    }
}

class BasicProgress implements Progress {
    listeners = []
    total: number = 0
    completed: number = 0

    addListener(fn: (progress: number) => void) {
        this.listeners.push(fn)
    }

    private notifyListeners() {
        for (const fn of this.listeners) {
            fn(this.getProgress())
        }
    }

    // XXX: There must be a cleaner way to do this
    getProgress(): number {
        if (this.completed < 0) {
            return 0
        }
        if (this.total < 0) {
            return 0
        }
        if (this.total > 0) {
            if (this.total >= this.completed) {
                return this.completed / this.total
            } else {
                return 1
            }
        } else {
            return 0
        }
    }

    incrementCompleted(i: number) {
        this.completed += i
        this.notifyListeners()
    }

    setCompleted(completed: number) {
        this.completed = completed
        this.notifyListeners()
    }

    setTotal(total: number) {
        this.total = total
    }

    reset() {
        this.total = 0
        this.completed = 0
        this.notifyListeners()
    }
}

