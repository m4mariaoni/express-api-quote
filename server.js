const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));


  app.get('/api/quotes/random', (req, res, next) => {
    // Generate a random quote
    const randomQuote = getRandomElement(quotes);
    // Send the random quote as JSON response
    if(randomQuote){
        console.log(`i am here ${randomQuote}`);
        res.send({quote: randomQuote});
    }else{
        res.status(404).send();
    }
    
  });

   app.get('/api/quotes', (req, res, next) => {
    const { person } = req.query; 

    if(person){
        const quoteByPerson = quotes.filter(quote => quote.person === person);
        console.log({quotes: quoteByPerson});
        res.send({quotes: quoteByPerson});
    }else{
        res.send({quotes: quotes});
    } 
  });  


app.post('/api/quotes', (req, res, next) => {
    const {person, quote } = req.query;

    if (!quote || !person) {
        return res.status(400).json({ message: 'Missing required properties: quote and person' });
      }

    const newQuote = {quote, person};
    if(newQuote){
        quotes.push(newQuote);
        res.status(201).send(newQuote);
    }else{
        res.status(404).send();
    }

});
 




  app.put('/api/quotes/:id', (req, res, next) => {
      const {id} = req.params;
      const {person, quote } = req.body;
  
      if (!person || !quote) {
        return res.status(400).json({ error: 'Person and quote are required fields' });
    }
  
      const index = quotes.findIndex(quote => quote.id === parseInt(id));
      
      if(index === -1){
          return res.status(404).json({ error: 'Quote not found' });
      }
    
      quotes[index].quote = quote;
          quotes[index].person = person;
          res.send(quotes[index]);
  });
  

  app.delete('/api/quotes/:id', (req, res, next) => {

    const {id} = req.params;

    const index = quotes.findIndex(quote => quote.id === parseInt(id));

    if(index === -1){
        return res.status(404).json({ error: 'Quote not found' });
    }

    quotes.splice(index,1);
    res.status(204).send();

  });

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  