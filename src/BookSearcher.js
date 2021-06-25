const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

class BookSearcher {
  constructor (isbn) {
    this._isbn = isbn
    this._urlOfAmazon = `https://www.amazon.co.jp/s?k=${isbn}`
    this._urlOfDmm = `https://books.rakuten.co.jp/search?sitem=${isbn}&g=001&l-id=pc-search-box`
    this._urlOfSeshop = `https://www.seshop.com/search?keyword=${isbn}&category_id=1`
  }

  get urlOfAmazon () {
    return this._urlOfAmazon
  }

  get urlOfDmm () {
    return this._urlOfDmm
  }

  get urlOfSeshop () {
    return this._urlOfSeshop
  }

  async returnBookTitle () {
    try {
      const response = await fetch(`https://api.openbd.jp/v1/get?isbn=${this._isbn}&pretty`)
      const json = await response.json()
      return json[0].summary.title
    } catch (e) {
      console.log(e)
    }
  }

  async returnPriceText (url, element) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(false)
    const DCL = { waitUntil: 'domcontentloaded' }

    await page.goto(url, DCL)

    let priceText
    try {
      priceText = await page.$eval(element, e => e.textContent)
    } catch {
      priceText = '-'
    }

    await browser.close()
    return priceText
  }

  async formatPrice (url, element, prefix) {
    const priceText = await this.returnPriceText(url, element)

    if (priceText === '-') {
      return priceText
    } else {
      let price = priceText.replace(prefix, '')
      price = price.replace(',', '')
      return parseInt(price)
    }
  }

  async returnAmazonPrice () {
    const element = '.a-offscreen'
    return this.formatPrice(this._urlOfAmazon, element, '￥')
  }

  async returnDmmPrice () {
    const element = '.rbcomp__item-list__item__price'
    return this.formatPrice(this._urlOfDmm, element, '円')
  }

  async returnSeshopPrice () {
    const element = '.detail-price'
    return this.formatPrice(this._urlOfSeshop, element, '￥')
  }
}

module.exports = BookSearcher
