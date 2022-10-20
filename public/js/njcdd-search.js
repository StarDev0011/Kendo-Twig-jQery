// noinspection HttpUrlsUsage


$(document).ready(function() {
  let contactDataSource = new kendo.data.DataSource(
    {
      transport: {
        type: "odata",
        read: {
          contentType: "application/json",
          dataType: "json",
          type: "POST",
          url: "http://localhost:3200/api/v1/contact/search"
        }
      },
      pageSize: 25,
      schema: {
        model: {
          id: "contact",
          fields: {
            organization: {type: "string", label: "Organization"},
            familyName: {type: "string", label: "Last Name"},
            givenName: {type: "string", label: "First Name"},
            city: {type: "string", label: "City"},
            county: {type: "string", label: "County"},
            state: {type: "string", label: "State"},
            postalCode: {type: "string", label: "Zip Code"},
            email: {type: "string", label: "Email Address"},
            verifiedEmail: {type: "boolean", label: "Email"},
            verifiedAddress: {type: "boolean", label: "USPS"},
            _id: {type: "string", label: "ID", hidden: true}
          }
        }
      }
    });

  $("#searchFilter").kendoFilter(
    {
      width: 1100,
      dataSource: contactDataSource,
      applyButton: true, // Shows the built-in Apply button.
      expressionPreview: true, // Shows a text preview of the filter expression.
      expression: { // Defining an initial filter expression is not required.
        logic: "and",
        filters: [
          {field: "state", value: "NJ", operator: "eq"}
        ]
      }
    });
  // Chain the method call to immediately apply filtering after the widget initialization because an initial filter is
  // set.

  $("#searchGrid").kendoGrid(
    {
      height: 400,
      width: 1100,
      filterable: true,
      editable: false,
      pageable: true,
      sortable: true,
      reorderable: true,
      resizable: true,
      toolbar: ["Export to Excel", "Export to CSV"],
      dataSource: contactDataSource,
      columns: [
        {command: {text: "Profile", click: openProfile}, title: " ", width: 15},
        {field: "organization", title: "Organization", width: 35},
        {field: "familyName", title: "Last Name", width: 30},
        {field: "givenName", title: "First Name", width: 30},
        {field: "city", title: "City", width: 20},
        {field: "state", title: "State", width: 15},
        {field: "postalCode", title: "Zip Code", width: 25},
        {field: "email", title: "Email Address", width: 35}
      ]
    });

  let filter = $("#searchFilter").getKendoFilter();
  filter.applyFilter();

  $("#save").click(function(e) {
    e.preventDefault();
    localStorage["kendo-filter-options"] = kendo.stringify(filter.getOptions());
  });

  $("#load").click(function(e) {
    e.preventDefault();
    var options = localStorage["kendo-filter-options"];
    if(options) {
      options = JSON.parse(options);
      options.dataSource = dataSource;
      filter.setOptions(options);
      filter.applyFilter();
    }
  });
});

function openProfile(e) {
  e.preventDefault();

  let profile = this.dataItem($(e.currentTarget).closest("tr"));
  console.log(profile);
}
