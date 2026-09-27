import { SampleView } from './salary-history-view';
if (typeof customElements !== 'undefined' && !customElements.get('salary-history-view')) customElements.define('salary-history-view', SampleView as unknown as CustomElementConstructor);
