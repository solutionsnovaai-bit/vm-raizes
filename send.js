const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData, fileType, timestamp } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Arquivo inválido' });
  }

  const { EMAIL_FROM, EMAIL_PASS, EMAIL_TO } = process.env;

  if (!EMAIL_FROM || !EMAIL_PASS || !EMAIL_TO) {
    console.error('Variáveis de ambiente não configuradas');
    return res.status(500).json({ error: 'Configuração de email ausente' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portal Raízes VM" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `📋 Prestação de Contas — ${timestamp}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#0f1c13;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1c13;padding:32px 16px;">
            <tr><td align="center">
              <table width="100%" style="max-width:520px;border-collapse:collapse;">

                <!-- Header -->
                <tr>
                  <td style="background:#142018;padding:32px 36px;border-radius:3px 16px 0 0;border:1px solid rgba(200,169,110,.18);border-bottom:none;text-align:center;">
                    <div style="font-family:'Georgia',serif;font-size:28px;font-weight:400;letter-spacing:3px;color:#c8a96e;margin-bottom:6px;">
                      RAÍZES
                    </div>
                    <div style="font-size:9px;font-family:Arial,sans-serif;letter-spacing:6px;text-transform:uppercase;color:rgba(200,169,110,.4);margin-bottom:0;">
                      VILA MATILDE · STUDIOS
                    </div>
                    <div style="width:48px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,.35),transparent);margin:16px auto 0;"></div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="background:#1a2d1e;padding:28px 36px;border:1px solid rgba(200,169,110,.18);border-top:none;border-bottom:none;">
                    <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:300;color:rgba(168,196,184,.8);line-height:1.7;margin:0 0 16px;">
                      Nova prestação de contas recebida pelo <strong style="color:#c8a96e;font-weight:400;">Portal do Síndico</strong>.
                    </p>

                    <table width="100%" style="background:rgba(200,169,110,.05);border:1px solid rgba(200,169,110,.12);border-radius:2px 10px 2px 2px;padding:0;margin:0 0 16px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <div style="font-size:9px;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:rgba(200,169,110,.4);margin-bottom:8px;">Detalhes do envio</div>
                          <div style="font-size:13px;font-family:Arial,sans-serif;color:rgba(168,196,184,.75);font-weight:300;margin-bottom:5px;">
                            <span style="color:rgba(200,169,110,.6);">Arquivo:</span> &nbsp;${fileName}
                          </div>
                          <div style="font-size:13px;font-family:Arial,sans-serif;color:rgba(168,196,184,.75);font-weight:300;">
                            <span style="color:rgba(200,169,110,.6);">Recebido em:</span> &nbsp;${timestamp}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:300;color:rgba(138,170,152,.5);line-height:1.6;margin:0;">
                      O arquivo está anexado a este e-mail. Verifique e processe conforme necessário.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#142018;padding:16px 36px;border-radius:0 0 3px 3px;border:1px solid rgba(200,169,110,.18);border-top:1px solid rgba(200,169,110,.08);text-align:center;">
                    <p style="font-family:Arial,sans-serif;font-size:9px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:rgba(138,170,152,.3);margin:0;">
                      Portal do Síndico · Nova IA Solutions
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: fileName,
          content: fileData,
          encoding: 'base64',
          contentType: fileType || 'application/pdf',
        },
      ],
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }
};
