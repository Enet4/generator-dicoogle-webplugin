<% if (dicoogle.slotId === 'result') { %>import {DicoogleAccess, SearchPatientResult} from 'dicoogle-client';<% } else { %>import {DicoogleAccess} from 'dicoogle-client';<% } %>
<% if (semver.gte(minimumVersion, '2.5.0')) { %>import {Webcore, SlotHTMLElement, PluginData} from './webcore';<% } else { %>import {Webcore, SlotHTMLElement} from './webcore';<% } %>

// global Dicoogle access instance
declare const Dicoogle: DicoogleAccess & Webcore;

export default class MyPlugin {
    
    constructor() {
        // TODO initialize plugin here
    }
    
    render(parent: HTMLElement, slot: SlotHTMLElement) {
        // TODO mount a new web component here
        const div = document.createElement('div');
        div.innerHTML = 'Hello, Dicoogle!';
        parent.appendChild(div);<% if (dicoogle.slotId === 'query') { %>
        // dispatch a query with `Dicoogle.issueQuery`:
        //   Dicoogle.issueQuery('CT');
<% } %><% if (dicoogle.slotId === 'result-batch') { %>
        // act on results selected
        slot.addEventListener('result-selection-ready', (ev) => {
            // use ev.detail
        });<% } %>
    }
<% if (dicoogle.slotId === 'result') { %>   onResult(results: SearchPatientResult[]) {
        // TODO show results here
    }<% } %><% if (semver.gte(minimumVersion, '2.5.0')) { %>

    onReceiveData(data: PluginData) {
        // retrieve data here
    }<% } %>
}
