import {
  CollisionDetection,
  DragStartEvent,
  SensorDescriptor,
} from "@dnd-kit/core";

export type Task = {
  id: number;
  text: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
};

export type TaskBoardProps = {
  children: React.ReactNode;
  sensors: SensorDescriptor[] | undefined;
  collisionDetection: CollisionDetection;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

export type TaskProgressProps = {
  children: React.ReactNode;
  progress: string;
};

export type TaskState = {
  backlog: Task[];
  ongoing: Task[];
  done: Task[];
};

export type TaskLoadingState = {
  backlog: boolean;
  ongoing: boolean;
  done: boolean;
};

export type TaskDroppable = {
  id: string;
  items: Task[];
  progress: string;
};

export type InputTypeState = {
  bug: boolean;
  feature: boolean;
  refactor: boolean;
};

export type InputPriorityState = {
  low: boolean;
  medium: boolean;
  high: boolean;
};

export type InputStatusState = {
  backlog: boolean;
  ongoing: boolean;
  done: boolean;
};

export type TaskFormProps = {
  progress: string;
  showForm?: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  editing?: boolean;
  item?: Task;
};
