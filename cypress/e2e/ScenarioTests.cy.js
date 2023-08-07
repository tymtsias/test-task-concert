import { visitPage, scenarioOne, scenarioTwo } from "../models/concertModels";

describe("Scenario Tests", () => {
  beforeEach(() => {
    visitPage();
  });

  it("Check and provide the results for available sections, available near and separated seats", () => {
    scenarioOne();
  });

  it("Add a ticket to the cart and verify the quantity, price, and seat information", () => {
    scenarioTwo();
  });
});
