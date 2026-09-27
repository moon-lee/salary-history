import type { FinanceApi } from 'finance';
import { ExtensionLogger } from 'finance-logger';
import './styles/ext-tokens.css';
const logger = new ExtensionLogger('salary-history');
export async function registerUIComponents(): Promise<void> { if (typeof window !== 'undefined') await import('./ui/index.js'); }
let _finance: FinanceApi | null = null;
export async function activate(finance: FinanceApi, ctx: { viewId?: string } & Record<string, unknown> = {}): Promise<void> {
  _finance = finance;
  logger.info('activate salary-history', { viewId: ctx.viewId });
  // Single panel identity ('salary-history' → tab always "Salary History"); extra screens ride as mountData.view.
  const openView = (childTag: string): (() => Promise<void>) => async () => {
    await finance.ui?.requestMount('salary-history', { view: childTag });
  };
  finance.commands.registerCommand('salary-history.hello', 'Salary History: Hello', () => openView('salary-history-view')());
  // Example Domain Service — other extensions can call finance.services.invoke('salary-history','hello')
  // When you add tables (e.g. salary_history_items), add methods that use finance.db.table('salary_history_items').find/count/insert
  finance.services.register('salary-history', {
    hello: async (p?: unknown) => `Hello from salary-history: ${JSON.stringify(p ?? {})}`,
  });
  if (typeof window !== 'undefined') await import('./ui/index.js');
  if (ctx.viewId && typeof document !== 'undefined') {
    const app = document.getElementById('app');
    if (app) {
      // Without an orchestrator, mount the single view directly. When you add a
      // second child view (AGENTS.md §5b), replace this with a 'salary-history-orchestrator'
      // element that maps mount.view → child tag and handles 'mount-update' retargets.
      const viewEl = document.createElement('salary-history-view') as any;
      app.innerHTML = '';
      app.appendChild(viewEl);
      queueMicrotask(() => { if (typeof viewEl.setFinance === 'function') viewEl.setFinance(finance); else viewEl.finance = finance; });
      setTimeout(() => { if (viewEl.finance == null && typeof viewEl.setFinance === 'function') viewEl.setFinance(finance); }, 50);
    }
  }
}
export function deactivate(): void { if (_finance) _finance.services.unregister('salary-history'); logger.info('deactivate salary-history'); }
