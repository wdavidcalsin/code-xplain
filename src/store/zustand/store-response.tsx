import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { eventSourceOpenAi } from "../../service";

interface IInitialStore {
  selectedText: string;
  language: string;
  textResult: string;
  isLoading: boolean;
}

interface IUseStore {
  initialStore: IInitialStore;
  setSelectedText: (selectedText: string) => void;
  handleChangeLanguage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  setTextResult: () => void;
}

export const useStore = create<IUseStore>()(
  devtools(
    persist(
      (set, get) => ({
        initialStore: {
          selectedText: "",
          isLoading: false,
          textResult: "",
          language: "spanish",
        },
        handleChangeLanguage: (event) => {
          set((state) => ({
            ...state,
            language: event.target.value,
          }));
        },
        setSelectedText: (selectedText) => {
          set((state) => ({
            ...state,
            selectedText: selectedText,
          }));
        },
        setTextResult: () => {
          set((state) => ({
            ...state,
            isLoading: true,
          }));

          const eventSource = eventSourceOpenAi(
            get().initialStore.selectedText,
            get().initialStore.language
          );
          let message = "";

          eventSource.onerror = (error) => {
            console.error("Event source Onerror:", error);
            eventSource.close();
            set((state) => ({
              ...state,
              isLoading: false,
            }));
          };

          eventSource.onmessage = (event) => {
            const { data } = event;

            if (data === "[DONE]") {
              set((state) => ({
                ...state,
                isLoading: false,
              }));

              eventSource.close();
              return;
            }
            message += JSON.parse(data);
            set((state) => ({
              ...state,
              textResult: message,
            }));
          };
        },
      }),
      {
        name: "store-result",
      }
    )
  )
);

// export const useStore = create<IUseStore>((set, get) => ({
//   initialStore: {
//     selectedText: "",
//     isLoading: false,
//     textResult: "",
//     language: "spanish",
//   },
//   setSelectedText: (selectedText: string) => {
//     set((state) => ({
//       ...state,
//       selectedText: selectedText,
//     }));
//   },
//   handleChangeLanguage: (event) => {
//     set((state) => ({
//       ...state,
//       language: event.target.value,
//     }));
//   },
//   setTextResult: () => {
//     set((state) => ({
//       ...state,
//       isLoading: true,
//     }));

//     const eventSource = eventSourceOpenAi(
//       get().initialStore.selectedText,
//       get().initialStore.language
//     );
//     let message = "";

//     eventSource.onerror = (error) => {
//       console.error("Event source Onerror:", error);
//       eventSource.close();
//       set((state) => ({
//         ...state,
//         isLoading: false,
//       }));
//     };

//     eventSource.onmessage = (event) => {
//       const { data } = event;

//       if (data === "[DONE]") {
//         set((state) => ({
//           ...state,
//           isLoading: false,
//         }));

//         eventSource.close();
//         return;
//       }
//       message += JSON.parse(data);
//       set((state) => ({
//         ...state,
//         textResult: message,
//       }));
//     };
//   },
// }));
