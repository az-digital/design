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
