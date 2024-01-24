const express = require('express');
const mysql = require('mysql');
var cors = require('cors')
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'new_schema',
    
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }

});
app.get('/category', (req, res) => {
  console.log("hello")
    // Perform a SELECT query on the 'table_1' table
    connection.query('SELECT * FROM table_1', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json(results);
    });
  });

  app.get('/products', (req, res) => {
    // Perform a SELECT query on the 'table_1' table
    connection.query('SELECT * FROM items_1', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      // console.log(results,"hello");
      // res.json({results: results});
      res.send({results: results})
    });
  });


  app.get('/products/category/:name', (req, res) => {
    const categoryId = req.params.name;
    console.log(categoryId);
  
    // SQL query for products without pagination
    const productSqlQuery = 'SELECT * FROM items_1 WHERE Category = ?';
  
    // Execute the product query
    connection.query(productSqlQuery, [categoryId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL product query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (results.length === 0) {
        // No products found for the category
        res.status(404).json({ error: 'No products found for the category' });
        return;
      }
  
      console.log(results);
      res.send({ results: results });
    });
  });


//----------------------------------------//---------------------------------


// app.get('/search/:searchTerm', async (req, res) => {
//   let searchTerm = req.params.searchTerm;
//   console.log("hai");
//   const url = `http://localhost:8983/solr/newdata/select?q=BRAND_NAME:${searchTerm} or PRODUCT_NAME:${searchTerm} or Category:${searchTerm} `
//   console.log(url);Denim


//   try {
//     let response = await fetch(url); // Use the variable url instead of the string "url"
    
//     if (response.ok) {
//       let jsonResponse = await response.json();
//       jsonResponse = jsonResponse.response.docs;
//       console.log(jsonResponse);
//       res.json(jsonResponse);
//     } else {
//       console.error(`Error: ${response.status} - ${response.statusText}`);
//       res.status(response.status).send('Error fetching data from Solr');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


const BASE_URL = "http://localhost:8983/solr/newdata"



let brands;
let productnames;
let notFetched = true;

if(notFetched){
    const query = 'SELECT DISTINCT BRAND_NAME FROM items_1';
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            brands = results;
            // console.log("the brands is",brands)
            notFetched = false;
        }
        
     });
    const query1 = 'SELECT DISTINCT PRODUCT_NAME FROM items_1'; 
    connection.query(query1, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            productnames = results;
            notFetched = false;
        }
     });
    }

let pricelessThanKeywords = ["below", "less","under"]
let priceGreaterThanKeywords = ["above", "greater",]

