export { v4 as uuid } from "uuid";

export function styleClasses(
  styles: typeof import("*.scss"),
  ...classNames: (string | undefined)[]
) {
  return classNames
    .filter(Boolean)
    .map((className) => styles[className])
    .join(" ");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
