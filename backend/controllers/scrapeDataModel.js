const asyncHandler = require("express-async-handler");

const dataScrape = require("../models/scrapeDataModel");
const cheerio = require("cheerio");
const axios = require("axios");
const TestUrl = "https://jmish.com/browse/";

// @desc Get 
// @route GET
// @access Private
const getData = asyncHandler(async (req, res) => {

  const scraped_products  = []


  const MainFunction = async (callback) => {
      const urls = await getUrls();
  
      console.log(`start scraper`)
      for (const url of urls) {
          await fetchFromLink(url)
      }
      console.log('end scraper')
      res.status(200).json(scraped_products);
      // callback(scraped_products)
  }
  
  const getUrls = async () => {
      const {data: html} = await axios(TestUrl);
      let urls = []
      const $ = cheerio.load(html);
  
  
          // console.log($('div#prod-decription').find("h1").text());
      $('#main').find('.products').find('.product-category').each(async (_, elem) => {
          // console.log($(elem).find(".woocommerce-loop-category__title").text());
          // link = scrape yung link
         
          const link = $(elem).find("a").attr("href");
          urls.push(link)
          // save data in CSV here
      })
  
  
      return urls
  }
  
  
  const fetchFromLink = async (link) => {
      const {data: html} = await axios(link);
      const $ = cheerio.load(html);
  
      let DataArray = [];
      var tmpData = {
  
      }
      
      $('#prod-decription').each(async (_, elem) => {
         
          const productlinename = $(elem).find("h1").text();
          const overview = $(elem).find("p").text();
          tmpData['Manufacturer'] = 'J Mish Mills';
          tmpData['Supplier'] = 'J Mish Mills';
          tmpData['Brand'] = 'J Mish Mills';
          tmpData['ProductLineName'] = productlinename
          tmpData['Overview'] = overview
          // DataArray.push({
          //     ProductLineName: productlinename,
          //     Overview: overview
          // })
  
      })
  
  
      $('#maintenance-tab').each(async(_, elem)=>{
          const sku = $(elem).find("table").eq(0).find("tr").eq(0).find("td").eq(1).text();
          const pattern = $(elem).find("table").eq(0).find("tr").eq(2).find("td").eq(1).text();
          const fiberType = $(elem).find("table").eq(1).find("tr").eq(0).find("td").eq(1).text();
          const faceWeight = $(elem).find("table").eq(1).find("tr").eq(1).find("td").eq(1).text();
          const widthFeet = $(elem).find("table").eq(1).find("tr").eq(2).find("td").eq(1).text();
          
          tmpData['SKUs'] = sku
          tmpData['Pattern'] = pattern
          tmpData['WidthByFeet'] = widthFeet
          tmpData['FiberType'] = fiberType
          tmpData['FaceWeight'] = faceWeight
      })
      
      $('.products').find('.type-product').each(async (_, elem) => {
          var color = $(elem).find(".woocommerce-loop-product__title").text();
          var image = $(elem).find(".woocommerce-loop-product__link").find("img").attr("src");
          tmpData['ProductImage'] = image
          tmpData['ColorName'] = color
  
          scraped_products.push(tmpData);
      })
  }

  MainFunction((resdata)=>{
  });
});

module.exports = {
  getData,
};
