import { Bot } from './Bot';
import { MessageType } from './Bot';

const extractGoogleDriveImageUrls = (metadata: any): string[] => {
  const imageUrls: string[] = [];

  // Función para convertir URL de Google Drive a URL directa
  const convertToDirectUrl = (url: string) => {
    // Diferentes formatos posibles de URL de Google Drive
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)\/view/,  // Formato compartir
      /\/file\/d\/([a-zA-Z0-9_-]+)/,        // Formato directo
      /id=([a-zA-Z0-9_-]+)/,                // Formato con id
      /([a-zA-Z0-9_-]{25,})/                // ID directo
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

    // Usar el endpoint de exportación directo de Google Drive
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Revisar URLS si existe
  if (metadata.URLS && Array.isArray(metadata.URLS)) {
    metadata.URLS.forEach((url: string) => {
      console.log('🔍 Procesando URL:', url);
      const directUrl = convertToDirectUrl(url);
      if (directUrl) {
        console.log('✅ URL convertida:', directUrl);
        imageUrls.push(directUrl);
      } else {
        console.log('❌ No se pudo convertir la URL');
      }
    });
  }

  // Revisar URL individual si existe
  if (metadata.URL) {
    console.log('🔍 Procesando URL individual:', metadata.URL);
    const directUrl = convertToDirectUrl(metadata.URL);
    if (directUrl) {
      console.log('✅ URL individual convertida:', directUrl);
      imageUrls.push(directUrl);
    } else {
      console.log('❌ No se pudo convertir la URL individual');
    }
  }

  return imageUrls;
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
      const imageUrls = extractGoogleDriveImageUrls(doc.metadata);
      console.log('🖼️ URLs de imágenes extraídas:', imageUrls);
      if (imageUrls.length > 0) {
        processedMessage += '\n\n';
        imageUrls.forEach((url) => {
          // Agregar atributos para mejorar la carga y el manejo de errores
          processedMessage += `<img src="${url}" alt="Imagen relacionada" style="max-width: 100%; margin: 10px 0;" loading="lazy" onerror="this.onerror=null; this.src='${url}?alt=media';" />\n`;
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