app.get('/search', async (req, res) => {
    let query = req.query.q;
   
    let isBelow = pricelessThanKeywords.some(keyword => {
        console.log( query.toLowerCase().includes(keyword) )
        return query.toLowerCase().includes(keyword)
    });
    let isAbove = priceGreaterThanKeywords.some(keyword => query.toLowerCase().includes(keyword));

    console.log("isBelow:", isBelow); 
    console.log("isAbove:", isAbove); 

    let brandsQuery = query.split("under");
    console.log("gdhkkkkkk",brandsQuery);
    let productsQuery = query.split(" ");
    let priceQuery = query.split(" ");

    let numbersOnly = priceQuery
      .filter(value => !isNaN(value)) 
      .map(value => parseFloat(value)); 

    console.log("numbers")
    console.log(numbersOnly);    

  //   let brandValues = brandsQuery.filter(query => brands.some(brandObj => 
  //     brandObj && brandObj.brand && brandObj.brand.toLowerCase().includes((query && query.toLowerCase()))
  // ));
  // let brandValues = brands.toLowerCase().includes(query.toLocaleLowerCase())
  let brandValues = []
  console.log("the brand values array is", brandValues);
  console.log(brandsQuery);
  brandsQuery.map((word)=>{
brands.map((brand)=>{
  let b = brand.BRAND_NAME;
  let tempword = word.toLowerCase();
  let tempbrand = b.toLowerCase();
  if(tempword === tempbrand)
  {
    brandValues.push(b)

  }
})
  })
  console.log("the brand value  ----- ",brandValues)
  

        let productValues;

        productValues = productsQuery.filter(queryItem =>
            queryItem!== 'under' && 
            productnames.some(prdObj =>
               prdObj.PRODUCT_NAME.toLowerCase().includes(queryItem.toLowerCase())
            )
            );
   
    
    console.log("brands")
    console.log(brandValues);
    console.log("products")
    console.log(productValues);

    try{
        let solrUrl = `${BASE_URL}/select?`;
        //brand query
        if(brandValues.length > 0){
          console.log("the brand value  ----- ",brandValues)

            brandValues.forEach((brandValue,i) => {
                if(i>0){
                    solrUrl += `%20OR%20`;
                    solrUrl += `BRAND_NAME:*${encodeURIComponent(brandValue.slice(1))}*`;
                    
                }
                else{
                if(brandValue.length > 1)
                    solrUrl += `fq=BRAND_NAME:*${encodeURIComponent(brandValue.slice(1))}*`;
                else
                    solrUrl += `fq=BRAND_NAME:${encodeURIComponent(brandValue)}`;
                }
                console.log("the url is ",solrUrl)
            }
            )
           


        }
        if(brandValues.length > 0){
            solrUrl += `&`
        }
        //products query
        if(productValues.length > 0){
            productValues.forEach((productValue,i) => {
                if(i>0){
                    solrUrl += `%20OR%20`;
                    solrUrl += `PRODUCT_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                }else{
                if(productValue.length>1)
                    solrUrl += `fq=PRODUCT_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                else    
                solrUrl += `fq=PRODUCT_NAME:${encodeURIComponent(productValue)}`
                }
            })
        }
        //Price query
        if(isBelow){
            solrUrl += `&fq=`;
            let Qstr = `MRP:[* TO ${numbersOnly[0]}]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        if(isAbove){
            solrUrl += `&fq=`;
            let Qstr = `MRP:[${numbersOnly[0]} TO *]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        //Default query
        if(productValues.length>0 || brandValues.length>0) {
            solrUrl += `&q=*%3A*`;
        }
        solrUrl += `&indent=true&wt=json`
        console.log(solrUrl)
       
        //Data fetching
        const response = await fetch(solrUrl);
        if (response.ok) {
            let jsonResponse = await response.json();
            jsonResponse = jsonResponse.response.docs;
            console.log(jsonResponse);
            res.json(jsonResponse);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            res.status(response.status).send('Error fetching data from Solr');
        }
    }catch(err){
        console.log(err);
    }
    
});

  
// const BASE_URL = "http://localhost:8983/solr/newdata";

// let brands;
// let productnames;
// let notFetched = true;

// if (notFetched) {
//     const query = 'SELECT DISTINCT BRAND_NAME FROM items_1';
//     connection.query(query, (error, results, fields) => {
//         if (error) {
//             console.error('Error fetching data:', error);
//         } else {
//             brands = results;
//             console.log("the brands is", brands);
//             notFetched = false;
//         }
//     });

//     const query1 = 'SELECT DISTINCT PRODUCT_NAME FROM items_1';
//     connection.query(query1, (error, results, fields) => {
//         if (error) {
//             console.error('Error fetching data:', error);
//         } else {
//             productnames = results;
//             notFetched = false;
//         }
//     });
// }

// let pricelessThanKeywords = ["below", "less", "under"];
// let priceGreaterThanKeywords = ["above", "greater"];

// app.get('/search', async (req, res) => {
//     let query = req.query.q;

//     let isBelow = pricelessThanKeywords.some(keyword => query.toLowerCase().includes(keyword));
//     let isAbove = priceGreaterThanKeywords.some(keyword => query.toLowerCase().includes(keyword));

//     let brandsQuery = query.split(" ");
//     let productsQuery = query.split(" ");
//     let priceQuery = query.split(" ");

//     let numbersOnly = priceQuery
//         .filter(value => !isNaN(value))
//         .map(value => parseFloat(value));

//     console.log("numbers")
//     console.log(numbersOnly);

//     // Check if we have valid numerical values for price
//     if (numbersOnly.length > 0) {
//         let solrUrl = `${BASE_URL}/select?`;

//         let brandValues = brandsQuery.filter(query => {
//             const lowerQuery = query && query.toLowerCase();
//             const filteredBrands = brands.filter(brandObj =>
//                 brandObj && brandObj.brand && brandObj.brand.toLowerCase().includes(lowerQuery)
//             );
//             console.log(`For query "${query}", matched brands:`, filteredBrands);
//             return filteredBrands.length > 0;
//         });

//         console.log("the brand values array is", brandValues);

//         let productValues;

//         productValues = productsQuery.filter(queryItem =>
//             queryItem !== 'under' &&
//             productnames.some(prdObj =>
//                 prdObj.PRODUCT_NAME.toLowerCase().includes(queryItem.toLowerCase())
//             )
//         );


//         console.log("brands")
//         console.log(brandValues);
//         console.log("products")
//         console.log(productValues);

//         try {
//             // Brand and product queries
//             if (brandValues.length > 0) {
//                 brandValues.forEach((brandValue, i) => {
//                     if (i > 0) {
//                         solrUrl += `%20OR%20`;
//                         solrUrl += `BRAND_NAME:*${encodeURIComponent(brandValue.slice(1))}*`;

//                     } else {
//                         if (brandValue.length > 1)
//                             solrUrl += `fq=BRAND_NAME:*${encodeURIComponent(brandValue.slice(1))}*`;
//                         else
//                             solrUrl += `fq=BRAND_NAME:${encodeURIComponent(brandValue)}`;
//                     }
//                     console.log("the url is ", solrUrl)
//                 });
//             }

//             if (brandValues.length > 0) {
//                 solrUrl += `&`;
//             }

//             // Products query
//             if (productValues.length > 0) {
//                 productValues.forEach((productValue, i) => {
//                     if (i > 0) {
//                         solrUrl += `%20OR%20`;
//                         solrUrl += `PRODUCT_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
//                     } else {
//                         if (productValue.length > 1)
//                             solrUrl += `fq=PRODUCT_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
//                         else
//                             solrUrl += `fq=PRODUCT_NAME:${encodeURIComponent(productValue)}`
//                     }
//                 });
//             }

//             // Price query
//             if (isBelow) {
//                 solrUrl += `&fq=`;
//                 let Qstr = `discounted_price:[* TO ${numbersOnly[0]}]`;
//                 Qstr = (encodeURIComponent(Qstr));
//                 solrUrl += Qstr;
//             }
//             if (isAbove) {
//                 solrUrl += `&fq=`;
//                 let Qstr = `discounted_price:[${numbersOnly[0]} TO *]`;
//                 Qstr = (encodeURIComponent(Qstr));
//                 solrUrl += Qstr;
//             }

//             // Default query
//             if (productValues.length > 0 || brandValues.length > 0) {
//                 solrUrl += `&q=*%3A*`;
//             }
//             solrUrl += `&indent=true&wt=json`
//             console.log(solrUrl);

//             // Data fetching
//             try {
//                 const response = await fetch(solrUrl);
//                 if (response.ok) {
//                     let jsonResponse = await response.json();
//                     jsonResponse = jsonResponse.response.docs;
//                     console.log(jsonResponse);
//                     res.json(jsonResponse);
//                 } else {
//                     console.error(`Error: ${response.status} - ${response.statusText}`);
//                     res.status(response.status).send('Error fetching data from Solr');
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//   }
      
// else {
//             // Handle case when there are no valid numerical values for price
//             console.log("Invalid or no numerical values for price");
//             res.status(400).send('Invalid or no numerical values for price');
//         }
      
//     });
  



 
app.listen(5001,()=>{
    console.log("Listening to port:4001");
});