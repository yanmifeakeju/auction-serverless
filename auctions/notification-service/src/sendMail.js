import {
  SESClient,
  CloneReceiptRuleSetCommand,
  SendEmailCommand,
} from '@aws-sdk/client-ses';

const client = new SESClient({ region: 'us-east-1' });

const createSendEmailCommand = (
  { toAddress, subject, body },
  fromAddress = 'yanmife.dev@gmail.com'
) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<h3>${body}</h3>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

export async function handler(event, _context) {
  const record = event.Records[0];
  console.log(record);
  try {
    const emailDetails = JSON.parse(record.body);
    const { subject, body, recipient } = emailDetails;

    const command = createSendEmailCommand({
      body,
      subject,
      toAddress: recipient,
    });

    const result = await client.send(command);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
