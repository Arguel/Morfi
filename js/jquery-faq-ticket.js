"use strict";

$(() => {

  $('#email-feedback').hide();
  $('#ticket-type-feedback').hide();
  $('#description-feedback').hide();

  let emailFeedback = false;
  let ticketTypeFeedback = false;
  let descriptionFeedback = false;

  $('#email').on('focusout', () => {
    checkEmail();
  });
  $('#ticket-type').on('focusout', () => {
    checkTicketType();
  });
  $('#description').on('focusout', () => {
    checkDescription();
  });

  function checkEmail() {
    const usernameLength = $('#email').val().length;
    if (usernameLength > 20 || usernameLength === 0) {
      $('#email-feedback').html("The length of the email cannot exceed 20 characters and it can't be empty either");
      $('#email-feedback').show();
      emailFeedback = true;
    } else {
      $('#email-feedback').hide();
    }
  }

  function checkTicketType() {
    const ticketChoosen = $('#ticket-type').val();
    if (ticketChoosen === null) {
      $('#ticket-type-feedback').html('Please select a valid option');
      $('#ticket-type-feedback').show();
      ticketTypeFeedback = true;
    } else {
      $('#ticket-type-feedback').hide();
    }
  }

  function checkDescription() {
    const descriptionValue = $('#description').val();
    if (descriptionValue === '') {
      $('#description-feedback').html('Please provide a description of the problem');
      $('#description-feedback').show();
      descriptionFeedback = true;
    } else {
      $('#description-feedback').hide();
    }
  }

  $('#form-faq-ticket').on('submit', () => {

    emailFeedback = false;
    ticketTypeFeedback = false;
    descriptionFeedback = false;

    checkEmail();
    checkTicketType();
    checkDescription();

    if (emailFeedback === false && ticketTypeFeedback === false && descriptionFeedback === false) {
      return true;
    } else {
      return false;
    }

  })
});
