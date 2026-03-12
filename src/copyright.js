import $ from 'jquery'
window.$ = window.jQuery = $

import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()

  // Form loading state on submit
  $('form').on('submit', function () {
    var $btn = $(this).find('button[type="submit"]')
    var originalText = $btn.text()
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status"></span> Sending...')
    setTimeout(function () {
      $btn.prop('disabled', false).text(originalText)
    }, 4000)
  })

  // Inline form validation feedback on blur
  $('input, textarea').on('blur', function () {
    if (this.checkValidity()) {
      $(this).removeClass('is-invalid').addClass('is-valid')
    } else {
      $(this).removeClass('is-valid').addClass('is-invalid')
    }
  })

  // Dynamic copyright year
  const yearEl = document.getElementById('copyright-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
})
