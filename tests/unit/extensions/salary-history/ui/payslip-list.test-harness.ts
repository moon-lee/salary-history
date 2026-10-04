// @vitest-environment happy-dom
/**
 * Shared fixtures for the `payslip-list` tests.
 *
 * `SLIPS` is the same pair the original suite uses, so the finance-year tests
 * assert against the data shape already trusted elsewhere rather than a
 * hand-rolled approximation.
 */
import '../../../../../src/ui/payslip-list';
import type { PaySlip } from '../../../../../src/dao/pay-slips';
import type { UiEl } from './test-types';

interface ListEl extends UiEl {
  payslips: PaySlip[];
  referenceDate: string;
  financialYearStart: string;
  financialYear: string;
  _page: number;
}

export function makeEl(): ListEl {
  const el = document.createElement('payslip-list') as unknown as ListEl;
  document.body.appendChild(el as unknown as Node);
  return el;
}

const BASE: PaySlip = {
  id: 1,
  account_id: 1,
  pay_period_start: '2026-01-01',
  pay_period_end: '2026-01-15',
  pay_date: '2026-01-20',
  finance_year: '2025-26',
  gross: 100,
  net: 80,
  currency: 'AUD',
  shift_allowance: 0,
  base_hourly: 100,
  overtime_1_5x: 0,
  overtime_2_0x: 0,
  holiday_leave_loading: 0,
  holiday_pay: 0,
  public_holiday: 0,
  payg_withholding: 20,
  superannuation_guarantee: 12,
  personal_leave: 0,
  regular_hours: 38,
  shift_hours: 38,
  overtime_1_5_hours: 2.5,
  overtime_2_0_hours: 0,
  holiday_hours: 0,
  public_holiday_hours: 0,
  personal_leave_hours: 0,
  holiday_leave_accrual_hours: 0,
  notes: null,
};

/** One slip in each of two finance years. */
export const SLIPS: PaySlip[] = [
  { ...BASE, id: 1, finance_year: '2025-26', pay_date: '2026-01-20' },
  { ...BASE, id: 2, finance_year: '2026-27', pay_date: '2026-07-20' },
];

/** `count` slips in one finance year, for pagination. */
export function many(count: number, financeYear: string): PaySlip[] {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE,
    id: 1000 + i,
    finance_year: financeYear,
    pay_date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
}
