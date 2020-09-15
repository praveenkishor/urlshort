const mongoose = require('mongoose');
const validUrl = require('valid-url');
const UrlShorten = mongoose.model('UrlShorten');
const constants = require('../config/constants');
const expressip = require('express-ip');

module.exports = app => {
  app.get('/api/item/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      res.redirect(item.originalUrl);
    } else {
      res.redirect(constants.errorUrl);
    }
  });

  app.get('/api/items', async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.find({}, (err, users) => users);
    if (item) {
      res.json(item);
    } else {
      res.redirect(constants.errorUrl);
    }
  });

  app.get('/api/region', async (req, res) => {
    const ipInfo = req.ipInfo;
    res.json(ipInfo);
  });

  app.post('/api/item', async (req, res) => {
    const { shortBaseUrl, originalUrl } = req.body;
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      res.status(404).json('Invalid Base Url format');
    }

    const updatedAt = new Date();
    const queryOptions = { originalUrl };
    if (validUrl.isUri(originalUrl)) {
      var urlData = {};
      try {
        urlData = await UrlShorten.findOne(queryOptions).exec();

        if (urlData) {
          res.status(200).json(urlData);
        } else {
          const urlCode = makeid(5);

          shortUrl = shortBaseUrl + '/' + urlCode;
          present = 1;
          const itemToBeSaved = { originalUrl, shortUrl, urlCode, updatedAt,present };

          // Add the item to db
          const item = new UrlShorten(itemToBeSaved);
          await item.save();
          res.status(200).json(itemToBeSaved);
        }
      } catch (err) {
        res.status(401).json('Invalid User Id');
      }
    } else {
      res.status(401).json('Invalid Original Url.');
    }
  });

  app.post('/api/updateitem', async (req, res) => {
    const { originalUrl } = req.body;
   

    const queryOptions = { originalUrl };
    if (validUrl.isUri(originalUrl)) {
       var urlData;
      try {
        urlData = await UrlShorten.findOne(queryOptions).exec();
        const ipInfo = req.ipInfo;

        //testing data
        // var newip = '127.0.0.1';
        // var country = 'pakistan';

        //below two variable is dynamic variable it will not run on localhost
        // var newip = ipInfo.ip;
        // var country = ipInfo.country;

        //below two variable is static that rendomly taken from an array
        const {newip,country} = randomregion();//this will work on localhost


        var newurlData = urlData;
        //to update country
        if(urlData.region){
        var countries = urlData.region;
        if(country in countries){
          countries[country] +=1;
        }else{
          countries[country] =1;
        }
        newurlData.region = countries;
        }else{
          var countrydata = {};
          countrydata[country] = 1;
          newurlData.region = countrydata;
        }

        var mostclickedregion = shortdata(newurlData.region);

        //to update ipaddress
        if(urlData.ipAddress){
        var ips = urlData.ipAddress;
        if(newip in ips){
          ips[newip] +=1;
        }else{
          ips[newip] =1;
        }
        newurlData.ipAddress = ips;
        }else{
          var ipdata = {};
          ipdata[newip] = 1;
          newurlData.ipAddress = ipdata;
        }

        //to update ipaddress
        if(urlData.clickstotal){
        var counter = urlData.clickstotal;
        counter +=1;
        newurlData.clickstotal = counter;
        }else{
          newurlData.clickstotal = parseInt(1);
        }

        
        const item = new UrlShorten(urlData);
        await item.updateOne(urlData);

        urlData.mostclickedregion = mostclickedregion;


        if (urlData) {
          res.status(200).json(urlData);
          
        }
      } catch (err) {
        res.status(401).json('Unknown url');
      }
    } else {
      res.status(401).json('Invalid Original Url.');
    }
  });
};

function makeid(length) {
   var result           = '';
   var characters       = '0123456789abcdefghijklmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function shortdata(obj){
var sortable = [];
for (var key in obj) {
    sortable.push([key, obj[key]]);
}

sortable.sort(function(a, b) {
    return b[1] - a[1];
});

var temp = []
for(let i=0;i<3;i++){
temp.push(sortable[i])
}

var returnstr = "";
temp.forEach(function(item) {
  if(item){
  Object.keys(item).forEach(function(key) {
    returnstr += " "+item[key];
  });
 }
});


return returnstr;
}

function randomregion(){
const countries = ["india","aus","uk","us","zim","pak","kiwi","bangladesh","keny"];
const random1 = Math.floor(Math.random() * countries.length);

const ips = ["127.0.0.1","127.0.0.2","127.0.0.3","127.0.0.4","127.0.0.5","127.0.0.6","127.0.0.7","127.0.0.8","127.0.0.9"];
const random2 = Math.floor(Math.random() * ips.length);

return {'country':countries[random1],'newip':ips[random2]};
}



