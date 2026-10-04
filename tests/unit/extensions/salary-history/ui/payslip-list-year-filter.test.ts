// @vitest-environment happy-dom
/**
 * The top bar carries a finance-year select in place of the old dead "⌕ Filter"
 * button, which had no click handler at all. It filters through the existing
 * `_filteredPayslips` getter, so these tests pin the option list, the
 * filtering, and the pagination clamp a shorter list needs.
 *
 * Years are compared in their normalised form — `normalizeFinanceYear` expands
 * `2026-27` to `2026-2027` — which is also what the select stores, so the two
 * spellings never appear as duplicate options.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { makeEl, SLIPS, many } from './payslip-list.test-harness';

type Sel = HTMLSelectElement & HTMLElement;

/** Picks a year the way a user does: on the control, not the host. */
async function pick(el: ReturnType<typeof makeEl>, year: string) {
  const sel = el.shadowRoot.querySelector('#fy-select') as Sel;
  sel.value = year;
  sel.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
  return sel;
}

describe('PayslipList finance-year filter', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('offers every year present in the data, newest first, plus All years', async () => {
    const el = makeEl();
    el.payslips = SLIPS;
    await el.updateComplete;

    const sel = el.shadowRoot.querySelector('#fy-select') as Sel;
    expect(sel).toBeTruthy();
    const values = [...sel.options].map((o) => o.value);
    expect(values[0]).toBe(''); // All years
    expect(values.slice(1)).toEqual(['2026-2027', '2025-2026']);

    const label = el.shadowRoot.querySelector('label.fy-label');
    expect(label?.textContent?.trim()).toBe('Finance year');
    // The label must point at the control, or the pairing is only visual.
    expect(label?.getAttribute('for')).toBe('fy-select');
  });

  it('folds the two-digit and four-digit spellings of a year into one option', async () => {
    const el = makeEl();
    el.payslips = [...SLIPS, { ...SLIPS[0], id: 99, finance_year: '2026-2027' }];
    await el.updateComplete;

    const sel = el.shadowRoot.querySelector('#fy-select') as Sel;
    const values = [...sel.options].map((o) => o.value);
    expect(values).toContain('2026-2027');
    expect(values).not.toContain('2026-27');
    expect(new Set(values).size).toBe(values.length); // no duplicates at all
  });

  it('shows every row under All years and only the matching year when one is picked', async () => {
    const el = makeEl();
    el.payslips = SLIPS;
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('[data-testid="payslip-row"]').length).toBe(2);

    await pick(el, '2025-2026');

    const rows = el.shadowRoot.querySelectorAll('[data-testid="payslip-row"]');
    expect(rows.length).toBe(1);
    const target = SLIPS.find((s) => s.finance_year === '2025-26')!;
    expect(rows[0].textContent).toContain(target.pay_date.slice(0, 10));
  });

  it('keeps the configured year in the list and selected, before any slip uses it', async () => {
    // A year with no rows yet must still be selectable, or the setting would
    // silently read as All years.
    const el = makeEl();
    el.payslips = SLIPS;
    el.financialYear = '2027-2028';
    await el.updateComplete;

    const sel = el.shadowRoot.querySelector('#fy-select') as Sel;
    expect([...sel.options].map((o) => o.value)).toContain('2027-2028');
    expect(sel.value).toBe('2027-2028');
  });

  it('clamps the page when the chosen year has fewer rows than the current page', async () => {
    // Otherwise the footer reads "Page 3 of 1" after narrowing.
    const el = makeEl();
    el.payslips = [...many(25, '2025-26'), ...many(2, '2026-2027')];
    el._page = 2;
    await el.updateComplete;

    await pick(el, '2026-2027');

    // 2 rows is one page, so page index 2 must fall back to the last one.
    expect(el._page).toBe(0);
  });
});