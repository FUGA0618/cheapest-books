const BookSearcher = require('./BookSearcher')

class OutputFormatter {
  constructor (isbn) {
    this._searcher = new BookSearcher(isbn)
  }

  async showBookTitle () {
    const bookTitle = await this._searcher.returnBookTitle()
    console.log(`【タイトル】${bookTitle}`)
  }

  async showBookPriceAndUrl () {
    const bookDetails = {
      Amazon: {
        price: await this._searcher.returnAmazonPrice(),
        url: this._searcher.urlOfAmazon
      },
      DMM: {
        price: await this._searcher.returnDmmPrice(),
        url: this._searcher.urlOfDmm
      },
      SEshop: {
        price: await this._searcher.returnSeshopPrice(),
        url: this._searcher.urlOfSeshop
      }
    }

    const siteNames = Object.keys(bookDetails)
    for (const siteName of siteNames) {
      console.log(siteName)
      console.log(`  価格：${bookDetails[siteName].price}円`)
      console.log(`  URL：${bookDetails[siteName].url}`)
    }
  }
}

module.exports = OutputFormatter
