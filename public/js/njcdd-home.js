/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

let tileLayout = {
  height: "100%",
  reorderable: true,
  containers: [{
    colSpan: 1,
    rowSpan: 1,
    header: {
      text: "Database Records"
    },
    bodyTemplate: kendo.template($("#contacts-card-template").html())
  }, {
    colSpan: 1,
    rowspan: 1,
    header: {
      text: "Email Addresses"
    },
    bodyTemplate: kendo.template($("#emails-card-template").html())
  }, {
    colSpan: 1,
    rowSpan: 1,
    header: {
      text: "Verified Emails"
    },
    bodyTemplate: kendo.template($("#v-emails-card-template").html())
  }, {
    colSpan: 1,
    rowSpan: 1,
    header: {
      text: "Phone Numbers"
    },
    bodyTemplate: kendo.template($("#phones-card-template").html())
  }, {
    colSpan: 1,
    rowSpan: 1,
    header: {
      text: "Mailing Addresses"
    },
    bodyTemplate: kendo.template($("#addresses-card-template").html())
  }, {
    colSpan: 1,
    rowSpan: 1,
    header: {
      text: "Verified Mailing Addresses"
    },
    bodyTemplate: kendo.template($("#v-addresses-card-template").html())
  }]
};

$(function() {
  $.get("http://njcdd-api:3210/api/v1/summary", (data) => {
    if(data) {
      console.log(data);

      tileLayout.columns = getTiledColumns();
      $("#njcdd-summary").kendoTileLayout(tileLayout);
      $("#card-contacts-value").text(data.contacts.toLocaleString());
      $("#card-addresses-value").text(data.addresses.toLocaleString());
      $("#card-v-addresses-value").text(data.validAddresses.toLocaleString());
      $("#card-emails-value").text(data.emails.toLocaleString());
      $("#card-v-emails-value").text(data.validEmails.toLocaleString());
      $("#card-phones-value").text(data.phones.toLocaleString());
    }
  });
});

$(window).on("resize", function() {
  tileLayout.columns = getTiledColumns();
  $("#njcdd-summary").kendoTileLayout(tileLayout);
});

function getTiledColumns() {
  let windowWidth = $(document).width();

  return Math.ceil(windowWidth / 350);
}
