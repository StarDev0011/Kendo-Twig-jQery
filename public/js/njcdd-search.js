/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

$(function() {
  let contactDataSource = new kendo.data.DataSource(
    {
      transport: {
        type: "jsonp",
        read: {
          contentType: "application/json",
          dataType: "json",
          type: "POST",
          url: "http://njcdd-api:3210/api/v1/profile/search"
        }
      },
      pageSize: 10,
      schema: {
        model: {
          id: "_id",
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
    }
  );

  $('#searchScopePanel').kendoExpansionPanel(
    {
      title: 'Audience',
      subTitle: 'Select and Audience',
      expanded: false
    }
  );

  $("#searchScope").kendoFilter(
    {
      applyButton: true, // Shows the built-in Apply button.
      dataSource: contactDataSource,
      expressionPreview: true, // Shows a text preview of the filter expression.
      expression: { // Defining an initial filter expression is not required.
        logic: "and",
        filters: []
      },
      fields: [
        {name: "organization", type: "string", label: "Organization"},
        {name: "city", type: "string", label: "City"},
        {name: "county", type: "string", label: "County"},
        {name: "state", type: "string", label: "State"},
        {name: "email", type: "string", label: "Email Address"},
        {name: "verifiedEmail", type: "boolean", label: "Verified Email"},
        {name: "verifiedAddress", type: "boolean", label: "Verified Address"}
      ]
    }
  );

  $("#searchGrid").kendoGrid(
    {
      autoBind: true,
      dataBound: onDataBound,
      dataSource: contactDataSource,
      editable: false,
      filterable: true,
      pageable: true,
      reorderable: true,
      resizable: true,
      selectable: "row",
      sortable: true,
      toolbar: [
        "Export to Excel",
        "Export to CSV",
        "Save Search",
        "Load Search"
      ],
      columns: [
        {
          sticky: true, width: 10,
          command: {
            text: " ",
            title: "Open Profile",
            click: openProfile,
            iconClass: "fa-sharp fa-solid fa-address-card"
          }
        },
        {
          field: "verifiedAddress", title: "&nbsp;&nbsp;verifiedAddress", width: 7,
          attributes: {class: 'k-text-center'},
          template:
            "# if(verifiedAddress == true){ #" +
            "<i class='fa-brands fa-usps'></i>" +
            "#} else {#" +
            "<i class='fa-sharp fa-solid fa-ban'></i>" +
            "#} #"
        },
        {
          field: "verifiedEmail", title: "&nbsp;&nbsp;verifiedEmail", width: 7,
          attributes: {class: 'k-text-center'},
          template:
            "# if(verifiedEmail == true){ #" +
            "<i class='fa-sharp fa-solid fa-envelope-circle-check'></i>" +
            "#} else {#" +
            "<i class='fa-sharp fa-solid fa-ban'></i>" +
            "#} #"
        },
        {field: "organization", title: "Organization", width: 35},
        {field: "familyName", title: "Last Name", width: 30},
        {field: "givenName", title: "First Name", width: 30},
        {field: "city", title: "City", width: 20},
        {field: "state", title: "State", width: 15},
        {field: "postalCode", title: "Zip Code", width: 25},
        {field: "email", title: "Email Address", width: 35}
      ]
    }
  );

  function onDataBound(e) {
    let grid = this;
    grid.table.find("tr").each(function() {
      let dataItem = grid.dataItem(this);

      kendo.bind($(this), dataItem);
    });
  }

  $("#save").click(function(e) {
    let filter = $("#searchFilter").getKendoFilter();
    filter.applyFilter();

    e.preventDefault();
    localStorage["kendo-filter-options"] = kendo.stringify(filter.getOptions());
  });

  $("#load").click(function(e) {
    e.preventDefault();
    let options = localStorage["kendo-filter-options"];
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
  let url = `/profile/${profile._id}`;
  console.log(`URL: ${url}`);
  window.open(url, "_blank");
}
