let adminData = [
  {givenName: "John", familyName: "Smith", email: "smith@njcdd.org", role: "admin"},
  {givenName: "James", familyName: "Johnson", email: "johnson@njcdd.org", role: "admin"},
  {givenName: "David", familyName: "Williams", email: "williams@njcdd.org", role: "operator"},
  {givenName: "Gary", familyName: "Brown", email: "brown@njcdd.org", role: "operator"},
  {givenName: "Emma", familyName: "Jones", email: "jones@njcdd.org", role: "operator"},
  {givenName: "Henry", familyName: "Miller", email: "miller@njcdd.org", role: "admin"},
  {givenName: "Olivia", familyName: "Davis", email: "davis@njcdd.org", role: "admin"},
  {givenName: "Jacob", familyName: "Garcia", email: "garcia@njcdd.org", role: "operator"},
  {givenName: "Sarah", familyName: "Rodriguez", email: "rodriguez@njcdd.org", role: "operator"},
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
  let dataSource = {
    data: adminData,
    schema: {
      model: {
        fields: {
          familyName: {type: "string"},
          givenName: {type: "string"},
          email: {type: "string"},
          role: {type: "string"}
        }
      }
    },
    pageSize: 8,
    sort: {
      field: "familyName",
      dir: "asc"
    }
  };

}


let gridData = {
  dataSource: gridDataSource,
  height: 351,
  width: 800,
  pageable: true,
  sortable: true,
  filterable: false,
  columns: [{
    field: "familyName",
    title: "Last Name",
    width: 160
  }, {
    field: "givenName",
    title: "First Name",
    width: 160
  }, {
    field: "email",
    title: "Email Address",
    width: 250
  }, {
    field: "role",
    title: "Role"
  }]
};

