import * as React from 'react';
import {DicoogleAccess} from 'dicoogle-client';
import {Webcore} from './webcore';

// global Dicoogle access instance
declare const Dicoogle: DicoogleAccess & Webcore;

interface Props {
    // TODO define props here
}

interface State {
    // TODO define state shere
}

class PluginComponent extends React.Component<Props, State> {

    constructor() {
        super();
    }

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
    
    render(parent: HTMLElement, slot: HTMLElement): typeof PluginComponent {
        return PluginComponent;
    }
    <% if (dicoogle.slotId === 'result') { %>
    onResult(results) {
        // TODO show results here
    }
    <% } %>
}
