import stringToArray from "./stringToArray";

describe("Given a stringToArray function", () => {
  describe("When it receives 'Test,Done' as data and the separator ',' as parameters", () => {
    test("Then it should return ['Test','Done']", () => {
      const data = "Test,Done";
      const separator = ",";

      const expectedResult = ["Test", "Done"];

      const conversionFunction = stringToArray(data, separator);

      expect(conversionFunction).toStrictEqual(expectedResult);
    });
  });
});
