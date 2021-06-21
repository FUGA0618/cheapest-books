#!/usr/bin/env node

const { NumberPrompt } = require('enquirer')
const Formatter = require('./src/OutputFormatter')

class Main {
  static async getIsbn () {
    const prompt = new NumberPrompt({
      name: 'isbn',
      message: 'Please enter a ISBN'
    })
    const isbn = await prompt.run()

    if (typeof Number.isInteger(isbn) && isbn.toString().length === 13) {
      return isbn
    } else {
      try {
        throw new Error('ISBNが正しくありません。')
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  static run (isbn) {
    const formatter = new Formatter(isbn)
    formatter.showBookTitle()
    formatter.showBookPriceAndUrl()
  }
}

(async () => {
  const isbn = await Main.getIsbn()
  Main.run(isbn)
})()
