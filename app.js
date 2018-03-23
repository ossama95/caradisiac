const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const express = require('express');
const bodyParser = require('body-parser');
const client = require('./connection');
const app = express();

var interval =  3500;
var brand = [];


/*
[ { brand: 'BOOXT',
    image: 'https://static.caradisiac.com/img_site/categories/fich_tech_voituret
te_arrow.png',
    model: 'Booxt Dynotruck',
    volume: '',
    uuid: '481fd85a-a5f4-553b-95b5-974f4445c24b',
    name: 'ELECTRIQUE 4KW' } ]
*/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});



app.get('/suv',function(req,res)
{
  client.search({
  index: 'caradisiac',
  type: 'models',
  body: {
    
      "size":50,

      "sort": [
        {
          "volume.keyword": {
            "order": "desc"
          }
        }
      ]

  }
}).then(function (resp) {
    var hits = resp.hits.hits;
    res.json(resp.hits.hits);
}, function (err) {
    console.trace(err.message);
});




});
app.get('/populate',function(req,resu)
{
  getBrand().then(function(result)
  {
    client.indices.create({
    index: 'caradisiac'
    },function(err,resp,status) {
    if(err) {
    }

    else {
      console.log("create",resp);

    }
    });

    for (var i = 0; i <=result.length; i++) {
        setTimeout( function (i) {
              details = getModel(result[i]);
              details.then(function(res)
            {
              if(res.length != 0)
              {
                var id = res[0].uuid;
                delete res[0].uuid;
                var body = res[0];
                client.index({
                      index: 'caradisiac',
                      id: id,
                      type: 'models',
                      body:body
                    },function(err,resp,status) {
                        console.log(resp);
                    });
              }

            });
        }, i * 500, i);


  }
  resu.send("Ok !");
  });


});

app.get('/brand',function(req,res)
{
  getBrand(res);
  console.log(brand);
  console.log(req.query);
});

app.get('/models',function(req,res)
{
if(req.query.brand == null)
 { res.status(500).send('Brand unknown '); }
else {
  console.log(req.query.brand);
  getModel(req.query.brand.toUpperCase(),res)
}
});



async function getBrand(res){
  const brands = await getBrands();
  if(res != null) res.json(brands);

  return brands;
  console.log(brands);
}

async function getModel(string,res){

  const models = await getModels(string);
  if(res != null)  res.json(models);
  return models;

}
