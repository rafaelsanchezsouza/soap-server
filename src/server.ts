import express from 'express';
import soap from 'soap';
import xmlParser from 'express-xml-bodyparser';
import xml2js from 'xml2js';

const soapRequest = require('easy-soap-request');
var parser = new xml2js.Parser();
let token: string;

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(xmlParser());

app.get('/', (req, res) => {
  res.send('<h1>Webservices da SP Consig</h1>');
});

app.post('/webservice', (req: any, res: any, body: any) => {
  const login =
    req.body['soap:envelope']['soap:body'][0]['autenticacaofuncionario'][0][
      'login'
    ][0];
  const senha =
    req.body['soap:envelope']['soap:body'][0]['autenticacaofuncionario'][0][
      'senha'
    ][0];
  const matricula =
    req.body['soap:envelope']['soap:body'][0]['autenticacaofuncionario'][0][
      'matricula'
    ][0];
  const cpf =
    req.body['soap:envelope']['soap:body'][0]['autenticacaofuncionario'][0][
      'cpf'
    ][0];

  const teste = invokeOperations(login, senha, matricula, cpf).then((teste) => {
    console.log(teste);
    res.json(teste);
  });
});

app.listen(PORT, () => console.log(`hosting @${PORT}`));

const invokeOperations = (
  login: string,
  senha: string,
  matricula: string,
  cpf: string
) => {
  // example data
  const url =
    'https://www.consigsimples.com.br/wsautenticacaofuncionario/Servicos.asmx?op=AutenticacaoFuncionario';
  const sampleHeaders = {
    'user-agent': 'sampleTest',
    'Content-Type': 'text/xml;charset=UTF-8',
    soapAction: '/AutenticacaoFuncionario',
  };

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <AutenticacaoFuncionario>
      <login>${login}</login>
      <senha>${senha}</senha>
      <matricula>${matricula}</matricula>
      <cpf>${cpf}</cpf>
      </AutenticacaoFuncionario>
    </soap:Body>
  </soap:Envelope>`;

  // usage of module
  return (async () => {
    const { response } = await soapRequest({
      url: url,
      headers: sampleHeaders,
      xml: xml,
      timeout: 5000,
    }); // Optional timeout parameter(milliseconds)
    const { headers, body, statusCode } = response;
    // console.log(headers);
    // console.log(body);
    // console.log(statusCode);
    parser.parseString(body, function (err: any, result: any) {
      token =
        result['soap:Envelope']['soap:Body'][0][
          'AutenticacaoFuncionarioResponse'
        ][0]['AutenticacaoFuncionarioResult'][0]['token'][0];
    });
    return body;
  })();
  // https://medium.com/better-programming/how-to-perform-soap-requests-with-node-js-4a9627070eb6
};
