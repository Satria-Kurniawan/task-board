import { TaskState } from "../../components/Task/type";
import { Action } from "./type";

export const taskReducer = (state: TaskState, action: Action): TaskState => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        [action.payload.task.status]: [
          ...state[action.payload.task.status as keyof TaskState],
          action.payload.task,
        ],
      };
    case "UPDATE":
      return {
        ...state,
        [action.payload.task.status]: state[
          action.payload.task.status as keyof TaskState
        ].map((item) =>
          item.id == action.payload.task.id
            ? { ...item, ...action.payload.task }
            : item
        ),
      };
    case "DELETE":
      return {
        ...state,
        [action.payload.task.status]: state[
          action.payload.task.status as keyof TaskState
        ].filter((item) => item.id != action.payload.task.id),
      };
    case "GET":
      return {
        ...state,
        [action.payload.status]: action.payload.tasks,
      };
    default:
      return state;
  }
};
