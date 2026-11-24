/** One contract property from `@az-digital/contracts/dist/contracts.json`: a token, or the component's own value. */
export type ContractRow = {
  contract: string;
  variant: string | null;
  part: string;
  kind: 'default' | 'state' | 'breakpoint';
  condition: string | null;
  property: string;
  token: string | null;
  type?: string;
  value?: string;
  description?: string;
};

/** The contract rows, variant defaults, and allowed options, for `testDesignContract`. */
export type ContractData = {
  rows: ContractRow[];
  defaults?: Record<string, Record<string, string>>;
  variants?: Record<string, Record<string, string[]>>;
};

/** Where a pointer or viewport state comes from. What's missing is reported as unsupported. */
export type Driver = {
  hover?(element: Element): Promise<void>;
  /** Moves the pointer off the component. */
  unhover?(): Promise<void>;
  /** Hovers the element and holds the primary button down. */
  press?(element: Element): Promise<void>;
  /** Releases the button away from the component, so it never counts as a click. */
  release?(): Promise<void>;
  /** Uses real keyboard navigation to reach the element. */
  keyboardFocus?(element: Element): Promise<void>;
  setViewport?(width: number): Promise<void>;
  restoreViewport?(): Promise<void>;
};

export type Target = {
  /** The element for each contract part, `root` for the component itself. */
  parts: { root: Element } & Record<string, Element>;
  focus?: Element;
  hover?: Element;
  press?: Element;
};

export type SkipRule = { part?: string; condition?: string; property?: string; reason: string };

export type DesignContractTestInput = {
  data: ContractData;
  contract: string;
  options?: string[];
  target: Target;
  driver?: Driver;
  tokens?: string | Record<string, string>;
  optionalParts?: string[];
  skip?: SkipRule[];
  implementation?: { name?: string; file?: string };
  contractFile?: string;
};

export type Status = 'passed' | 'failed' | 'unsupported' | 'unmapped' | 'blocked' | 'skipped';

export type Entry = {
  status: Status;
  /** A stable code such as AZC001, for anything that isn't passed or skipped. */
  code: string | null;
  name: string | null;
  contract: string;
  options: string[];
  part: string | null;
  condition: string | null;
  property: string | null;
  /** The token, or the contract's own value, the row expects. */
  source?: string;
  expected?: string;
  drawn?: string;
  reason?: string;
  blockedBy?: string;
  message: string;
  /** What to change: in the implementation, or in the contract. */
  action?: string;
};

export type DesignContractTestResult = {
  contract: string;
  options: string[];
  name: string;
  implementation: { name?: string; file?: string };
  entries: Entry[];
  counts: Record<Status, number>;
  /** True only when something was tested and nothing failed, was unsupported, unmapped or blocked. */
  ok: boolean;
};

export const CODES: Record<string, string>;
export function contractRows(data: ContractData, contract: string, options?: string[]): ContractRow[];
export function parseTokenCss(css: string): Record<string, string>;
export function testDesignContract(input: DesignContractTestInput): Promise<DesignContractTestResult>;
export function formatResult(result: DesignContractTestResult): string[];
export function describeCoverage(result: DesignContractTestResult): string;
