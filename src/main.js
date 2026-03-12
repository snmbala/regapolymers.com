import $ from 'jquery'
window.$ = window.jQuery = $

import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

$(document).ready(function () {
  // Scrollspy
  $('body').scrollspy({ target: '#navbarResponsive', offset: 120 })
  $('[data-toggle="tooltip"]').tooltip()

  // Enhanced active state management
  $('body').on('activate.bs.scrollspy', function (e, obj) {
    if (obj && obj.relatedTarget) {
      $('.navbar-nav .nav-link').removeClass('active')
      $('.navbar-nav .nav-link[href="' + obj.relatedTarget + '"]').addClass('active')
    }
  })

  // Pass product name into modal when opened from a product card
  $(document).on('click', '[data-toggle="modal"][data-product]', function () {
    var product = $(this).data('product')
    if (product) {
      $('#modal-product-name').text(product)
      $('#modal-product-input').val(product)
      $('#modal-product-context').show()
      $('#enquiryModalLabel').text('Get a Free Quote \u2014 ' + product)
    }
  })

  // Reset modal context when opened from generic "Get Free Quote" button
  $(document).on('click', '[data-toggle="modal"]:not([data-product])', function () {
    $('#modal-product-context').hide()
    $('#modal-product-input').val('')
    $('#enquiryModalLabel').text('Get a Free Quote')
  })

  // Persist name/phone/email across modal reopens for the browser session
  var MODAL_PERSIST = [
    { id: '#modal-name',  key: 'rp_name'  },
    { id: '#modal-phone', key: 'rp_phone' },
    { id: '#modal-email', key: 'rp_email' }
  ]

  MODAL_PERSIST.forEach(function (f) {
    $(document).on('input', f.id, function () {
      sessionStorage.setItem(f.key, this.value)
    })
  })

  $('#enquiryModal').on('show.bs.modal', function () {
    MODAL_PERSIST.forEach(function (f) {
      var saved = sessionStorage.getItem(f.key)
      if (saved) $(f.id).val(saved)
    })
  })

  // Reset modal state on close — preserve contact fields, clear message only
  $('#enquiryModal').on('hidden.bs.modal', function () {
    $('#modal-product-context').hide()
    $('#modal-product-input').val('')
    $('#enquiryModalLabel').text('Get a Free Quote')
    $('#modal-form-success, #modal-form-error').addClass('d-none')
    $('#modal-message').val('')
    $(this).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid')
  })

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

  // Scrollspy refresh on resize
  $(window).on('resize', function () {
    $('body').scrollspy('refresh')
  })

  // Handle hash on page load (e.g., from copyright page)
  $(window).on('load', function () {
    if (window.location.hash) {
      setTimeout(function () {
        var target = $(window.location.hash)
        if (target.length) {
          $('html, body').animate({ scrollTop: target.offset().top - 90 }, 500, function () {
            $('body').scrollspy('refresh')
            $('.navbar-nav .nav-link').removeClass('active')
            $('.navbar-nav .nav-link[href="' + window.location.hash + '"]').addClass('active')
          })
        }
      }, 200)
    }
  })

  // Handle in-page hash changes
  $(window).on('hashchange', function () {
    var target = $(window.location.hash)
    if (target.length) {
      $('html, body').animate({ scrollTop: target.offset().top - 90 }, 500, function () {
        $('body').scrollspy('refresh')
        $('.navbar-nav .nav-link').removeClass('active')
        $('.navbar-nav .nav-link[href="' + window.location.hash + '"]').addClass('active')
      })
    }
  })

  // Dynamic copyright year
  const yearEl = document.getElementById('copyright-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
})
