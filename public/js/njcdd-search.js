let searchData = [
  {
    email: "gary.brown@njcdd.org",
    familyName: "Brown",
    givenName: "Gary",
    city: "Trenton",
    county: "Mercer",
    state: "NJ",
    postalCode: "08625"
  },
  {
    email: "maria.ali@njcdd.org",
    familyName: "Ali",
    givenName: "Maria",
    city: "Trenton",
    county: "Mercer",
    state: "NJ",
    postalCode: "08625"
  },
  {
    email: "kyoko.coco@njcdd.org",
    familyName: "Coco",
    givenName: "Kyoko",
    city: "Trenton",
    county: "Mercer",
    state: "NJ",
    postalCode: "08625"
  },
  {
    email: "mercedes.witowsky@njcdd.org",
    familyName: "Witowsky",
    givenName: "Mercedes",
    city: "Trenton",
    county: "Mercer",
    state: "NJ",
    postalCode: "08625"
  }
];

$(document).ready(function() {
  let dataSource = new kendo.data.DataSource(
    {
      data: searchData,
      schema: {
        model: {
          id: "search",
          fields: {
            email: {type: "string", label: "Email Address"},
            familyName: {type: "string", label: "Last Name"},
            givenName: {type: "string", label: "First Name"},
            city: {type: "string", label: "City"},
            county: {type: "string", label: "County"},
            state: {type: "string", label: "State"},
            postalCode: {type: "string", label: "Zip Code"}
          }
        }
      },
      pageSize: 10
    });

  $("#searchGrid").kendoGrid(
    {
      height: 400,
      width: 1100,
      filterable: true,
      editable: false,
      pageable: true,
      sortable: true,
      dataSource: dataSource,
      columns: [
        {field: "email", title: "Email Address", width: 55},
        {field: "familyName", title: "Last Name", width: 30},
        {field: "givenName", title: "First Name", width: 30},
        {field: "city", title: "City", width: 20},
        {field: "county", title: "County", width: 20},
        {field: "state", title: "State", width: 15},
        {field: "postalCode", title: "Zip Code", width: 25}
      ]
    });

  $("#searchFilter").kendoFilter(
    {
      height: 300,
      width: 1100,
      dataSource: dataSource,
      expressionPreview: true, // Shows a text preview of the filter expression.
      applyButton: true, // Shows the built-in Apply button.

      operators: {
        string: {
          eq: "is equal to",
          startsWith: "starts with",
          endsWith: "ends with"
        }
      },

      expression: { // Defining an initial filter expression is not required.
        logic: "and",
        filters: [
          {field: "state", value: "NJ", operator: "eq"}
        ]
      }
    }).data("kendoFilter").applyFilter();
  // Chain the method call to immediately apply filtering after the widget initialization because an initial filter is
  // set.

  $("#searchFilterPreview").kendoListView(
    {
      dataSource: dataSource,
      template: kendo.template($("#item").html())
    });

});
