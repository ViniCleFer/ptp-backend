export function countObjects(input: any[], prop: string) {
  const counter = {};

  for (const obj of input) {
    const name = obj[prop];

    if (counter.hasOwnProperty(name)) {
      counter[name]++;
    } else {
      counter[name] = 1;
    }
  }

  return Object.entries(counter).map(([key, value]) => ({
    [prop]: key,
    quantidade: value,
  }));
}
