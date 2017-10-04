var SERVER_NAME = 'Products_Api';
var PORT = 3000;
var HOST = '127.0.0.1';

//Request counters
var getCounter = 0;
var postCounter = 0;

var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')
  
    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME})

    server.listen(PORT, HOST, function () {
        console.log('Server %s listening at %s', server.name, server.url)
        console.log('Endpoints:')
        console.log(server.url + '/products')
        console.log(server.url + '/products/:id')  
      })

      server
      // Allow the use of POST
      .use(restify.fullResponse())
    
      // Maps req.body to req.params so there is no switching between them
      .use(restify.bodyParser())
    
    // Get all products in the system
    server.get('/products', function (req, res, next) {
      console.log('--->' + server.url + '/products: recieved GET request')
    
      // Find every entity within the given collection
      productsSave.find({}, function (error, products) {
    
        // Return all of the products in the system
        console.log('<---' + server.url + '/products: sending response')
        res.send(products)
        getCounter++;
        console.log('Processed request count --> sendGet: ' +getCounter + ', sendPost: ' + postCounter)
      })
    })

    // Get a single product by their products id
server.get('/products/:id', function (req, res, next) {
  console.log('--->' + server.url + '/products:id: recieved GET request')
    
      // Find a single product by their id within save
      productsSave.findOne({ _id: req.params.id }, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        if (product) {
          // Send the product if no issues
          console.log('<---' + server.url + '/products:id: sending response')
          res.send(product)
          getCounter++;
          console.log('Processed request count --> sendGet: ' +getCounter + ', sendPost: ' + postCounter)
        } else {
          // Send 404 header if the product doesn't exist
          res.send(404)
        }
      })
    })

    // Create a new product
server.post('/products', function (req, res, next) {
  console.log('-->' + server.url + '/products: recieved POST request')
      // Make sure name is defined
      if (req.params.name === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('Specify Name'))
      }
      if (req.params.price === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('Specify Price'))
      }
      if (req.params.amount === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('Specify Amount'))
      }
      var newProduct = {
            name: req.params.name, 
            price: req.params.price,
            amount: req.params.amount
        }

          // Create the product using the persistence engine
          productsSave.create(newProduct, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send the product if no issues
        console.log('<---' + server.url + '/products: sending response')
        res.send(201, product)
        postCounter++;
        console.log('Processed request count --> sendGet: ' + getCounter + ', sendPost: ' + postCounter)
      })
    })

    // Delete product with the given id
server.del('/products/:id', function (req, res, next) {
  console.log('--->' + server.url + '/products:id: recieved DELETE request')
      // Delete the product with the persistence engine
      productsSave.delete(req.params.id, function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send a 200 OK response
        console.log('<---' + server.url + '/products:id: sending response')
        res.send()
      })
    })

        // Delete all products
server.del('/products', function (req, res, next) {
  console.log('--->' + server.url + '/products: recieved DELETE request')
      // Delete the product with the persistence engine
      productsSave.deleteMany({},function (error, product) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send a 200 OK response
        console.log('<---' + server.url + '/products: sending response')
        res.send(204)
      })
    })