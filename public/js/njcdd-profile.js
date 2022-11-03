/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

/**
 * profileID is passed in from profile.pug view
 */
$(document).ready(function() {
  let basicValidationSuccess = $("#basic-validation-success");
  let interestsValidationSuccess = $("#interests-validation-success");
  let detailsValidationSuccess = $("#details-validation-success");
  let contactValidationSuccess = $("#contact-validation-success");
  let profileDataSource = new kendo.data.DataSource(
    {
      transport: {
        type: "odata",
        read: {
          contentType: "application/json",
          dataType: "json",
          type: "GET",
          url: `http://njcdd-api:3210/api/v1/profile/${profileID}`
        }
      },
      schema: {
        model: {
          id: "_id",
          fields: {
            familyName: {type: "string", label: "Last Name"},
            additionalName: {type: "string", label: "Middle Name"},
            givenName: {type: "string", label: "First Name"},
            "address.city": {type: "string", label: "City"},
            "address.county": {type: "string", label: "County"},
            "address.state": {type: "string", label: "State"},
            "address.postalCode": {type: "string", label: "Zip Code"},
            organization: {type: "string", label: "Organization"},
            email: {type: "string", label: "Email Address"},
            verifiedEmail: {type: "boolean", label: "Email"},
            verifiedAddress: {type: "boolean", label: "USPS"},
            _id: {type: "string", label: "ID", hidden: true}
          }
        }
      }
    }
  );

  $("#tabstrip").kendoTabStrip(
    {
      animation: {
        open: {
          effects: "fadeIn"
        }
      }
    });

  $("#profile-basic").kendoForm(
    {
      dataSource: profileDataSource,
      layout: "grid",
      grid: {
        cols: 2,
        gutter: 20
      },
      formData: {
        FirstName: "",
        LastName: "",
        Email: "",
        PFMAG: false,
        AINAC: false,
        DINFO: false,
        CGED: false,
        CNOT: false,
        UNSUB: false
      },
      items: [
        {
          type: "group",
          label: "Personal Information",
          layout: "grid",
          grid: {cols: 1, gutter: 10},
          items: [
            {
              field: "givenName",
              label: "First Name:",
              validation: {required: true}
            },
            {
              field: "familyName",
              label: "Last Name:",
              validation: {required: true}
            },
            {
              field: "email",
              label: "Email",
              validation: {
                required: true,
                email: true
              }
            }
          ]
        },
        {
          type: "group",
          label: "NJCDD Subscriptions",
          layout: "grid",
          grid: {cols: 2, gutter: 10},
          items: [
            {
              field: "PFMAG",
              label: "People & Families Magazine",
              colSpan: 1,
              editor: "CheckBox"
            },
            {
              field: "AINAC",
              label: "Advocacy In Action E-Newsletter",
              colSpan: 1,
              editor: "CheckBox"
            },
            {
              field: "DINFO",
              editor: "CheckBox",
              label: "Disability in Focus Blog",
              colSpan: 1
            },
            {
              field: "CGED",
              editor: "CheckBox",
              label: "Common Ground (Education)",
              colSpan: 1
            },
            {
              field: "CNOT",
              editor: "CheckBox",
              label: "Council Notices",
              colSpan: 1
            },
            {
              field: "UNSUB",
              editor: "CheckBox",
              label: "Unsubscribe from All",
              colSpan: 1,
              change: basicUnsubscribeAll
            }
          ]
        }
      ],
      validateField: function(e) {
        basicValidationSuccess.html("");
      },
      submit: function(e) {
        e.preventDefault();
        basicValidationSuccess.html("<div class='k-messagebox k-messagebox-success'>Form data is valid!</div>");
      },
      clear: function(ev) {
        basicValidationSuccess.html("");
      }
    });

  $("#profile-interests").kendoForm(
    {
      formData: {
        registeredAs: "individual",
        sharedInfo: [
          "agency",
          "addresses",
          "race",
          "emails",
          "phones",
          "birthdate",
          "gender",
          "pronouns",
          "disability",
          "languages"
        ],
        topics: {
          "employment": true,
          "grant-funding": false,
          "housing": false,
          "family-advocacy": false,
          "self-advocacy": false,
          "health": false,
          "diversity-inclusion": false,
          "special-education": false
        }
      },
      dataSource: profileDataSource,
      layout: "grid",
      grid: {
        cols: 2,
        gutter: 20
      },
      items: [
        {
          type: "group",
          label: "Personal Information",
          layout: "grid",
          grid: {cols: 1, gutter: 10},
          items: [
            {
              field: "FirstName",
              label: "First Name:",
              validation: {required: true}
            },
            {
              field: "LastName",
              label: "Last Name:",
              validation: {required: true}
            },
            {
              field: "Email",
              label: "Email",
              validation: {
                required: true,
                email: true
              }
            }
          ]
        },
        {
          type: "group",
          label: "NJCDD Subscriptions",
          layout: "grid",
          grid: {cols: 2, gutter: 10},
          items: [
            {
              field: "PFMAG",
              label: "People & Families Magazine",
              colSpan: 1,
              editor: "CheckBox"
            },
            {
              field: "AINAC",
              label: "Advocacy In Action E-Newsletter",
              colSpan: 1,
              editor: "CheckBox"
            },
            {
              field: "DINFO",
              editor: "CheckBox",
              label: "Disability in Focus Blog",
              colSpan: 1
            },
            {
              field: "CGED",
              editor: "CheckBox",
              label: "Common Ground (Education)",
              colSpan: 1
            },
            {
              field: "CNOT",
              editor: "CheckBox",
              label: "Council Notices",
              colSpan: 1
            },
            {
              field: "UNSUB",
              editor: "CheckBox",
              label: "Unsubscibe from All",
              colSpan: 1,
              change: basicUnsubscribeAll
            }
          ]
        }
      ],
      validateField: function(e) {
        basicValidationSuccess.html("");
      },
      submit: function(e) {
        e.preventDefault();
        basicValidationSuccess.html("<div class='k-messagebox k-messagebox-success'>Form data is valid!</div>");
      },
      clear: function(ev) {
        basicValidationSuccess.html("");
      }
    });

});

function basicUnsubscribeAll(e) {
  e.preventDefault();
  console.log(e.checked);
}
