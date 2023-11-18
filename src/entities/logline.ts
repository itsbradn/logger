import * as chalk from "chalk";
import { symbols } from "./symbols";
import { Logger } from "./logger";

export type Services =
    | "HTTP"
    | "DB"
    | "INFO"
    | "WARN"
    | "ERROR";

export interface Line {
    service: Services;
    httpCode?: number;
    detail?: string;
    content: string;
    duration?: number;
    durationType?: 'h' | 'm' | 's' | 'ms' | 'ns';
}

export class LogLine {
    lines: Line[] = [];
    logger: Logger;


    constructor(logger: Logger) {
        this.logger = logger;
    }

    addLine(line: Line) {
        this.lines.push(line);
        this.logger.print();
        return this;
    }

    logLines(startY: number) {

        let i = 0;
        for (const line of this.lines) {
            if (startY + i < 0) {
                i++;
                continue;
            }
            process.stdout.cursorTo(0, 0 + startY + i);
            process.stdout.clearLine(0);
            if (i == 0) {
                process.stdout.write(this.parseLine(line));
                i++;
                continue;
            }
            if (i == this.lines.length - 1) {
                i++;
                process.stdout.write(`${chalk.gray(symbols.lastLine)} ` + this.parseLine(line));
                continue;
            }
            i++;
            process.stdout.write(`${chalk.gray(symbols.midline)} ` + this.parseLine(line));
            continue;
        }
        return i;
    }

    parseLine(line: Line) {
        return `${this.colorizeService(line.service)}${this.parseLineDetails(line)} ${chalk.gray('|')} ${line.content}`;
    }

    parseLineDetails(line: Line) {
        let details = ``;
        if (line.httpCode)
            details += ` ${this.parseHttpCode(line.httpCode)}`;

        if (line.detail) details += ` ${line.detail}`;

        return details;
    }

    parseHttpCode(code: number) {
        if (code.toString()[0] == '2') return chalk.greenBright(code);
        if (code.toString()[0] == '4' || code.toString()[0] == '5') return chalk.redBright(code);
        return chalk.blueBright(code);
    }

    colorizeService(service: Services) {
        if (service == 'DB') return chalk.yellow('DB');
        if (service == 'HTTP') return chalk.cyanBright('HTTP');
        if (service == 'ERROR') return chalk.redBright('ERROR');
        if (service == 'WARN') return chalk.hex('FFAD00')('WARN');
        return chalk.blueBright('INFO');
    }
}