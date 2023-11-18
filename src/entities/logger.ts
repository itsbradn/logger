import { Line, LogLine } from "./logline";

export class Logger {
    lines: LogLine[] = [];

    constructor() {
        this.print();
    }

    setline(lines: LogLine[]) {
        this.lines = lines;
    }

    print() {
        console.clear();
        const rows = process.stdout.rows;

        const lines = this.lines;
        let x = 0;
        const printLines: LogLine[] = [];
        for (let i = 1; (x < rows && i < rows); i++) {
            const line = lines[lines.length - i];
            if (!line) continue;
            x += line.lines.length;
            printLines.unshift(line);
        }

        let offset = rows - x;
        for (const printLine of printLines) {
            offset += printLine.logLines(offset);
        }
    }

    log(line: Line | any) {
        if (typeof line == 'object') {
            if (line.hasOwnProperty('content')) {
                const newLine = new LogLine(this);
                this.lines.push(newLine);
                newLine.addLine(line);
                return newLine;
            }

            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: JSON.stringify(line)
            });
            return newLine;
        }

        if (typeof line == 'string') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: line
            });
            return newLine;
        }

        if (typeof line == 'number' || typeof line == 'bigint') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: line.toString()
            });
            return newLine;
        }

        if (typeof line == 'boolean') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: line ? 'true' : 'false'
            });
            return newLine;
        }

        if (typeof line == 'undefined') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: 'undefined'
            });
            return newLine;
        }

        if (typeof line == 'function') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: line.toString(),
            });
            return newLine;
        }

        if (typeof line == 'symbol') {
            const newLine = new LogLine(this);
            this.lines.push(newLine);
            newLine.addLine({
                service: 'INFO',
                content: line.toString(),
            });
            return newLine;
        }


        const newLine = new LogLine(this);
        this.lines.push(newLine);
        newLine.addLine({
            service: 'ERROR',
            content: 'Invalid value passed to logger.'
        });
        return newLine;
    }
}