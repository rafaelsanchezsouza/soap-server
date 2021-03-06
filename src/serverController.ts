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

      autenticacaoFuncionarioXml(login, senha, matricula, cpf).then(
        (teste: any) => {
          console.log(teste);
          Response.json(teste);
        }
      );
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

      const teste = autenticacaoFuncionarioJson(
        login,
        senha,
        matricula,
        cpf
      ).then(() => {
        Response.json(token);
      });
    } catch ({ message: error }) {
      Response.status(500).send({ error });
    }
  },
  async appPost(Request: any, Response: any) {
    // console.log('VAI CONSULTAR MATRICULA');
    console.log(Request.body['soap:envelope']['soap:body'][0]);
    const login =
      Request.body['soap:envelope']['soap:body'][0][
        'aberturafuncionarioapp'
      ][0]['login'][0];
    const senha =
      Request.body['soap:envelope']['soap:body'][0][
        'aberturafuncionarioapp'
      ][0]['senha'][0];
    const chave =
      Request.body['soap:envelope']['soap:body'][0][
        'aberturafuncionarioapp'
      ][0]['chave'][0];
    const codservico = '';
    const convenio = '';

    const teste = AberturaFuncionarioApp(login, senha, chave).then((teste) => {
      // console.log(teste);
      Response.json(teste);
    });
  },
};

const autenticacaoFuncionarioXml = (
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

const autenticacaoFuncionarioJson = (
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

const AberturaFuncionarioApp = (
  login: string,
  senha: string,
  chave: string
) => {
  // console.log('ENTROU EM CONSULTAR MATRICULA 2');
  // example data
  const url =
    'https://www.consigsimples.com.br/wsautenticacaofuncionario/Servicos.asmx?op=AberturaFuncionarioApp';
  const sampleHeaders = {
    'user-agent': 'sampleTest',
    'Content-Type': 'text/xml;charset=UTF-8',
    soapAction: '/AberturaFuncionarioApp',
  };

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <AberturaFuncionarioApp>
      <login>${login}</login>
      <senha>${senha}</senha>
      <chave>${chave}</chave>
      </AberturaFuncionarioApp>
    </soap:Body>
  </soap:Envelope>`;

  // usage of module
  return (async () => {
    // console.log('BEGIN SOAP REQUEST');
    // console.log(url);
    // console.log(sampleHeaders);
    const { response } = await soapRequest({
      url: url,
      headers: sampleHeaders,
      xml: xml,
      timeout: 5000,
    });

    const matricula = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <AberturaFuncionarioAppResponse>
          <AberturaFuncionarioAppResult>
            <matriculas>
            <a>123456</a>
            <b>234567</b>
            <c>345678</c>
            </matriculas>
          </AberturaFuncionarioAppResult>
        </AberturaFuncionarioAppResponse>
      </soap:Body>
    </soap:Envelope>`;

    // console.log('END SOAP REQUEST');
    const { headers, body, statusCode } = response;
    console.log(headers);
    console.log(body);
    console.log(statusCode);
    parser.parseString(matricula, function (err: any, result: any) {
      token =
        result['soap:Envelope']['soap:Body'][0][
          'AberturaFuncionarioAppResponse'
        ][0]['AberturaFuncionarioAppResult'][0];
    });

    return token;
  })();
  // https://medium.com/better-programming/how-to-perform-soap-requests-with-node-js-4a9627070eb6
};
