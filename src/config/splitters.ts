interface SplitterSymbols {
  /**
   * The symbol, that separates each validation rule
   * Can be any type of string
   *
   * @example
   * "required|string|max:3" // "|" is used as a rule splitter
   * "required/string/max:3" // "/" is used as a rule splitter
   */
  ruleSplitter: string;

  /**
   * The symbol, that separates parameters and rules
   * Can be any type of string
   *
   * @example
   * "required|string|max:7|min:2" // ":" is used as a rule splitter
   * "required|string|max:3" // "/" is used as a rule splitter
   */
  ruleParamSplitter: string;

  /**
   * The symbol, that separates parameters from each other
   * Can be any type of string
   *
   * @example
   * "required|string|between:5,10" // "," is used as a rule splitter
   * "required|string|between:5/10" // "/" is used as a rule splitter
   */
  paramsSplitter: string;
}

/**
 * Create new splitters object with default values
 */
export const splitters: SplitterSymbols = {
  ruleSplitter: '|',
  ruleParamSplitter: ':',
  paramsSplitter: ',',
};

/**
 * Override default rule splitter
 */
export function setRuleSplitter(splitter: string): void {
  throw_if(typeof splitter !== 'string', 'Splitter must be string');

  splitters.ruleSplitter = splitter;
}

/**
 * Override default rule-params splitter
 */
export function setRuleParamSplitter(splitter: string) {
  throw_if(typeof splitter !== 'string', 'Splitter must be string');

  splitters.ruleParamSplitter = splitter;
}

/**
 * Override default params splitter
 */
export function setParamsSplitter(splitter: string) {
  throw_if(typeof splitter !== 'string', 'Splitter must be string');

  splitters.paramsSplitter = splitter;
}
