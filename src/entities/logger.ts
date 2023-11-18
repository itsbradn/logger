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
            const line = lines[lines.length - i]; //TODO: fix this pls
            if (!line) continue;
            x += line.lines.length;
            printLines.unshift(line);
        }

        let offset = rows - x;
        for (const printLine of printLines) {
            offset += printLine.logLines(offset);
        }
    }

    log(line: Line) {
        const newLine = new LogLine(this);
        this.lines.push(newLine);
        newLine.addLine(line);
        return newLine;
    }
}