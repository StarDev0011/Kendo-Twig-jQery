let wnd,
  detailsTemplate,
  adminData = [
    {givenName: "Maria", familyName: "Ali", email: "maria.ali@njcdd.org", role: "admin"},
    {givenName: "Gary", familyName: "Brown", email: "gary.brown@njcdd.org", role: "admin"},
    {givenName: "Mercedes", familyName: "Witowsky", email: "mercedes.witowsky@njcdd.org", role: "admin"},
    {givenName: "Kyoko", familyName: "Coco", email: "kyoko.coco@njcdd.org", role: "operator"}
  ];

$(document).ready(function() {
  let dataSource = new kendo.data.DataSource(
    {
      data: adminData,
      pageSize: 10,
      schema: {
        model: {
          id: "admin",
          fields: {
            givenName: {type: "string", label: "First Name"},
            familyName: {type: "string", label: "Last Name"},
            email: {type: "string", label: "Email Address"},
            role: {type: "string", label: "Role"}
          }
        }
      },
      sort: {
        field: "familyName",
        dir: "asc"
      }
    });

  let grid = $("#adminGrid").kendoGrid(
    {
      height: 351,
      width: 1100,
      pageable: true,
      sortable: true,
      filterable: false,
      editable: false,
      dataSource: dataSource,
      toolbar: ["Add Account"],
      columns: [
        {field: "familyName", title: "Last Name", width: 45},
        {field: "givenName", title: "First Name", width: 45},
        {field: "email", title: "Email Address", width: 90},
        {field: "role", title: "Role", width: 30},
        {command: {text: "Edit", click: showAccount}, title: " ", width: 30}
      ]
    }).data("kendoGrid");

  wnd = $("#details").kendoWindow(
    {
      title: "Edit Account Details",
      modal: true,
      visible: false,
      resizable: false,
      width: 500
    }).data("kendoWindow");

  detailsTemplate = kendo.template($("#template").html());
});

function showAccount(e) {
  e.preventDefault();

  let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
  wnd.content(detailsTemplate(dataItem));
  wnd.center().open();
}
