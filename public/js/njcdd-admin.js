let adminData = [
  {givenName: "Maria", familyName: "Ali", email: "maria.ali@njcdd.org", role: "admin"},
  {givenName: "David", familyName: "Williams", email: "williams@njcdd.org", role: "operator"},
  {givenName: "Gary", familyName: "Brown", email: "gary.brown@njcdd.org", role: "operator"},
  {givenName: "Emma", familyName: "Jones", email: "jones@njcdd.org", role: "operator"},
  {givenName: "Mercedes", familyName: "Witowsky", email: "mercedes.witowsky@njcdd.org", role: "admin"},
  {givenName: "Olivia", familyName: "Davis", email: "davis@njcdd.org", role: "admin"},
  {givenName: "Jacob", familyName: "Garcia", email: "garcia@njcdd.org", role: "operator"},
  {givenName: "Kyoko", familyName: "Coco", email: "kyoko.coco@njcdd.org", role: "operator"},
  {givenName: "Thomas", familyName: "Wilson", email: "wilson@njcdd.org", role: "operator"},
  {givenName: "Elizabeth", familyName: "Martinez", email: "martinez@njcdd.org", role: "operator"},
  {givenName: "Anna", familyName: "Anderson", email: "anderson@njcdd.org", role: "operator"},
  {givenName: "Mia", familyName: "Taylor", email: "taylor@njcdd.org", role: "operator"},
  {givenName: "Daniel", familyName: "Thomas", email: "thomas@njcdd.org", role: "operator"},
  {givenName: "Joseph", familyName: "Hernandez", email: "hernandez@njcdd.org", role: "operator"},
  {givenName: "Jack", familyName: "Moore", email: "moore@njcdd.org", role: "operator"},
  {givenName: "Charles", familyName: "Martin", email: "martin@njcdd.org", role: "operator"},
  {givenName: "Oliver", familyName: "Jackson", email: "jackson@njcdd.org", role: "operator"},
  {givenName: "Samuel", familyName: "Thompson", email: "thompson@njcdd.org", role: "operator"},
  {givenName: "Michael", familyName: "White", email: "white@njcdd.org", role: "operator"}
];

$(document).ready(function() {
  let dataSource = new kendo.data.DataSource(
    {
      data: adminData,
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
      pageSize: 8,
      sort: {
        field: "familyName",
        dir: "asc"
      }
    });

  $("#adminGrid").kendoGrid(
    {
      height: 351,
      width: 1100,
      pageable: true,
      sortable: true,
      filterable: false,
      editable: false,
      dataSource: dataSource,
      toolbar: ["Export to Excel", "Export to CSV"],
      search: {
        fields: ["familyName", "givenNName", "city", "county"]
      },
      columns: [
        {field: "familyName", title: "Last Name", width: 45},
        {field: "givenName", title: "First Name", width: 45},
        {field: "email", title: "Email Address", width: 90},
        {field: "role", title: "Role", width: 30},
        {field: "Edits", title: "", width: 20}
      ]
    });
});
