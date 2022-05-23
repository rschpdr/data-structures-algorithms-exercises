const routes = require("./index");

test("Works correctly with valid input", () => {
  const input = {
    K: 1000,
    N: 4,
    X: 5,
    routes: [
      "1 2 1 2500",
      "1 3 1 3000",
      "1 4 2 7000",
      "2 4 1 3000",
      "3 4 1 2000",
    ],
    S: 1,
    D: 4,
  };

  expect(routes(input)).toBe("1->3->4 3 8000");
});

test("Works correctly when input violates constraints", () => {
  const input = {
    K: 1000,
    N: 4,
    X: 7,
    routes: [
      "1 2 1 2500",
      "1 3 1 3000",
      "1 4 2 7000",
      "2 4 1 3000",
      "3 4 1 2000",
      "1 3 1 3000",
      "1 4 2 7000",
    ],
    S: 1,
    D: 3,
  };

  expect(routes(input)).toBe("Error");
});

test("Works correctly when start city is not the first one", () => {
  const input = {
    K: 1000,
    N: 4,
    X: 5,
    routes: [
      "1 2 1 2500",
      "1 3 1 3000",
      "1 4 2 7000",
      "2 4 1 3000",
      "3 4 1 2000",
    ],
    S: 2,
    D: 3,
  };

  expect(routes(input)).toBe("2->4->3 3 8000");
});

test("Works correctly with direct flight paths", () => {
  const input = {
    K: 1000,
    N: 4,
    X: 5,
    routes: [
      "1 2 1 2500",
      "1 3 1 3000",
      "1 4 2 5500",
      "2 4 1 3000",
      "3 4 1 2000",
    ],
    S: 1,
    D: 4,
  };

  expect(routes(input)).toBe("1->4 2 7500");
});

test("Works correctly when there are no possible routes", () => {
  const input = {
    K: 500,
    N: 5,
    X: 4,
    routes: ["1 2 1 2500", "1 3 1 3000", "2 3 1 3000", "4 5 1 2000"],
    S: 2,
    D: 5,
  };

  expect(routes(input)).toBe("Error");
});
