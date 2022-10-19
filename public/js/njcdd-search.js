$(document).ready(function() {
  let dataSource = new kendo.data.DataSource(
    {
      data: "odata",
      transport: {
        read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
      },
      pageSize: 20,
      schema: {
        model: {
          id: "person",
          fields: {
            email: {type: "string", label: "Email Address"},
            familyName: {type: "string", label: "Last Name"},
            givenName: {type: "string", label: "First Name"},
            city: {type: "string", label: "City"},
            county: {type: "string", label: "County"},
            state: {type: "string", label: "State"},
            postalCode: {type: "string", label: "Zip Code"},
            _id: {type: "string", label: "ID", hidden: true}
          }
        }
      }
    });

  $("#filter").kendoFilter(
    {
      width: 1100,
      dataSource: dataSource,
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
      dataSource: dataSource,
      columns: [
        {command: {text: "Profile", click: openProfile}, title: " ", width: 15},
        {field: "email", title: "Email Address", width: 55},
        {field: "familyName", title: "Last Name", width: 30},
        {field: "givenName", title: "First Name", width: 30},
        {field: "city", title: "City", width: 20},
        {field: "county", title: "County", width: 20},
        {field: "state", title: "State", width: 15},
        {field: "postalCode", title: "Zip Code", width: 25}
      ]
    });

  let filter = $("#filter").getKendoFilter();
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
