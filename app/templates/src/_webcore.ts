// TypeScript declarations for the Dicoogle webcore
import type {SearchPatientResult} from 'dicoogle-client';

export type WebPluginType = 'menu' | 'result-options' | 'result-batch' | 'settings' | string;

export type WebcoreEvent = 'load' | 'result' | 'result-selection-ready' | string;

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
<% if (semver.get(minimumVersion, '3.1.0')) { %>
export interface ResultSelectionReadyEvent {
    detail: ResultSelectionData;
}
<% if (semver.get(minimumVersion, '3.3.2')) { %>
export type ResultSelectionData = {search: {data: SearchDetails}, selected: ResultSelection};

export interface SearchDetails {
    results: SearchPatientResult[],
    elapsedTime: number,
    numResults: number,
}
<% } else { %>
export type ResultSelectionData = ResultSelection;
<% } %><% } %>

export interface ResultSelection {
    contents: object[],
    level: string,
}

export interface SlotHTMLElement extends HTMLElement {
    slotId: string;
    pluginName: string;
    data?: PluginData;
<% if (semver.get(minimumVersion, '3.1.0')) { %>
    addEventListener(eventName: 'result-selection-ready', listener: (ev: ResultSelectionReadyEvent) => void): void;
<% } %>
    addEventListener(eventName: string, listener: (ev: Event) => void): void;
}
