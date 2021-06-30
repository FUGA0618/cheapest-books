const BookSearcher = require('./BookSearcher')

class OutputFormatter {
  constructor (isbn) {
    this._searcher = new BookSearcher(isbn)
  }

  async showBookTitle () {
    const bookTitle = await this._searcher.fetchBookTitle()
    console.log(`【タイトル】${bookTitle}`)
  }

  async showBookPriceAndUrl () {
    const bookDetails = {
      Amazon: {
        price: await this._searcher.fetchAmazonPrice(),
        url: this._searcher.urlOfAmazon
      },
      DMM: {
        price: await this._searcher.fetchDmmPrice(),
        url: this._searcher.urlOfDmm
      },
      SEshop: {
        price: await this._searcher.fetchSeshopPrice(),
        url: this._searcher.urlOfSeshop
      }
    }

    const siteNames = Object.keys(bookDetails)
    for (const siteName of siteNames) {
      console.log(siteName)
      if (bookDetails[siteName].price === '-') {
        console.log('  取り扱いがありません。')
      } else {
        console.log(`  価格：${bookDetails[siteName].price}円`)
        console.log(`  URL：${bookDetails[siteName].url}`)
      }
    }
  }
}

module.exports = OutputFormatter
