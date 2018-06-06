import './team-selector'

let plteams = document.querySelector('#plteams')
let template = document.querySelector('#cardTemplate')

plteams.addEventListener('teamselected', async e => {
  let teamResult = await window.fetch(`${plteams.getAttribute('src')}/teams/${e.detail.id}`)
  let teamDetail = await teamResult.json()
  document.querySelector('#cardContainer').innerHTML = ''

  let card = template.content.cloneNode(true)
  card.querySelector('#cardTitle').textContent = teamDetail.name
  card.querySelector('#cardContent').textContent = teamDetail.nickname
  card.querySelector('#cardLinks a').setAttribute('href', teamDetail.url)
  document.querySelector('#cardContainer').appendChild(card)
})
