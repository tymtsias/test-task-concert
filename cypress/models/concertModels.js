import SelectionPage from "../page-objects/selection.page";
import sections from "../fixtures/sections.json";

let envVariables = Cypress.config();
const selection = new SelectionPage();

export const visitPage = () => {
  cy.visit(envVariables.baseUrl);
  selection.selectionContainer().should("be.visible");
};

export const scenarioOne = () => {
  selection.decreaseQuantityButton().should("be.visible").click();
  selection.bestAvailableSeats().should("be.visible").click();
  selection.continueButton().should("be.visible").click();
  let seats = getAllAvailableSeatsFromSection(selection.allSeats());

  cy.wrap().then(() => {
    let collectedSeats = collectSections(seats);
    let report = "";
    for (const [key, value] of Object.entries(collectedSeats)) {
      report = report + sections[key] + "\n";
      report = report + "Meets requirements a:" + availableNearSeatsInSection(key, value) + "\n";
      report = report + "Meets requirements b:" + availableSeparateSeatsInSection(key, value) + "\n";
      report = report + "Meets requirements c:" + lessThanTwoAvailableSeats(value) + "\n";
    }
    report = report + "How many available sections:" + Object.values(collectedSeats).length;
    cy.log(report);
  });
};

export const scenarioTwo = () => {
  selection.decreaseQuantityButton().should("be.visible").click();
  selection.bestAvailableSeats().should("be.visible").click();
  getQuantityNumber();
  selection.continueButton().should("be.visible").click();
  getTicketInfo();
  getPrice();
  selection.confirmSeatsButton().should("be.visible").click();
  checkQuantity();
  checkTicketInfo();
  checkPrice();
};

export const lessThanTwoAvailableSeats = (seats) => {
  return seats.length < 2;
};

export const availableNearSeatsInSection = (sectionNumber, seats) => {
  let eastWestSections = [3, 4, 6, 7];
  let rows = {};
  seats.forEach((seat) => {
    let seatRow = seat.slice(-1);
    let seatNumber = seat.slice(0, seat.length - 2);
    if (seatRow in rows) {
      rows[seatRow].push(seatNumber);
    } else {
      rows[seatRow] = [seatNumber];
    }
  });
  let inRows = Object.values(rows).map((x) => {
    return x.map((y) => {
      return parseInt(y, 10);
    });
  });
  const nearSeatsForEastWest = (seatsInRow) => {
    let shifted = seatsInRow.map((x) => x + 2);
    return seatsInRow.filter((value) => shifted.includes(value)).length > 0;
  };
  const nearSeats = (seatsInRow) => {
    let shifted = seatsInRow.map((x) => x + 1);
    return seatsInRow.filter((value) => shifted.includes(value)).length > 0;
  };
  if (sectionNumber in eastWestSections) {
    return inRows.some(nearSeatsForEastWest);
  } else {
    return inRows.some(nearSeats);
  }
};

export const availableSeparateSeatsInSection = (sectionNumber, seats) => {
  let eastWestSections = [3, 4, 6, 7];
  let seatNumbers = Object.values(seats).map((x) => {
    return parseInt(x.slice(0, x.length - 2), 10);
  });
  if (sectionNumber in eastWestSections) {
    return seatNumbers.some((seat) => {
      return seatNumbers.some((anotherSeat) => {
        return Math.abs(seat - anotherSeat) > 2;
      });
    });
  } else {
    return seatNumbers.some((seat) => {
      return seatNumbers.some((anotherSeat) => {
        return Math.abs(seat - anotherSeat) > 1;
      });
    });
  }
};

export const collectSections = (availableSeats) => {
  let seats = {};
  availableSeats.forEach((seat) => {
    let seatNumber = seat.slice(5, -2);
    let seatSection = seat.slice(-1);
    if (seatSection in seats) {
      seats[seatSection].push(seatNumber);
    } else {
      seats[seatSection] = [seatNumber];
    }
  });
  return seats;
};

export const getAllAvailableSeatsFromSection = (sectionSelector) => {
  let seats = [];
  sectionSelector.each((data) => {
    let seatsData = data.attr("id");
    seats.push(seatsData);
  });
  return seats;
};

export const getQuantityNumber = () => {
  selection
    .quantityNumber()
    .should("be.visible")
    .invoke("attr", "value")
    .then((quantity) => {
      cy.wrap(quantity).as("quantity");
    });
};

export const checkQuantity = () => {
  selection
    .quantityInCart()
    .should("be.visible")
    .invoke("text")
    .then((value) => {
      cy.get("@quantity").then((quantity) => {
        expect(parseInt(value)).to.be.equal(parseInt(quantity));
      });
    });
};

export const getTicketInfo = () => {
  selection
    .seatInfo()
    .should("be.visible")
    .eq(0)
    .invoke("text")
    .then((info) => {
      let ticketInfo = info.slice(6, info.length);
      cy.wrap(ticketInfo).as("ticketInfo");
    });
};

export const checkTicketInfo = () => {
  cy.get("@ticketInfo").then((ticketInfo) => {
    let adjustedTicketInfo = ticketInfo.replace("E/W", getEastWestSuffix(ticketInfo));
    selection
      .cartItems()
      .eq(0)
      .invoke("text")
      .then((text) => {
        let replaced = text.replaceAll("-", "").replaceAll(" ", "");
        expect(replaced).to.contain(adjustedTicketInfo.replaceAll("-", "").replaceAll(" ", ""));
      });
  });
};

export const getEastWestSuffix = (ticketInfo) => {
  let ticketNum = parseInt(ticketInfo.slice(-1));
  if (ticketNum % 2 == 0) {
    return "West";
  } else {
    return "East";
  }
};

export const getPrice = () => {
  selection
    .priceValue()
    .should("be.visible")
    .invoke("text")
    .then((ticketPrice) => {
      cy.wrap(ticketPrice).as("ticketPrice");
    });
};

export const checkPrice = () => {
  selection
    .cartPrice()
    .should("be.visible")
    .invoke("text")
    .then((cartPrice) => {
      cy.get("@ticketPrice").then((ticketPrice) => {
        expect(cartPrice.replace(/\s/g, "")).to.contain(ticketPrice);
      });
    });
};
