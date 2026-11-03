import { escapeHtml } from './escapeHtml';

/** The button contract's colors (`packages/contracts/contracts/button.contract.json`). */
export type ButtonColor =
  | 'red'
  | 'outline-red'
  | 'blue'
  | 'outline-blue'
  | 'rain'
  | 'outline-rain'
  | 'white-text-red'
  | 'white-text-blue'
  | 'outline-white';

/** The button contract's sizes. With none, it's the default size. */
export type ButtonSize = 'small' | 'large';

export type ButtonProps = {
  label: string;
  color?: ButtonColor;
  size?: ButtonSize;
};

// Arizona Bootstrap's class for each contract color, in its current release.
// Rain is still .btn-sky until az-digital/arizona-bootstrap#2369 renames it.
const colorClasses: Record<ButtonColor, string> = {
  red: 'btn-red',
  'outline-red': 'btn-outline-red',
  blue: 'btn-blue',
  'outline-blue': 'btn-outline-blue',
  rain: 'btn-sky',
  'outline-rain': 'btn-outline-sky',
  'white-text-red': 'btn-white-text-red',
  'white-text-blue': 'btn-white-text-blue',
  'outline-white': 'btn-outline-white',
};

const sizeClasses: Record<ButtonSize, string> = { small: 'btn-sm', large: 'btn-lg' };

/** Arizona Bootstrap's classes for a button, e.g. `btn btn-red btn-lg`. */
export function buttonClasses({ color = 'red', size }: Omit<ButtonProps, 'label'>) {
  return ['btn', colorClasses[color] ?? colorClasses.red, size && sizeClasses[size]].filter(Boolean).join(' ');
}

/** The button as Arizona Bootstrap markup. */
export function renderButton(props: ButtonProps) {
  return `<button type="button" class="${buttonClasses(props)}">${escapeHtml(props.label)}</button>`;
}
