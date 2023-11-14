import fs from "fs";
import { currDate } from "./utils.js"

export default class {
	static path: string = "dist/logs/"+`${currDate.currDate(true)} ${currDate.currTimeShort(true)}.log`;

	static init = (): string => {
		fs.appendFileSync(this.path, `${this.getTimeBracket()} Log init\n`);
		return this.path;
	};
	
	static write = (content: string): void => {
		fs.appendFileSync(this.path, `${this.getTimeBracket()} ${content}`);
	};

	private static getTimeBracket = (): string => {
		return `[${currDate.currDate()} ${currDate.currTimeLong()}]`;
	}
}