type Props = {
  pageContent: string;
  metadata: object;
  onSourceClick: (metadata: any) => void;
};

export const SourceBubble = (props: Props) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Asegurarnos que se ejecute de forma síncrona
    setTimeout(() => {
      if (props.onSourceClick) {
        props.onSourceClick(props.metadata);
      }
    }, 0);
  };

  return (
    <div
      class="source-bubble-container flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"
      onClick={handleClick}
    >
      <span
        class="source-bubble-content px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble"
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
        {props.pageContent}
      </span>
    </div>
  );
};