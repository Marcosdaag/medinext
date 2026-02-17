import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        // Configuramos el "cartero" con los datos de Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Función genérica para enviar cualquier correo
    async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Medical App" <${process.env.SMTP_USER}>`, // Remitente
                to,                                                   // Destinatario
                subject,                                              // Asunto
                html,                                                 // Cuerpo del mail en HTML
            });
            console.log('Correo enviado con éxito: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('Error al enviar correo: ', error);
            throw new Error('No se pudo enviar el correo electrónico');
        }
    }

    // --- Función específica para el reseteo de clave ---
    async sendPasswordResetEmail(to: string, token: string) {
        // En el futuro esta URL apuntará a tu frontend en React/Angular
        const resetLink = `http://localhost:4200/reset-password?token=${token}`;

        const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Recuperación de contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Medinext.</p>
        <p>Hacé clic en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Restablecer Contraseña
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">
          Si no solicitaste esto, podés ignorar este correo. El enlace expirará en 15 minutos.
        </p>
      </div>
    `;

        return this.sendMail(to, 'Medical - Recuperá tu contraseña', html);
    }
}