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
            };
        };
        [key: string]: any;
    };
    onSourceClick?: () => void;
};
export declare const SourceBubble: (props: Props) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=SourceBubble.d.ts.map