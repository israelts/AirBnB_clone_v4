const users = {}
$.getJSON('http://0.0.0.0:1107/api/v1/users', data => {
  data.forEach(el => {
    users[el.id] = `${el.first_name} ${el.last_name}`
  })
})

const reload = obj => {
  $.ajax({
      url: 'http://0.0.0.0:1107/api/v1/places_search',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(obj || {}),
      success: data => render(data)
  })
}

const render = data => {
  data.map(place => {
    $.getJSON(`http://0.0.0.0:1107/api/v1/places/${place.id}/reviews`, data => {
      const r = '#' + `${place.id}` + 'r'
      $(r).html(`${data.length} Reviews`)
    })
    $('.places h1').after(`
      <article>
          <div class="title">
              <h2>${place.name}</h2>
              <div class="price_by_night">
                  $${place.price_by_night}
              </div>
          </div>
          <div class="information">
              <div class="max_guest">
                  <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                  <br />
                  ${place.max_guest} Guests
              </div>
              <div class="number_rooms">
                  <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                  <br />
                  ${place.number_rooms} Bedrooms
              </div>
              <div class="number_bathrooms">
                  <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                  <br />
                  ${place.number_bathrooms} Bathroom
              </div>
          </div>
          <div class="user">
              <strong>Owner: ${users[place.user_id]} </strong>
          </div>
          <div class="description">
              ${place.description}
          </div>
          <br>
          <div class="review">
            <strong id=${`${place.id}r`}>Reviews</strong>
            <span class="review_button" id=${place.id}>[ show ]</span>
          </div>
      </article>`)
  })
  $('.review_button').click(function() {
    const placeID = $(this).attr('id')
    if ($(this).text() === '[ show ]') {
      $(this).text('[ Hide ]')
      $.get(`http://0.0.0.0:1107/api/v1/places/${placeID}/reviews`, data => {
        data.forEach(r => {
          const date = new Date(r.updated_at.split(' ')[0])
          $(`#${placeID}`).after(`
            <p class=${placeID}><strong>From ${users[r.user_id]} the ${date.toDateString()}</strong></p>
            <p class=${placeID}>${r.text}</p>`)
        })
      })
    } else {
      $(this).text('[ show ]')
      $(`.${placeID}`).remove()
    }
  })
}

$(document).ready(() => {
  const a_checklist = {}
  const s_checklist = {}
  const c_checklist = {}

  $.get('http://0.0.0.0:1107/api/v1/status', data => {
    data.status === 'OK'
      ? $('DIV#api_status').addClass('available')
      : $('DIV#api_status').removeClass('available')
  })

  reload()

  $('.amenities INPUT:checkbox').change(function() {
    if ($(this).is(':checked')) {
      const key = $(this).attr('data-id')
      const value = $(this).attr('data-name')
      a_checklist[key] = value
    }
    if (!$(this).is(':checked')) {
      delete a_checklist[$(this).attr('data-id')]
    }
  })

  $('.states INPUT:checkbox').change(function() {
    if ($(this).is(':checked')) {
      const key = $(this).attr('data-id')
      const value = $(this).attr('data-name')
      s_checklist[key] = value
    }
    if (!$(this).is(':checked')) {
      delete s_checklist[$(this).attr('data-id')]
    }
    const combine = Object.values(s_checklist).concat(
      Object.values(c_checklist)
    )
    $('.locations h4').text(combine.join(', '))
  })

  $('.cities INPUT:checkbox').change(function() {
    if ($(this).is(':checked')) {
      const key = $(this).attr('data-id')
      const value = $(this).attr('data-name')
      c_checklist[key] = value
    }
    if (!$(this).is(':checked')) {
      delete c_checklist[$(this).attr('data-id')]
    }
    const combine = Object.values(s_checklist).concat(
      Object.values(c_checklist)
    )
    $('.locations h4').text(combine.join(', '))
  })

  $('button').click(() => {
    const obj = {
      states: [...Object.keys(s_checklist)],
      cities: [...Object.keys(c_checklist)],
      amenities: [...Object.keys(a_checklist)]
    }
    $('article').remove()
    reload(obj)
    })
})

