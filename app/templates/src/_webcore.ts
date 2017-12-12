// TypeScript declarations for the Dicoogle webcore
import {SearchPatientResult} from 'dicoogle-client';

export type WebPluginType = string;

export type WebcoreEvent = 'load' | 'result' | string;

export interface WebPlugin {
    name: string,
    slotId: WebPluginType,
    caption?: string,
}

export interface IssueQueryOptions {
    override?: string,
    [key: string]: any,
}

export interface Webcore {
    issueQuery(query, options: IssueQueryOptions, callback: (error: any, result: any) => void);
    issueQuery(query, callback: (error: any, result: any) => void);

    addEventListener(eventName: WebcoreEvent, fn: (...args: any[]) => void);
    addResultListener(fn: (result: any, requestTime: number, options: any) => void);
    addPluginLoadListener(fn: (plugin: WebPlugin) => void);

    emit(eventName: WebcoreEvent, ...args: any[]);
    
    emitSlotSignal(slotDOM: HTMLElement, eventName: WebcoreEvent, data: any);
}

export interface PluginData {
    query?: string;
    queryProvider?: string[];
    results?: SearchPatientResult[];
    [att: string]: any;
}

export interface SlotHTMLElement extends HTMLElement {
    slotId: string;
    pluginName: string;
    data?: PluginData;
}
