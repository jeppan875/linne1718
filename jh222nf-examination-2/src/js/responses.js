async function fetcthQuestion (URL) {
  const response = await window.fetch(URL)
  const data = await response.json()
  return data
}

async function fetcthAnswer (URL, data) {
  const response = await window.fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const feedback = await response.json()
  return feedback
}

module.exports = {
  fetcthQuestion,
  fetcthAnswer
}
