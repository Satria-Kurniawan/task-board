import { Task, TaskState } from "../../components/Task/type";

export type Action =
  | { type: "ADD"; payload: { task: Task } }
  | { type: "UPDATE"; payload: { task: Task } }
  | { type: "DELETE"; payload: { task: Task } }
  | { type: "GET"; payload: { tasks: Task[]; status: string } };

// export type TaskContextType = {
//   state: TaskState;
//   dispatch: React.Dispatch<Action>;
// };

export type TaskContextType = {
  items: TaskState;
  setItems: React.Dispatch<React.SetStateAction<TaskState>>;
};

export type Props = {
  children: React.ReactNode;
};
