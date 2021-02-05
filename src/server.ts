import express from 'express';

import xmlParser from 'express-xml-bodyparser';
import serverController from './serverController';

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(xmlParser());

app.get('/', (req, res) => {
  res.send('<h1>Webservices da SP Consig</h1>');
});

app.post('/macae-soap', serverController.soapPost);
app.post('/macae-json', serverController.jsonPost);

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
