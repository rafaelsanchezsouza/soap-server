import { Request, Response } from 'express';
const soapRequest = require('easy-soap-request');
import xml2js from 'xml2js';
var parser = new xml2js.Parser();
let token: string;

export default {
  async soapPost(Request: any, Response: any) {
    try {
      const login =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['login'][0];
      const senha =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['senha'][0];
      const matricula =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['matricula'][0];
      const cpf =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['cpf'][0];

      invokeOperations(login, senha, matricula, cpf).then((teste: any) => {
        console.log(teste);
        Response.json(teste);
      });
    } catch ({ message: error }) {
      Response.status(500).send({ error });
    }
  },
  async jsonPost(Request: any, Response: any) {
    try {
      const login =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['login'][0];
      const senha =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['senha'][0];
      const matricula =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['matricula'][0];
      const cpf =
        Request.body['soap:envelope']['soap:body'][0][
          'autenticacaofuncionario'
        ][0]['cpf'][0];

      const teste = invokeJsonOperations(login, senha, matricula, cpf).then(
        () => {
          Response.json(token);
        }
      );
    } catch ({ message: error }) {
      Response.status(500).send({ error });
    }
  },
};

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
    try {
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
      // parser.parseString(body, function (err: any, result: any) {
      //   token =
      //     result['soap:Envelope']['soap:Body'][0][
      //       'AutenticacaoFuncionarioResponse'
      //     ][0]['AutenticacaoFuncionarioResult'][0]['token'][0];
      // });
      return body;
    } catch ({ message: error }) {
      console.log('Não conseguiu fazer a requisição SOAP');
    }
  })();
  // https://medium.com/better-programming/how-to-perform-soap-requests-with-node-js-4a9627070eb6
};

const invokeJsonOperations = (
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
    try {
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
        token = result;
      });
      return body;
    } catch ({ message: error }) {
      console.log('Não conseguiu fazer a requisição SOAP');
    }
  })();
  // https://medium.com/better-programming/how-to-perform-soap-requests-with-node-js-4a9627070eb6
};
