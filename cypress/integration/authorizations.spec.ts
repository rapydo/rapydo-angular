// This is to silence ESLint about undefined cy
/*global cy, Cypress*/
import { getpassword, get_random_username } from "../../fixtures/utilities";

describe("Test Authorizations", () => {
  it("Test Admin authorizations", () => {
    const email = get_random_username("admin");
    const pwd = getpassword(4);
    // ....................., expired, init, roles
    cy.createuser(email, pwd, false, true, ["admin", "user"]);
    cy.login(email, pwd);

    ////////////////////////////////////////////////////////////////////
    cy.goto_profile();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
    cy.get("div.card-header h1");

    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/users");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/groups");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/stats");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/mail");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/mail");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/group/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/group/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    // cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////

    // Delete temporary user
    // cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  if (Cypress.env("AUTH_ROLES").includes(",staff_user,")) {
    it("Test Staff authorizations", () => {
      const email = get_random_username("staff");
      const pwd = getpassword(4);
      // ....................., expired, init, roles
      cy.createuser(email, pwd, false, true, ["staff", "user"]);
      cy.login(email, pwd);

      ////////////////////////////////////////////////////////////////////
      cy.goto_profile();
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile");
      });
      cy.get("div.card-header h1");
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/profile/changepassword");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile/changepassword");
      });
      cy.get("div.card-header h1");
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/profile/sessions");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile/sessions");
      });
      cy.get("div.card-header h1");
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/admin/users");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/admin/users");
      });
      cy.get("div.card-header h1");
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/admin/groups");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/admin/groups");
      });
      cy.get("div.card-header h1");
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/admin/sessions");
      cy.location().should((location) => {
        expect(location.pathname).to.not.eq("/app/admin/sessions");
      });
      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );
      cy.login(email, pwd);
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/admin/stats");
      cy.location().should((location) => {
        expect(location.pathname).to.not.eq("/app/admin/stats");
      });
      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );
      cy.login(email, pwd);
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/admin/mail");
      cy.location().should((location) => {
        expect(location.pathname).to.not.eq("/app/admin/mail");
      });
      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );
      cy.login(email, pwd);
      ////////////////////////////////////////////////////////////////////
      cy.visit("/app/group/users");
      cy.location().should((location) => {
        expect(location.pathname).to.not.eq("/app/group/users");
      });
      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );
      // cy.login(email, pwd);
      ////////////////////////////////////////////////////////////////////

      // Delete temporary user
      // cy.logout();
      cy.login();
      cy.deleteuser(email);
    });
  }

  it("Test Coordinator authorizations", () => {
    const email = get_random_username("coordinator");
    const pwd = getpassword(4);
    // ....................., expired, init, roles
    cy.createuser(email, pwd, false, true, ["coordinator", "user"]);
    cy.login(email, pwd);

    ////////////////////////////////////////////////////////////////////
    cy.goto_profile();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/mail");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/mail");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/group/users");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/group/users");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////

    // Delete temporary user
    cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test User authorizations", () => {
    const email = get_random_username("user");
    const pwd = getpassword(4);
    // ....................., expired, init, roles
    cy.createuser(email, pwd, false, true, ["user"]);
    cy.login(email, pwd);

    ////////////////////////////////////////////////////////////////////
    cy.goto_profile();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.get("div.card-header h1");
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/mail");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/mail");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/group/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/group/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    // cy.login(email, pwd);
    ////////////////////////////////////////////////////////////////////

    // Delete temporary user
    // cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test Public authorizations", () => {
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile/changepassword");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile/sessions");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/admin/mail");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/mail");
    });
    ////////////////////////////////////////////////////////////////////
    cy.visit("/app/group/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/group/users");
    });
    ////////////////////////////////////////////////////////////////////
  });
});
