import { Bot } from './Bot';
import { MessageType } from './Bot';

const extractGoogleDriveUrls = (metadata: any): { imageUrls: string[], pdfUrls: string[] } => {
  const imageUrls: string[] = [];
  const pdfUrls: string[] = [];

  // Función para convertir URL de Google Drive
  const processUrl = (url: string) => {
    // Diferentes formatos posibles de URL de Google Drive
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)\/view/, // Formato compartir
      /\/file\/d\/([a-zA-Z0-9_-]+)/, // Formato directo
      /id=([a-zA-Z0-9_-]+)/, // Formato con id
      /([a-zA-Z0-9_-]{25,})/, // ID directo
    ];

    let fileId = null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (!fileId) return null;

    // Verificar si es un PDF (basado en la URL o metadata)
    const isPDF = url.toLowerCase().includes('.pdf') || 
                 (metadata.pdf && metadata.pdf.info) ||
                 (metadata.mimeType && metadata.mimeType.includes('pdf'));

    if (isPDF) {
      return {
        url: `https://drive.google.com/file/d/${fileId}/preview`,
        type: 'pdf'
      };
    } else {
      // Para imágenes, usamos un formato diferente que es más confiable
      return {
        url: `https://lh3.googleusercontent.com/d/${fileId}`,
        type: 'image'
      };
    }
  };

  // Procesar URLs del array URLS
  if (metadata.URLS && Array.isArray(metadata.URLS)) {
    metadata.URLS.forEach((url: string) => {
      console.log('🔍 Procesando URL:', url);
      const result = processUrl(url);
      if (result) {
        console.log(`✅ URL convertida (${result.type}):`, result.url);
        if (result.type === 'pdf') {
          pdfUrls.push(result.url);
        } else {
          imageUrls.push(result.url);
        }
      } else {
        console.log('❌ No se pudo procesar la URL');
      }
    });
  }

  // Procesar URL individual
  if (metadata.URL) {
    console.log('🔍 Procesando URL individual:', metadata.URL);
    const result = processUrl(metadata.URL);
    if (result) {
      console.log(`✅ URL individual convertida (${result.type}):`, result.url);
      if (result.type === 'pdf') {
        pdfUrls.push(result.url);
      } else {
        imageUrls.push(result.url);
      }
    } else {
      console.log('❌ No se pudo procesar la URL individual');
    }
  }

  return { imageUrls, pdfUrls };
};

const processMessageWithImages = (message: MessageType): MessageType => {
  console.log('⭐ processMessageWithImages llamado');
  console.log('📝 Tipo de mensaje:', message.type);
  console.log('📄 ¿Tiene sourceDocuments?:', !!message.sourceDocuments);

  if (message.type !== 'apiMessage' || !message.sourceDocuments) {
    console.log('❌ Mensaje saltado - no es apiMessage o no tiene sourceDocuments');
    return message;
  }

  let processedMessage = message.message;
  console.log('🔍 Procesando sourceDocuments:', message.sourceDocuments);

  message.sourceDocuments.forEach((doc: any) => {
    if (doc.metadata) {
      console.log('📎 Metadata del documento:', doc.metadata);
      const { imageUrls, pdfUrls } = extractGoogleDriveUrls(doc.metadata);
      console.log('🖼️ URLs de imágenes extraídas:', imageUrls);
      console.log('📄 URLs de PDFs extraídos:', pdfUrls);

      if (imageUrls.length > 0 || pdfUrls.length > 0) {
        processedMessage += '\n\n';
        
        // Agregar imágenes con un contenedor div para mejor control
        imageUrls.forEach((url) => {
          processedMessage += `
            <div style="margin: 10px 0; max-width: 100%; text-align: center;">
              <img 
                src="${url}" 
                alt="Imagen relacionada" 
                style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                loading="lazy" 
                onerror="this.style.display='none'" 
              />
            </div>`;
        });

        // Agregar PDFs
        pdfUrls.forEach((url) => {
          processedMessage += `
            <div style="margin: 10px 0;">
              <iframe 
                src="${url}" 
                width="100%" 
                height="500px" 
                frameborder="0" 
                allowfullscreen="true" 
                style="border: 1px solid #ccc; border-radius: 4px;">
              </iframe>
            </div>`;
        });
      }
    }
  });

  console.log('✅ Mensaje final procesado:', processedMessage);
  return {
    ...message,
    message: processedMessage,
  };
};

export const BotWithImages = (props: any) => {
  const enhancedProps = {
    ...props,
    renderHTML: true, // Forzar renderizado HTML para las imágenes
    messageProcessor: processMessageWithImages,
  };

  return <Bot {...enhancedProps} />;
};
