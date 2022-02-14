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

  $.ajax({
    url: 'http://0.0.0.0:1107/api/v1/places_search',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: data => render(data)
  })

  $('button').click(() => {
    let obj = { amenities: [] }
    for (let key of Object.keys(checklist)) {
      obj.amenities.push(key)
    }
    $('article').remove()
    $.ajax({
      url: 'http://0.0.0.0:1107/api/v1/places_search',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(obj),
      success: data => render(data)
    })
  })
})

const render = data => {
  data.map(place => {
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
        	<strong>Owner: BLANK </strong>
    	</div>
    	<div class="description">
        	${place.description}
    	</div>
	</article>`)
  })
}
