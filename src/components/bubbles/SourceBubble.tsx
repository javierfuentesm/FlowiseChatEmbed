type Props = {
  pageContent: string;
  metadata: {
    source?: string;
    URL?: string;
    URLS?: string[];
    title?: string;
    titulo?: string;
    Titulo?: string;
    pdf?: {
      info?: {
        Title?: string;
      }
    };
    [key: string]: any;
  };
  onSourceClick?: () => void;
};

export const SourceBubble = (props: Props) => {
  // Solo mostrar si es un PDF o si no tiene URLs (comportamiento por defecto)
  const shouldShow = !props.metadata.URLS || props.metadata.pdf;
  
  if (!shouldShow) {
    return null;
  }

  const title = props.metadata.Titulo || 
                props.metadata.titulo || 
                props.metadata.title || 
                props.metadata.pdf?.info?.Title || 
                props.pageContent;

  return (
    <div
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"
      onClick={() => props.onSourceClick?.()}
    >
      <span
        class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble"
        data-testid="host-bubble"
        style={{
          width: 'max-content',
          'max-width': '80px',
          'font-size': '13px',
          'border-radius': '15px',
          cursor: 'pointer',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'white-space': 'nowrap',
        }}
      >
        {title}
      </span>
    </div>
  );
};
