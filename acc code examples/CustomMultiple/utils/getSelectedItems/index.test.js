import getSelectedOptions from "./index.js";

test("getSelectedOptions", () => {
  const res = getSelectedOptions(
    [{ text: "P1" }, { text: "P2" }, { text: "P3" }],
    "p,p3"
  );

  expect(res).toEqual([{ text: "P1" }, { text: "P3" }]);
});
