const asyncHandler = require("express-async-handler");

const dataScrape = require("../models/scrapeDataModel");
const cheerio = require("cheerio");
const axios = require("axios");
const TestUrl = "https://jmish.com/browse/";

// @desc Get goals
// @route GET /api/goals
// @access Private
const getData = asyncHandler(async (req, res) => {
  
  const SrapeData = async () => {
    const urls = await getUrls();
    for (const url of urls) {
      await fetchFromLink(url);
    }
  };

  const getUrls = async () => {
    const { data: html } = await axios(TestUrl);
    let urls = [];
    const $ = cheerio.load(html);

    $("#main")
      .find(".products")
      .find(".product-category")
      .each(async (_, elem) => {
        const link = $(elem).find("a").attr("href");
        urls.push(link);
      });

    return urls;
  };

  const fetchFromLink = async (link) => {
    const {data: html} = await axios(link);
    const $ = cheerio.load(html);

    let DataArray = [];

    $('#prod-decription').each(async (_, elem) => {
       
        const productlinename = $(elem).find("h1").text();
        const overview = $(elem).find("p").text();
        DataArray.push({
            ProductLineName: productlinename,
            Overview: overview
        })
    })

    $('.products').find('.type-product').each(async (_, elem) => {
        const color = $(elem).find(".woocommerce-loop-product__title").text();
        const image = $(elem).find(".woocommerce-loop-product__link").find("img").attr("src");
        DataArray.push({
            ProductImage: image,
            ColorName: color
        })
    })

    $('#maintenance-tab').each(async(_, elem)=>{
        const sku = $(elem).find("table").eq(0).find("tr").eq(0).find("td").eq(1).text();
        const pattern = $(elem).find("table").eq(0).find("tr").eq(2).find("td").eq(1).text();
        const fiberType = $(elem).find("table").eq(1).find("tr").eq(0).find("td").eq(1).text();
        const faceWeight = $(elem).find("table").eq(1).find("tr").eq(1).find("td").eq(1).text();
        const widthFeet = $(elem).find("table").eq(1).find("tr").eq(2).find("td").eq(1).text();
        DataArray.push({
            SKUs: sku,
            Pattern: pattern,
            WidthByFeet: widthFeet,
            FiberType: fiberType,
            FaceWeight: faceWeight,
        })
    })
    const ArrayData = JSON.stringify(DataArray);
    console.log(ArrayData);
}

});

module.exports = {
  getData,
};
