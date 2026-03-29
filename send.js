import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData, fileType, timestamp } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Arquivo inválido' });
  }

  // Credenciais vêm das variáveis de ambiente do Vercel
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portal Raízes VM" <${process.env.EMAIL_FROM}>`,
      to:   process.env.EMAIL_TO,
      subject: `📋 Prestação de Contas — ${timestamp}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
          <h2 style="color:#0d2d3a;">📋 Nova Prestação de Contas</h2>
          <p>Uma nova prestação de contas foi enviada pelo Portal do Síndico.</p>
          <table style="border-collapse:collapse;width:100%;margin-top:16px;">
            <tr>
              <td style="padding:8px;background:#f5f5f5;font-weight:bold;width:40%;">Arquivo</td>
              <td style="padding:8px;">${fileName}</td>
            </tr>
            <tr>
              <td style="padding:8px;background:#f5f5f5;font-weight:bold;">Recebido em</td>
              <td style="padding:8px;">${timestamp}</td>
            </tr>
          </table>
          <p style="margin-top:16px;color:#666;font-size:13px;">
            O arquivo está anexado a este e-mail. Acesse o Make para processar o comunicado automaticamente.
          </p>
          <hr style="margin-top:24px;border:none;border-top:1px solid #eee;"/>
          <p style="color:#aaa;font-size:11px;">Portal Raízes VM · Vila Matilde · Nova IA Solutions</p>
        </div>
      `,
      attachments: [
        {
          filename   : fileName,
          content    : fileData,
          encoding   : 'base64',
          contentType: fileType || 'application/pdf',
        },
      ],
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }
}
