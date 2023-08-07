export class SelectionPage {
  loaderMessage() {
    return cy.get('span[class="syos-loader__message"]');
  }
  selectionContainer() {
    return cy.get('div[class="syos-level-selector-container"]');
  }
  bestAvailableSeats() {
    return cy.get('span[class="zone"]').contains("Any Best Available Seat");
  }
  frontOrchestraSection() {
    return cy.get('span[class="zone"]').contains(/^Front Orchestra$/);
  }
  orchestraSection() {
    return cy.get('span[class="zone"]').contains(/^Orchestra$/);
  }
  orchestraEWSection() {
    return cy.get('span[class="zone"]').contains("Orchestra E/W");
  }
  terraceSectionOne() {
    return cy.get('span[class="zone"]').contains("Terrace").eq(0);
  }
  terraceSectionTwo() {
    return cy.get('span[class="zone"]').eq(4);
  }
  terraceSectionEW() {
    return cy.get('span[class="zone"]').contains("Terrace E/W");
  }
  balconySection() {
    return cy.get('span[class="zone"]').contains("Balcony");
  }
  continueButton() {
    return cy.get('button[class="syos-button syos-level-selector__button"]');
  }
  confirmSeatsButton() {
    return cy.get('button[class="syos-button"]').contains("Confirm seats");
  }
  quantityNumber() {
    return cy.get('input[type="number"]');
  }
  quantityInCart() {
    return cy.get('td[class="quantity"]');
  }
  priceValue() {
    return cy.get('span[class="syos-price__value"]');
  }
  seatInfo() {
    return cy.get('div[class="syos-lineitem__details"] > button');
  }
  removeTicketButton() {
    return cy.get('button[class="syos-lineitem__remove"]');
  }
  cartPrice() {
    return cy.get('td[class="price"]');
  }
  cartItems() {
    return cy.get('td[class="item "] > div');
  }
  decreaseQuantityButton() {
    return cy.get('button[class="input-group-addon btn decrement"]');
  }
  terraceSeats() {
    return cy.get('g[id="syos-screen-5"] > circle');
  }
  terraceEastSeats() {
    return cy.get('g[id="syos-screen-6"] > circle').filter('[class="seat seat--available"]');
  }
  allSeats() {
    return cy.get('g[id="seatmap"] > g> g > circle').filter('[class="seat seat--available"]');
  }
}

export default SelectionPage;
