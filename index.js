const serverless  = require('serverless-http');
const express     = require('express');
const AWS = require('aws-sdk');
const bodyParser  = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ses = new AWS.SES({
  region: 'us-east-1' // Set the region in which SES is configured
});

/**
 * Create a new SES Template based on the request data
 */
app.post('/template', (req, res) => {
  const { templateName, subject, body } = req.body

  var params = {
    Template: { 
      TemplateName: templateName, 
      HtmlPart: body,
      SubjectPart: subject,
      TextPart: "Seja Bem Vindo"
    }
  }

  ses.createTemplate(params, (err, data) => {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }    
  })
})

/**
 * Send Email via AWS SES using the request Template and data
 */
app.post('/send-email', (req, res) => {
  const { templateName, sendTo, data } = req.body;

  const params = {
    Template: templateName,
    Destination: { 
      ToAddresses: [
        sendTo
      ]
    },
    Source: 'cauehsr@gmail.com', // use the SES domain or email verified in your account
    TemplateData: JSON.stringify(data || {})
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }
  });

});

app.get('/index', async function (req, res) {
  return res.send('Hello Wopooooorld!')
})

module.exports.handler = serverless(app);
