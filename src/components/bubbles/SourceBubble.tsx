type Props = {
  pageContent: string;
  metadata: object;
  onSourceClick: () => void;
};
export const SourceBubble = (props: Props) => (
  <div class="flex justify-start mb-2 items-start animate-fade-in host-container">
    <button
      type="button"
      onClick={() => props.onSourceClick()}
      class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full"
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
