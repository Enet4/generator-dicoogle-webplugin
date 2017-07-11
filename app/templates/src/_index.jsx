import * as React from 'react';
/* global Dicoogle */

class PluginComponent extends React.Component {

    <% if (dicoogle.slotId === 'query') { %>
    handleQueryRequest(queryText) {
        // dispatch a query with `Dicoogle.issueQuery`:
        //   Dicoogle.issueQuery(queryText);
    }
    <% } %>

    render() {
        return (<div>Hello, Dicoogle!</div>);
    }
}

export default class MyPlugin {
    
    constructor() {
        // TODO initialize plugin here
    }
    
    /**
     * @param {DOMElement} parent
     * @param {DOMElement} slot
     */
    render(parent, slot) {
        return PluginComponent;
    }
    <% if (dicoogle.slotId === 'result') { %>
    onResult(results) {
        // TODO show results here
    }
    <% } %>
}
