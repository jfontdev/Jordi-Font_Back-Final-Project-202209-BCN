const stringToArray = (data: string, separator: string): string[] =>
  data.trim().split(`${separator}`);

export default stringToArray;
