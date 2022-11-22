import CustomError from "./CustomError";

describe("Given a class CustomError", () => {
  describe("When it is instantiated with an error message 'unknown endpoint' and an status code '404'", () => {
    test("Then it should return the error message 'unknown endpoint' and an status code '404'", () => {
      const expectedStatus = 404;
      const expectedMessage = "unknown endpoint";
      const expectedPublicMessage = "unknown endpoint";

      const customError = new CustomError(
        expectedMessage,
        expectedStatus,
        expectedPublicMessage
      );

      expect(customError).toHaveProperty("message", expectedMessage);
      expect(customError).toHaveProperty("statusCode", expectedStatus);
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedPublicMessage
      );
    });
  });
});
