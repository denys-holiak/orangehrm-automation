import { test } from '@playwright/test';

type StepTitle<TitleArgs extends unknown[]> = string | ((...args: TitleArgs) => string);

export function Step<TitleArgs extends unknown[] = []>(title: StepTitle<TitleArgs>) {
  return function <This, Args extends [...TitleArgs, ...unknown[]], Return>(
    originalMethod: (this: This, ...args: Args) => Promise<Return>,
  ): (this: This, ...args: Args) => Promise<Return> {
    return function (this: This, ...args: Args): Promise<Return> {
      // The title only declares (and sees) the leading arguments it needs.
      const resolvedTitle =
        typeof title === 'function' ? title(...(args as unknown as TitleArgs)) : title;
      return test.step(resolvedTitle, () => originalMethod.apply(this, args));
    };
  };
}
