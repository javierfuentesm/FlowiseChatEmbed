import { Bot } from './Bot';
import { MessageType } from './Bot';

const extractGoogleDriveImageUrls = (metadata: any): string[] => {
  const imageUrls: string[] = [];

  // Función para convertir URL de Google Drive a URL directa
  const convertToDirectUrl = (url: string) => {
    // El formato es: https://drive.google.com/file/d/ID/view?usp=sharing
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (!fileId) return null;
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Revisar URLS si existe
  if (metadata.URLS && Array.isArray(metadata.URLS)) {
    metadata.URLS.forEach((url: string) => {
      const directUrl = convertToDirectUrl(url);
      if (directUrl) imageUrls.push(directUrl);
    });
  }

  // Revisar URL individual si existe
  if (metadata.URL) {
    const directUrl = convertToDirectUrl(metadata.URL);
    if (directUrl) imageUrls.push(directUrl);
  }

  return imageUrls;
};

const processMessageWithImages = (message: MessageType): MessageType => {
  console.log('processMessageWithImages called with:', message);
  
  if (message.type !== 'apiMessage' || !message.sourceDocuments) {
    console.log('Message skipped - not apiMessage or no sourceDocuments');
    return message;
  }

  let processedMessage = message.message;
  console.log('Processing sourceDocuments:', message.sourceDocuments);

  message.sourceDocuments.forEach((doc: any) => {
    console.log('Processing doc:', doc);
    if (doc.metadata) {
      const imageUrls = extractGoogleDriveImageUrls(doc.metadata);
      console.log('Extracted imageUrls:', imageUrls);
      if (imageUrls.length > 0) {
        processedMessage += '\n\n';
        imageUrls.forEach((url) => {
          processedMessage += `<img src="${url}" alt="Imagen relacionada" style="max-width: 100%; margin: 10px 0;" />\n`;
        });
      }
    }
  });
  
  console.log('Final processedMessage:', processedMessage);
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
