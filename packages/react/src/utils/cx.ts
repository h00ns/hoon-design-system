/** falsy 값을 걸러 className 을 합친다. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
