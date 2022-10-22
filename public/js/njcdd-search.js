/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */


$(function() {
  let contactDataSource = new kendo.data.DataSource(
    {
      transport: {
        type: "odata",
        read: {
          contentType: "application/json",
          dataType: "json",
          type: "POST",
          url: "/api/v1/contact/search"
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
      title: 'Search Scope',
      subTitle: 'Set Search Scope',
      expanded: true
    }
  );

  $("#searchScope").kendoFilter(
    {
      applyButton: true, // Shows the built-in Apply button.
      dataSource: contactDataSource,
      expressionPreview: true, // Shows a text preview of the filter expression.
      expression: { // Defining an initial filter expression is not required.
        logic: "and",
        filters: [
          {field: "state", value: "NJ", operator: "eq"}
        ]
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
          command: {text: "&nbsp;", click: openProfile, iconClass: "fa-sharp fa-solid fa-address-card"},
          sticky: true, width: 7
        },
        {
          template: '#=dirtyField(data,"verifiedAddress")#<input type="checkbox" #= verifiedAddress ? \'checked="checked"\' : "" # class="chkbx k-checkbox k-checkbox-md k-rounded-md" />',
          title: "&nbsp;",
          width: 12,
          attributes: {class: "k-text-center"}
        },
        {field: "verifiedEmail", title: "E", width: 6},
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
      let validAddress = dataItem.validAddresses ? "<i class='fa-brands fa-usps'>" : "";

      $(this).find(".badgeTemplate").kendoBadge(
        {
          themeColor: themeColor,
          text: text
        });

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

  console.log(e);
  let profile = this.dataItem($(e.currentTarget).closest("tr"));
  console.log(profile);
}
