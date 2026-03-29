import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData, fileType, timestamp } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Arquivo inválido' });
  }

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
          <p>Uma nova prestação foi enviada pelo Portal do Síndico.</p>
          <p><strong>Arquivo:</strong> ${fileName}</p>
          <p><strong>Recebido em:</strong> ${timestamp}</p>
          <hr/>
          <p style="color:#aaa;font-size:11px;">Portal Raízes VM · Nova IA Solutions</p>
        </div>
      `,
      attachments: [{
        filename   : fileName,
        content    : fileData,
        encoding   : 'base64',
        contentType: fileType || 'application/pdf',
      }],
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }
}
