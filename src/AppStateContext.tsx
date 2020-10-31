import { nanoid } from "nanoid";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { DragItem } from "./DragItem";
import { findItemIndexById } from "./utils/findItemIndexById";
import { moveItem } from "./utils/moveItem";

interface Task {
  id: string;
  text: string;
}

interface List {
  id: string;
  text: string;
  tasks: Task[];
}

export interface AppState {
  lists: List[];
  draggedItem?: DragItem | undefined;
}

interface AppStateContextProps {
  state: AppState;
  dispatch: Dispatch<Action>;
}

type Action =
  | {
      type: "ADD_LIST";
      payload: string;
    }
  | {
      type: "ADD_TASK";
      payload: { text: string; listId: string };
    }
  | {
      type: "MOVE_LIST";
      payload: {
        dragIndex: number;
        hoverIndex: number;
      };
    }
  | {
      type: "SET_DRAGGED_ITEM";
      payload: DragItem | undefined;
    };

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: nanoid(), text: action.payload, tasks: [] },
        ],
      };
    }

    case "ADD_TASK": {
      const targetColumnIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      );

      state.lists[targetColumnIndex].tasks.push({
        id: nanoid(),
        text: action.payload.text,
      });

      return {
        ...state,
      };
    }

    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload;
      state.lists = moveItem(state.lists, dragIndex, hoverIndex);
      return { ...state };
    }

    case "SET_DRAGGED_ITEM": {
      return { ...state, draggedItem: action.payload };
    }

    default: {
      return state;
    }
  }
};

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

export const AppStateProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(appStateReducer, appData);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);

// Initial mocked data to build out UI
// TODO: DELETE ME
const appData: AppState = {
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }],
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }],
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }],
    },
  ],
};
