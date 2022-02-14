$(document).ready(() => {
  const checklist = {}
  $('INPUT:checkbox').change(function() {
    if ($(this).is(':checked')) {
      let key = $(this).attr('data-id')
      let value = $(this).attr('data-name')
      checklist[key] = value
    }
    if (!$(this).is(':checked')) {
      delete checklist[$(this).attr('data-id')]
    }
  })

  $.get('http://0.0.0.0:1107/api/v1/status', data => {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available')
    } else {
      $('DIV#api_status').removeClass('available')
    }
  })
})
