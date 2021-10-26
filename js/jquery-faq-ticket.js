"use strict";

$(() => {
  $("#email-feedback").hide();
  $("#ticket-type-feedback").hide();
  $("#description-feedback").hide();

  let emailFeedback = false;
  let ticketTypeFeedback = false;
  let descriptionFeedback = false;

  let userEmail, ticketChoosen, descriptionValue;

  $("#email").on("focusout", () => {
    checkEmail();
  });
  $("#ticket-type").on("focusout", () => {
    checkTicketType();
  });
  $("#description").on("focusout", () => {
    checkDescription();
  });

  function checkEmail() {
    userEmail = $("#email").val();
    if (userEmail.length > 20 || userEmail.length === 0) {
      $("#email-feedback").html("The length of the email cannot exceed 20 characters and it can't be empty either");
      $("#email-feedback").addClass("my-2 py-2");
      $("#email-feedback").show();
      emailFeedback = true;
    } else {
      $("#email-feedback").hide();
    }
  }

  function checkTicketType() {
    ticketChoosen = $("#ticket-type").val();
    if (ticketChoosen === null) {
      $("#ticket-type-feedback").html("Please select a valid option");
      $("#ticket-type-feedback").addClass("my-2 py-2");
      $("#ticket-type-feedback").show();
      ticketTypeFeedback = true;
    } else {
      $("#ticket-type-feedback").hide();
    }
  }

  function checkDescription() {
    descriptionValue = $("#description").val();
    if (descriptionValue === "") {
      $("#description-feedback").html("Please provide a description of the problem");
      $("#description-feedback").addClass("my-2 py-2");
      $("#description-feedback").show();
      descriptionFeedback = true;
    } else {
      $("#description-feedback").hide();
    }
  }

  $("#form-faq-ticket").on("submit", (e) => {
    e.preventDefault();

    emailFeedback = false;
    ticketTypeFeedback = false;
    descriptionFeedback = false;

    checkEmail();
    checkTicketType();
    checkDescription();

    if (emailFeedback === false && ticketTypeFeedback === false && descriptionFeedback === false) {
      const formData = [userEmail, ticketChoosen, descriptionValue];
      $.ajax({
        method: "POST",
        url: "https://jsonplaceholder.typicode.com/posts",
        contentType: "application/json",
        data: JSON.stringify(formData),
      })
        .done(() => {
          alert("Form sent successfully");
        })
        .fail(() => {
          alert("The request cannot be processed at this time, please try again later");
        });
      return true;
    } else {
      return false;
    }
  });
});
