//use 'esversion:6'
const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')
const cheerio = require('cheerio')
const request = require('request')
const monitor1 = false

const bestBuyTest =
  'https://www.bestbuy.ca/en-ca/product/spider-man-miles-morales-ultimate-launch-edition-ps5/14962274'
const bestBuyPs5 =
  'https://www.bestbuy.ca/en-ca/product/apple-ipad-pro-12-9-128gb-with-wi-fi-5th-generation-space-grey/15446268'
monitor()
function monitor() {
  let runTime = new CronJob(
    '*/1 * * * *',
    function () {
      request(bestBuyTest, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html)
          const button = $(
            'button.button_2m0Gt.primary_RXOwf.addToCartButton_1op0t.addToCartButton.regular_23pTm',
          )
          if (button.attr('disabled')) {
          } else {
            console.log('in stock')
            sendNotification()
          }
        }
      })
    },
    null,
    true,
    null,
    null,
    true,
  )
  runTime.start()
}

async function sendNotification() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'obazuaye55@gmail.com',
      pass: '',
    },
  })
  let textTosend = 'TIME TO GET THAT PS5!'
  let htmltext = `<a href="${bestBuyPs5}">Click Link</a>`

  let info = await transporter.sendMail({
    from: '"PS5 UPDATE" <info@netibatech.com>',
    to: 'obazuaye55@gmail.com',
    subject: 'PS5 HAS LANDED!',
    text: textTosend,
    html: htmltext,
  })
}
