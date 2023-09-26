/* global Dicoogle */

export default class MyPlugin {
    
    constructor() {
        // TODO initialize plugin here
    }
    
    /** 
     * @param {DOMElement} parent
     * @param {DOMElement} slot
     */
    render(parent, slot) {
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
<% if (dicoogle.slotId === 'result') { %>
    onResult(results) {
        // TODO show results here
    }<% } %>
<% if (semver.gte(minimumVersion, '2.5.0')) { %>
    onReceiveData(data) {
        // retrieve data here
    }<% } %>
}
