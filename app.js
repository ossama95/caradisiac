const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var fs = require('fs');


async function getBrand(){
  const brands = await getBrands();
  return brands;
  console.log(brands);
}

// var allcaradisiac ={};
async function getModel(string){
  const models = await getModels(string);
//  console.log(models);
  return models;
  // allcaradisiac.push(models);
  // var json = JSON.stringify(allcaradisiac);
  // fs.writeFile('caradisiac.json', json, 'utf8');
}

let brands = getBrand();
// console.log(brands);

brands.then(function(result){
  // console.log(result);
  for (var i = 0; i < result.length; i++) {
    details = getModel(result[i]);
    details.then(function(res)
  {
    console.log(res);
  })
  }
});
