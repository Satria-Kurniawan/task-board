import React from "react";

import { Props, TaskContextType } from "./type";
import { TaskState } from "../../components/Task/type";
// import { taskReducer } from "./TaskReducer";

// export const TaskContext = React.createContext<TaskContextType>({
//   state: {
//     backlog: [],
//     ongoing: [],
//     done: [],
//   },
//   dispatch: () => undefined,
// });

export const TaskContext = React.createContext<TaskContextType>({
  items: { backlog: [], ongoing: [], done: [] },
  setItems: {} as React.Dispatch<React.SetStateAction<TaskState>>,
});

export const TaskContextProvider = ({ children }: Props) => {
  // const [state, dispatch] = React.useReducer(taskReducer, {
  //   backlog: [],
  //   ongoing: [],
  //   done: [],
  // });
  const [items, setItems] = React.useState<TaskState>({
    backlog: [],
    ongoing: [],
    done: [],
  });

  return (
    <TaskContext.Provider value={{ items, setItems }}>
      {children}
    </TaskContext.Provider>
  );
};
