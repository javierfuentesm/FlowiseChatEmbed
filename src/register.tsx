import { customElement } from 'solid-element';
import { defaultBotProps } from './constants';
import { Bubble } from './features/bubble';
import { Full } from './features/full';
import { FullWithImages } from './features/full/components/FullWithImages';

export const registerWebComponents = () => {
  if (typeof window === 'undefined') return;
  // @ts-expect-error element incorrect type
  customElement('flowise-fullchatbot', defaultBotProps, Full);
  // @ts-expect-error element incorrect type
  customElement('flowise-fullchatbot-with-images', defaultBotProps, FullWithImages);
  customElement('flowise-chatbot', defaultBotProps, Bubble);
};
