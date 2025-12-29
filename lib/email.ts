import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface DepositApprovedEmailData {
  investorName: string;
  investorEmail: string;
  amount: number;
  newBalance: number;
  method: string;
  network?: string;
  transactionHash?: string;
}

export async function sendDepositApprovedEmail(
  data: DepositApprovedEmailData
): Promise<{ success: boolean; error?: string }> {
  // Si no hay API key configurada, no enviar email (modo desarrollo)
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY no configurada, email no enviado:', data);
    return { success: true }; // Retornar éxito para no bloquear el flujo
  }

  try {
    // Si RESEND_FROM_EMAIL no tiene formato "Nombre <email>", agregarlo
    let fromEmail = process.env.RESEND_FROM_EMAIL || 'Winbit <noreply@winbit.com>';
    if (fromEmail && !fromEmail.includes('<')) {
      // Si solo es un email, agregar formato
      fromEmail = `Winbit <${fromEmail}>`;
    }
    
    const methodDisplay = data.method === 'USDT' || data.method === 'USDC' 
      ? `${data.method} ${data.network || ''}`.trim()
      : data.method;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #58b098; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .amount { font-size: 32px; font-weight: bold; color: #58b098; margin: 20px 0; }
            .balance { font-size: 24px; font-weight: bold; color: #256454; margin: 20px 0; }
            .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Depósito Aprobado</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${data.investorName}</strong>,</p>
              
              <p>Tu depósito ha sido aprobado exitosamente.</p>
              
              <div class="amount">
                +$${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <div class="details">
                <div class="detail-row">
                  <span><strong>Método:</strong></span>
                  <span>${methodDisplay}</span>
                </div>
                ${data.transactionHash ? `
                <div class="detail-row">
                  <span><strong>Hash de Transacción:</strong></span>
                  <span style="font-family: monospace; font-size: 12px;">${data.transactionHash}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span><strong>Fecha:</strong></span>
                  <span>${new Date().toLocaleDateString('es-AR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
              
              <div class="balance">
                Balance Actual: $${data.newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <p>Si tenés alguna consulta, no dudes en contactarnos.</p>
              
              <div class="footer">
                <p>Winbit - Gestión de Inversiones</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Depósito Aprobado

Hola ${data.investorName},

Tu depósito ha sido aprobado exitosamente.

Monto: $${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Método: ${methodDisplay}
${data.transactionHash ? `Hash: ${data.transactionHash}\n` : ''}
Fecha: ${new Date().toLocaleDateString('es-AR', { 
  day: '2-digit', 
  month: 'long', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Balance Actual: $${data.newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Winbit - Gestión de Inversiones
    `.trim();

    await resend.emails.send({
      from: fromEmail,
      to: data.investorEmail,
      subject: `Depósito Aprobado - $${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      html: htmlContent,
      text: textContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

