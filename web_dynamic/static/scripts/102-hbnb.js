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
  data.map((place, i) => {
    const date = new Date(place.updated_at.split(' ')[0])
    if (i < 9 && place) {
      $('#postings').append(`
        <div class="col-md-4 place">
          <div class="card-box-b card-shadow news-box">
            <div class="img-box-b">
		    <img src='./../static/images/post-${i + 1}.jpg' alt="" class="img-b img-fluid">
            </div>
            <div class="card-overlay">
              <div class="card-header-b">
                <div class="card-category-b">
			<a href="#" class="category-b">Available</a>
                </div>
                <div class="card-title-b">
                  <h2 class="title-2">

			  <a href="blog-single.html">${place.name}
                      <br> new</a>
                  </h2>
                </div>
                <div class="card-date">
                  <span class="date-b">${date.toDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
	    `)
    }
  })
}

$(document).ready(() => {
  let a_checklist = []
  let s_checklist = []
  let c_checklist = []

  reload()

  $('#state').change(() => {
    console.log('change')
    s_checklist = [$('#state option:selected').attr('data-id')]
  })
  $('#search_btn').click(() => {
    const obj = {
      states: s_checklist,
      cities: c_checklist,
      amenities: a_checklist
    }
    $('.place').remove()
    console.log(obj)
    reload(obj)
  })
})

