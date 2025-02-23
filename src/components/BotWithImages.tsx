import { Bot } from './Bot';
import { MessageType } from './Bot';

// Función auxiliar para verificar si una URL es una imagen
const isImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') || false;
  } catch {
    // Si no podemos verificar, asumimos que es una imagen
    return true;
  }
};

const extractGoogleDriveUrls = async (metadata: any): Promise<{ imageUrls: string[]; pdfUrls: string[] }> => {
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

    // Retornamos la URL en formato de visualización
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Procesar URLs del array URLS
  if (metadata.URLS && Array.isArray(metadata.URLS)) {
    for (const url of metadata.URLS) {
      console.log('🔍 Procesando URL:', url);
      const processedUrl = processUrl(url);

      if (processedUrl) {
        console.log('✅ URL convertida:', processedUrl);
        // Intentamos determinar si es una imagen
        if (await isImageUrl(processedUrl)) {
          console.log('📸 Detectada como imagen');
          imageUrls.push(processedUrl);
        } else {
          console.log('📄 Detectada como PDF');
          pdfUrls.push(url); // Usamos la URL original para PDFs
        }
      } else {
        console.log('❌ No se pudo procesar la URL');
      }
    }
  }

  // Procesar URL individual
  if (metadata.URL) {
    console.log('🔍 Procesando URL individual:', metadata.URL);
    const processedUrl = processUrl(metadata.URL);

    if (processedUrl) {
      console.log('✅ URL individual convertida:', processedUrl);
      if (await isImageUrl(processedUrl)) {
        console.log('📸 Detectada como imagen');
        imageUrls.push(processedUrl);
      } else {
        console.log('📄 Detectada como PDF');
        pdfUrls.push(metadata.URL); // Usamos la URL original para PDFs
      }
    } else {
      console.log('❌ No se pudo procesar la URL individual');
    }
  }

  return { imageUrls, pdfUrls };
};

const processMessageWithImages = async (message: MessageType): Promise<MessageType> => {
  console.log('⭐ processMessageWithImages llamado');
  console.log('📝 Tipo de mensaje:', message.type);
  console.log('📄 ¿Tiene sourceDocuments?:', !!message.sourceDocuments);

  if (message.type !== 'apiMessage' || !message.sourceDocuments) {
    console.log('❌ Mensaje saltado - no es apiMessage o no tiene sourceDocuments');
    return message;
  }

  let processedMessage = message.message;
  console.log('🔍 Procesando sourceDocuments:', message.sourceDocuments);

  for (const doc of message.sourceDocuments) {
    if (doc.metadata) {
      console.log('📎 Metadata del documento:', doc.metadata);
      const { imageUrls, pdfUrls } = await extractGoogleDriveUrls(doc.metadata);
      console.log('🖼️ URLs de imágenes extraídas:', imageUrls);
      console.log('📄 URLs de PDFs extraídos:', pdfUrls);

      if (imageUrls.length > 0 || pdfUrls.length > 0) {
        processedMessage += '\n\n';

        // Agregar imágenes
        imageUrls.forEach((url) => {
          processedMessage += `
            <div style="margin: 10px 0;">
              <img 
                src="${url}" 
                alt="Imagen relacionada" 
                style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                loading="lazy" 
                onerror="this.style.display='none'" 
              />
            </div>`;
        });

        // Agregar PDFs como links
        pdfUrls.forEach((url) => {
          processedMessage += `
            <div style="margin: 10px 0;">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #f0f0f0; border-radius: 4px; text-decoration: none; color: #333;">
                📄 Ver PDF
              </a>
            </div>`;
        });
      }
    }
  }

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
