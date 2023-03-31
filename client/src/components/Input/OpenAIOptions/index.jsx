import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import ModelSelect from './ModelSelect';
import { Button } from '../../ui/Button.tsx';

import store from '~/store';

function OpenAIOptions({ conversation = {} }) {
  const { endpoint } = conversation;
  const [advancedMode, setAdvancedMode] = useState(false);
  const setConversation = useSetRecoilState(store.conversation);

  const triggerAdvancedMode = () => setAdvancedMode(prev => !prev);

  const switchToSimpleMode = () => {
    setConversation(prevState => ({
      ...prevState,
      chatGptLabel: null,
      promptPrefix: null,
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1
    }));
    setAdvancedMode(false);
  };

  const setModel = newModel => {
    setConversation(prevState => ({
      ...prevState,
      model: newModel
    }));
  };

  useEffect(() => {
    const { endpoint, chatGptLabel, promptPrefix, temperature, top_p, presence_penalty } = conversation;

    if (endpoint !== 'openAI') return;

    const mustInAdvancedMode =
      chatGptLabel !== null ||
      promptPrefix !== null ||
      temperature !== 0.8 ||
      top_p !== 1 ||
      presence_penalty !== 1;

    if (mustInAdvancedMode && !advancedMode) setAdvancedMode(true);
  }, [conversation, advancedMode]);

  if (endpoint !== 'openAI') return null;

  const { model } = conversation;

  const cardStyle =
    'shadow-md rounded-md min-w-[75px] font-normal bg-white border-black/10 border dark:bg-gray-700 text-black dark:text-white';

  return (
    <>
      <div
        className={
          'openAIOptions-simple-container flex w-full items-center justify-center gap-2' +
          (!advancedMode ? ' show' : '')
        }
      >
        <ModelSelect
          model={model}
          onChange={setModel}
          type="button"
          className={
            cardStyle +
            ' flex h-[40px] items-center justify-center px-4 hover:bg-slate-50 data-[state=open]:bg-slate-50 dark:hover:bg-gray-600 dark:data-[state=open]:bg-gray-600'
          }
        />
        <Button
          type="button"
          className={
            cardStyle +
            ' flex h-[40px] items-center justify-center px-4 hover:bg-slate-50 dark:hover:bg-gray-600'
          }
          onClick={triggerAdvancedMode}
        >
          <span className="w-full text-center text-xs font-medium font-normal">More</span>
        </Button>
      </div>
      <div
        className={
          cardStyle +
          ' p-b-[40px] openAIOptions-advanced-container absolute left-4 right-4 bottom-[40px] flex flex-col overflow-hidden rounded-md bg-slate-100 bg-white px-0' +
          (advancedMode ? ' show' : '')
        }
      >
        <div className="flex w-full items-center justify-between bg-slate-100 px-4 py-2 dark:bg-white/10">
          <span className="text-xs font-medium font-normal">Advanced settings for OpenAI endpoint</span>
          <Button
            type="button"
            className="h-auto bg-transparent px-2 py-1 text-xs font-medium font-normal text-black hover:bg-slate-200 hover:text-black dark:bg-transparent dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={switchToSimpleMode}
          >
            Switch to simple mode
          </Button>
        </div>
        <div className="h-[200px]">content</div>
      </div>
    </>
  );
}

export default OpenAIOptions;
