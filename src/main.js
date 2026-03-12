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

  // Product name → image path mapping
  var PRODUCT_IMAGES = {
    'Food Grains Packing': 'images/Product-001.png',
    'Chemical Packing':    'images/Product-002.png',
    'Veg & Fruits Packing':'images/Product-003.png',
    'Jute Packing':        'images/Product-004.png',
    'Cement Packing':      'images/Product-005.png',
    'Industrial Packing (FIBC)': 'images/Product-006.png',
    'Charcoal Packing':    'images/Product-007.png',
    'Organic Packing':     'images/Product-008.png'
  }

  // Multi-step modal helpers
  function showStep(step) {
    $('#modal-step-1, #modal-step-2').hide()
    $('#modal-step-' + step).show()
    $('[data-step-indicator]').removeClass('active completed')
    if (step === 1) {
      $('[data-step-indicator="1"]').addClass('active')
    } else {
      $('[data-step-indicator="1"]').addClass('completed')
      $('[data-step-indicator="2"]').addClass('active')
    }
  }

  // Next button: validate step 1 fields, then go to step 2
  $(document).on('click', '#modal-next-btn', function () {
    var valid = true
    $('#modal-step-1 [required]').each(function () {
      if (!this.checkValidity()) {
        $(this).removeClass('is-valid').addClass('is-invalid')
        valid = false
      } else {
        $(this).removeClass('is-invalid').addClass('is-valid')
      }
    })
    if (valid) {
      showStep(2)
    }
  })

  // Back button
  $(document).on('click', '#modal-back-btn', function () {
    showStep(1)
  })

  // Pass product name + image into modal when opened from a product card
  $(document).on('click', '[data-toggle="modal"][data-product]', function () {
    var product = $(this).data('product')
    if (product) {
      $('#modal-product-name').text(product)
      $('#modal-product-input').val(product)
      $('#enquiryModalLabel').text('Get a Free Quote')

      // Show product image preview
      var imgSrc = PRODUCT_IMAGES[product]
      if (imgSrc) {
        $('#modal-product-img').attr('src', imgSrc).attr('alt', product)
        $('#modal-product-preview').show()
        $('#modal-no-product').hide()
      }
    }
  })

  // Reset modal context when opened from generic "Get Free Quote" button
  $(document).on('click', '[data-toggle="modal"]:not([data-product])', function () {
    $('#modal-product-preview').hide()
    $('#modal-no-product').show()
    $('#modal-product-input').val('')
    $('#modal-product-name').text('')
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

  // Reset modal state on close
  $('#enquiryModal').on('hidden.bs.modal', function () {
    showStep(1)
    $('#modal-product-preview').hide()
    $('#modal-no-product').hide()
    $('#modal-product-input').val('')
    $('#modal-product-name').text('')
    $('#enquiryModalLabel').text('Get a Free Quote')
    $('#modal-form-success, #modal-form-error').addClass('d-none')
    $('#modal-message').val('')
    $('#modal-quantity, #modal-kg').val('')
    $(this).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid')
  })

  // =============================================
  //  QUOTATION MODAL (hero CTA)
  // =============================================

  function showQStep(step) {
    $('#q-step-1, #q-step-2').hide()
    $('#q-step-' + step).show()
    $('[data-q-step-indicator]').removeClass('active completed')
    if (step === 1) {
      $('[data-q-step-indicator="1"]').addClass('active')
    } else {
      $('[data-q-step-indicator="1"]').addClass('completed')
      $('[data-q-step-indicator="2"]').addClass('active')
    }
  }

  // Material → lamination & printing options mapping
  // null = not applicable for this material (row stays hidden)
  var MATERIAL_OPTIONS = {
    'PP Woven': {
      lamination: ['Laminated (BOPP)', 'Unlaminated', 'Not sure'],
      printing:   ['No printing', 'Single colour', 'Multi colour', 'Full BOPP print']
    },
    'HDPE Woven': {
      lamination: ['Laminated (BOPP)', 'Unlaminated', 'Not sure'],
      printing:   ['No printing', 'Single colour', 'Multi colour', 'Full BOPP print']
    },
    'PP Non-Woven':            null,
    'Jute / Jute-look':        null,
    'FIBC (Jumbo Bag)':        null,
    'Not sure – need advice': {
      lamination: ['Laminated', 'Unlaminated', 'Not sure'],
      printing:   ['No printing', 'Single colour', 'Multi colour', 'Not sure']
    }
  }

  function populateSelect($select, options) {
    $select.empty().append('<option value="" disabled selected>Select option</option>')
    options.forEach(function (opt) {
      $select.append('<option value="' + opt + '">' + opt + '</option>')
    })
    if (options.length === 1) {
      $select.val(options[0])
    }
  }

  // Material card selection
  $(document).on('click', '.material-card', function () {
    var material = $(this).data('material')
    $('.material-card').removeClass('selected')
    $(this).addClass('selected')
    $('#q-material').val(material)

    var opts = MATERIAL_OPTIONS[material]
    if (opts) {
      populateSelect($('#q-lamination'), opts.lamination)
      populateSelect($('#q-print'), opts.printing)
      $('#q-lamination').prop('required', true)
      $('#q-material-options').slideDown(200)
    } else {
      $('#q-material-options').slideUp(200)
      $('#q-lamination').prop('required', false).val('')
      $('#q-print').val('')
    }
  })

  // Next button: validate step 1 fields, then go to step 2
  $(document).on('click', '#q-next-btn', function () {
    var valid = true
    $('#q-step-1 [required]').each(function () {
      if (!this.checkValidity()) {
        $(this).removeClass('is-valid').addClass('is-invalid')
        valid = false
      } else {
        $(this).removeClass('is-invalid').addClass('is-valid')
      }
    })
    if (valid) {
      showQStep(2)
    }
  })

  // Back button
  $(document).on('click', '#q-back-btn', function () {
    showQStep(1)
  })

  // Persist contact fields for quotation modal too
  var Q_PERSIST = [
    { id: '#q-name',  key: 'rp_name'  },
    { id: '#q-phone', key: 'rp_phone' },
    { id: '#q-email', key: 'rp_email' }
  ]

  Q_PERSIST.forEach(function (f) {
    $(document).on('input', f.id, function () {
      sessionStorage.setItem(f.key, this.value)
    })
  })

  $('#quotationModal').on('show.bs.modal', function () {
    Q_PERSIST.forEach(function (f) {
      var saved = sessionStorage.getItem(f.key)
      if (saved) $(f.id).val(saved)
    })
  })

  // Reset quotation modal on close
  $('#quotationModal').on('hidden.bs.modal', function () {
    showQStep(1)
    $('#q-form-success, #q-form-error').addClass('d-none')
    $('.material-card').removeClass('selected')
    $('#q-material').val('')
    $('#q-material-options').hide()
    $('#q-lamination, #q-print').each(function () { this.selectedIndex = 0 })
    $('#q-weight, #q-quantity, #q-notes').val('')
    $('#q-address, #q-pin, #q-state').val('')
    $('#q-country').val('India')
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
