// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminStats", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/admin/stats");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/stats");
    });
  });

  it("View stats", () => {
    cy.get("div.card-header h4").contains("Server Stats");

    cy.get("table")
      .find("th")
      .contains("Server startup")
      .parent()
      .contains("ago");

    cy.get("table").find("tr.table-primary").contains("CPU");
    cy.get("table").find("th").contains("Num");
    cy.get("table").find("th").contains("Load").parent().contains("%");

    cy.get("table").find("tr.table-primary").contains("Root Disk");
    cy.get("table").find("th").contains("Disk size").parent().contains(" GB");
    cy.get("table").find("th").contains("Used disk").parent().contains(" GB");
    cy.get("table").find("th").contains("Used disk").parent().contains("%)");
    cy.get("table").find("th").contains("Free disk").parent().contains(" GB");

    cy.get("table").find("tr.table-primary").contains("RAM");
    cy.get("table").find("th").contains("Total RAM").parent().contains(" MB");
    cy.get("table").find("th").contains("Used RAM").parent().contains(" MB");
    cy.get("table")
      .find("th")
      .contains("Available RAM")
      .parent()
      .contains(" MB");
    cy.get("table").find("th").contains("Free RAM").parent().contains(" MB");
    cy.get("table").find("th").contains("Cache").parent().contains(" MB");
    cy.get("table").find("th").contains("Buffer").parent().contains(" MB");
    cy.get("table").find("th").contains("Active").parent().contains(" MB");
    cy.get("table").find("th").contains("Inactive").parent().contains(" MB");

    // How to check A || B ?
    // cy.get("table").find("tr.table-primary").contains("Swap");
    // cy.get("table").find("tr.table-secondary").contains("Swap is disabled");
    cy.get("table").find("th").contains("Total size").parent().contains(" MB");
    cy.get("table").find("th").contains("Free swap").parent().contains(" MB");
    cy.get("table").find("th").contains("Used swap").parent().contains(" MB");
    cy.get("table").find("th").contains("from disk").parent().contains(" MB/s");
    cy.get("table").find("th").contains("to disk").parent().contains(" MB/s");

    cy.get("table").find("tr.table-primary").contains("Network");
    cy.get("table").find("th").contains("Min Latency").parent().contains(" ms");
    cy.get("table").find("th").contains("Avg Latency").parent().contains(" ms");
    cy.get("table").find("th").contains("Max Latency").parent().contains(" ms");

    // cy.get("table").find("tr.table-primary").contains("I/O");
    // cy.get("table").find("th").contains("Blocks received");
    // cy.get("table").find("th").contains("Blocks sent");

    // cy.get("table").find("tr.table-primary").contains("Procs");

    // cy.get("table").find("th").contains("Waiting for run");
    // cy.get("table").find("th").contains("Uninterruptible sleep");
  });
});
