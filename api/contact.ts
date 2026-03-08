import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // ou especifique o seu domínio principal
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Faltando campos obrigatórios' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // O e-mail de envio no plano grátis precisa ser o de onboarding do Resend ou um domínio que vc validou
            to: 'davisantossousa2@gmail.com', // O e-mail que vai receber. Na versão grátis vc só pode enviar pro mesmo e-mail do seu cadastro
            subject: `[Portfólio] Novo contato de ${name}: ${subject}`,
            html: `
        <h2>Nova mensagem de contato do Portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
