import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";
import { Task } from "../components/Task/type";

export const removeAtIndex = (array: Task[], index: number) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array: Task[], index: number, item: Task) => {
  const newItem = item as Task & { sortable?: undefined };
  delete newItem.sortable;
  return [...array.slice(0, index), newItem, ...array.slice(index)];
};

export const arrayMove = (
  array: Task[],
  oldIndex: number,
  newIndex: number
) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};
