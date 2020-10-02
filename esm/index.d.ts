import fs from "fs";

export default class BetterDebugging {
    private archive?: string;
    private debugging?: boolean;
    private minPriority?: number;
    private hideTokens?: boolean;
    private spoofURLs?: boolean;

    constructor(options?: BetterDebuggingOptions = {});

    log(message: string, type: string, priority: number): void; 
}

export interface BetterDebuggingOptions {
  archive?: string;
  debugging?: boolean;
  minPriority?: number;
  hideTokens?: boolean;
  spoofURLs?: boolean;
}
