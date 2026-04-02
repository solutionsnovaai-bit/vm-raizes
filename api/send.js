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
      subject: `📋 Portal Raízes Vila Matilde — ${timestamp}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;">
          <div style="background:#0D2D3A;padding:24px;text-align:center;">
            <span style="color:#fff;font-size:22px;font-weight:900;">RAÍZES</span>
            <span style="color:#3AB5A0;font-size:22px;font-weight:300;"> | </span>
            <span style="color:#3AB5A0;font-size:22px;font-weight:900;">VM</span>
            <p style="color:#7AADAD;font-size:11px;letter-spacing:3px;margin:4px 0 0;">VILA MATILDE · STUDIOS</p>
          </div>
          <div style="padding:24px;background:#f8fafa;border:1px solid #e0e8e8;">
            <p style="color:#0D2D3A;font-size:15px;margin:0 0 12px;">Nova prestação de contas recebida pelo portal.</p>
            <p style="color:#444;font-size:13px;margin:0 0 6px;"><strong>Arquivo:</strong> ${fileName}</p>
            <p style="color:#444;font-size:13px;margin:0;"><strong>Recebido em:</strong> ${timestamp}</p>
          </div>
          <div style="background:#0D2D3A;padding:12px;text-align:center;">
            <p style="color:#4A7A7A;font-size:10px;margin:0;">Portal do Síndico · Nova IA Solutions</p>
          </div>
        </div>
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
