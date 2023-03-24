import { proxy } from "valtio";

import { eventSourceOpenAi } from "../../service";

type language = "spanish" | "english";

interface IStateStore {
  selectedText: string;
  language: language;
  textResult: string;
  streaming: boolean;
}

export const storeOpenai = proxy<IStateStore>({
  selectedText: "",
  language: "spanish",
  textResult: "",
  streaming: false,
});

export const handleChangeLanguage = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  storeOpenai.language = event.target.value as language;
  setTextResult();
};

export const setSelectedText = (selectedText: string) => {
  storeOpenai.selectedText = selectedText;
};

export const setTextResult = async () => {
  storeOpenai.streaming = true;

  const eventSource = eventSourceOpenAi(
    storeOpenai.selectedText,
    storeOpenai.language
  );
  let message = "";

  eventSource.onerror = (error) => {
    console.error("Event source Onerror:", error);
    eventSource.close();
    storeOpenai.streaming = false;
  };

  eventSource.onmessage = (event) => {
    const { data } = event;
    console.log(data);
    if (data === "[DONE]") {
      storeOpenai.streaming = false;

      eventSource.close();
      return;
    }
    message += JSON.parse(data);
    storeOpenai.textResult = message;
  };
};
