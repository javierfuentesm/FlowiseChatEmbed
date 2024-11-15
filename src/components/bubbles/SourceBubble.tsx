type Props = {
  pageContent: string;
  metadata: object;
  onSourceClick: (metadata: any) => void;
};

export const SourceBubble = (props: Props) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('source bubble clicked 2', props.metadata);
    props.onSourceClick(props.metadata);
  };

  return (
    <div class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75">
      <button
        onClick={handleClick}
        class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble"
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
      </button>
    </div>
  );
};
