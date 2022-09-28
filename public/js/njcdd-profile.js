$(document).ready(function() {
  let basicValidationSuccess = $("#basic-validation-success");
  let interestsValidationSuccess = $("#interests-validation-success");
  let detailsValidationSuccess = $("#details-validation-success");
  let contactValidationSuccess = $("#contact-validation-success");

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
      formData: {
        FirstName: "John",
        LastName: "Doe",
        Email: "john.doe@email.com",
        PFMAG: true,
        AINAC: true,
        DINFO: false,
        CGED: false,
        CNOT: false,
        UNSUB: false
      },
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
