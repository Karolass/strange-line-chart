const parentHTML = `
<thead>
  <tr>
    <th scope="col">期號</th>
    <th scope="col">開獎號碼</th>
    <th scope="col">萬位</th>
    <th scope="col">千位</th>
    <th scope="col">百位</th>
    <th scope="col">十位</th>
    <th scope="col">個位</th>
    <th scope="col">
      <div class="row">
        <div class="col">豹子</div>
        <div class="col">組三</div>
        <div class="col">組六</div>
        <div class="col">和值</div>
      </div>
    </th>
  </tr>
</thead>
<tbody></tbody>
`

export default {
  element: '',

  init(element, datas) {
    this.element = element
    const table = document.createElement('table')
    table.className = 'table table-hover'
    table.innerHTML = parentHTML

    datas.forEach((d) => {
      const tbody = table.querySelector('tbody')
      const tr = document.createElement('tr')
      tr.innerHTML = this.rowDataHTML(d)
      tbody.appendChild(tr)
    })

    document.querySelector(this.element).appendChild(table)
    this.canvasDrawer()
    window.addEventListener('resize', () => {
      if (document.querySelector('canvas')) {
        document.querySelector('canvas').remove()
      }
      this.canvasDrawer()
    })
  },

  rowDataHTML(data) {
    return `<td>${data.series}</td>
    <td>${data.numbers.split(',').join('')}</td>
    ${this.numbersHTML(data.numbers)}
    ${this.pairAndSummary(data.numbers)}`
  },

  numbersHTML(numbers) {
    let HTML = ''
    numbers.split(',').forEach((n) => {
      const td = document.createElement('td')
      const div = document.createElement('div')
      div.className = 'row'
      for (let i = 0; i < 10; i++) {
        if (i == n) {
          div.innerHTML += `<div class="col">${n}</div>`
        } else {
          div.innerHTML += '<div class="col"></div>'
        }
      }
      td.appendChild(div)
      HTML += td.outerHTML
    })

    return HTML
  },

  pairAndSummary(numbers) {
    const td = document.createElement('td')
    const div = document.createElement('div')
    div.className = 'row'
    const array = numbers.split(',').slice(2)

    if (array[0] !== 'X') {
      // 豹子
      const threePair = array[0] == array[1] && array[0] == array[2]
      div.innerHTML += `<div class="col ${threePair ? 'checked color-1' : ''}"></div>`

      // 組三
      const twoPair = !threePair && (array[0] == array[1] || array[0] == array[2] || array[1] == array[2])
      div.innerHTML += `<div class="col ${twoPair ? 'checked color-2' : ''}"></div>`

      // 組六
      div.innerHTML += `<div class="col ${!threePair && !twoPair ? 'checked color-3' : ''}"></div>`

      // 和值
      div.innerHTML += `<div class="col">${parseInt(array[0]) + parseInt(array[1]) + parseInt(array[2])}</div>`
    } else {
      div.innerHTML = '<div class="col"></div><div class="col"></div><div class="col"></div><div class="col"></div>'
    }

    td.appendChild(div)

    return td.outerHTML
  },

  canvasDrawer() {
    const table = document.querySelector('table')
    const tbody = document.querySelector('tbody')
    const array1 = []
    const trs = tbody.querySelectorAll('tr')

    for (let i = 0; i < trs.length; i++) {
      const array2 = new Array(5)
      const tds = trs[i].querySelectorAll('td')

      for (let j = 0; j < tds.length; j++) {
        if (j >= 2 && j <= 6) {
          const cols = tds[j].querySelectorAll('.col')

          for (let k = 0; k < cols.length; k++) {
            if (cols[k].innerText.length != 0) {
              array2[j - 2] = [ cols[k].offsetLeft - 3.6, cols[k].offsetTop - table.offsetTop + cols[k].clientHeight / 2 ]
            }
          }
        }
      }

      array1.push(array2)
    }

    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', table.clientWidth)
    canvas.setAttribute('height', table.clientHeight)
    canvas.style.top = table.offsetTop + 'px'
    canvas.style.left = table.offsetLeft + 'px'
    document.querySelector(this.element).appendChild(canvas)

    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')

      for (let i = 0; i < array1[0].length; i++) {
        ctx.fillStyle = i % 2 == 1 ? '#54b8fd' : '#fea4a4'
        ctx.strokeStyle = i % 2 == 1 ? '#54b8fd' : '#fea4a4'
        ctx.lineCap = 'round'
        ctx.lineWidth = 3

        for (let j = 0; j < array1.length; j++) {
          if (array1[j][0] == undefined) {
            continue
          } else if (j == 0 || array1[j - 1][0] == undefined) {
            ctx.save()
            // line
            ctx.beginPath()
            ctx.moveTo(array1[j][i][0], array1[j][i][1])
            // circle
            ctx.arc(array1[j][i][0], array1[j][i][1], 12, 0, Math.PI*2, true)
            ctx.fill()
            ctx.restore()
          } else {
            ctx.save()
            // line
            ctx.beginPath()
            ctx.moveTo(array1[j - 1][i][0], array1[j - 1][i][1])
            ctx.lineTo(array1[j][i][0], array1[j][i][1])
            ctx.closePath()
            ctx.stroke()
            // circle
            ctx.arc(array1[j][i][0], array1[j][i][1], 12, 0, Math.PI*2, true)
            ctx.fill()
            ctx.restore()
          }
        }
      }
    }
  }
}