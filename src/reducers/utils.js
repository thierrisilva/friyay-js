import { ifElse, has, lensProp, always, view, is, call, identity } from 'ramda';

const executeIfFunction = 
  ifElse(is(Function), call(identity), () => identity);

const switchcase = defaultCase => key =>
  ifElse(has(key), view(lensProp(key)), always(defaultCase));

export const switchcaseF = cases => defaultCase => key =>
  executeIfFunction(switchcase(defaultCase)(key)(cases));