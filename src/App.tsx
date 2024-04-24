import React from "react";
import axios from "axios";
import {
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

import TaskBoard from "./components/Task/TaskBoard";
import TaskDroppable from "./components/Task/TaskDroppable";
import TaskItem from "./components/Task/TaskItem";
import TaskLoading from "./components/Task/TaskLoading";

import { Task, TaskLoadingState, TaskState } from "./components/Task/type";
import { TaskContext } from "./context/Task/TaskContext";
import { AuthContext } from "./context/Auth/AuthContext";

export default function App() {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const { items, setItems } = React.useContext(TaskContext);
  const [activeItem, setActiveItem] = React.useState<Task | null>(null);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [isDragEnd, setIsDragEnd] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<TaskLoadingState>({
    backlog: false,
    ongoing: false,
    done: false,
  });
  const date = new Date();
  const currentDate = date.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = React.useState<string>(currentDate);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_BASE_URL_USER = import.meta.env.VITE_API_BASE_URL_USER;

  React.useEffect(() => {
    const sessionString = sessionStorage.getItem("session");
    const session = sessionString && JSON.parse(sessionString);

    if (!session) return;

    const fetchSession = async () => {
      try {
        const response = await axios.get(API_BASE_URL_USER);

        if (response.data[0].password != session.password) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSession();
  }, [API_BASE_URL_USER, setIsAuthenticated]);

  React.useEffect(() => {
    setIsLoading((prev) => ({ ...prev, backlog: true }));
    const getBacklogTasks = async () => {
      try {
        const response = await axios.get(
          API_BASE_URL + `/search?status=*backlog*&createdAt=${selectedDate}`
        );

        if (response.status == 200) {
          setItems((prevItems) => ({ ...prevItems, backlog: response.data }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, backlog: false }));
      }
    };

    getBacklogTasks();
  }, [API_BASE_URL, setItems, selectedDate]);

  React.useEffect(() => {
    const getOngoingTasks = async () => {
      setIsLoading((prev) => ({ ...prev, ongoing: true }));
      try {
        const response = await axios.get(
          API_BASE_URL + `/search?status=*ongoing*&createdAt=${selectedDate}`
        );
        if (response.status == 200) {
          setItems((prevItems) => ({ ...prevItems, ongoing: response.data }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, ongoing: false }));
      }
    };

    getOngoingTasks();
  }, [API_BASE_URL, setItems, selectedDate]);

  React.useEffect(() => {
    const getDoneTasks = async () => {
      setIsLoading((prev) => ({ ...prev, done: true }));
      try {
        const response = await axios.get(
          API_BASE_URL + `/search?status=*done*&createdAt=${selectedDate}`
        );
        if (response.status == 200) {
          setItems((prevItems) => ({ ...prevItems, done: response.data }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, done: false }));
      }
    };

    getDoneTasks();
  }, [API_BASE_URL, setItems, selectedDate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current as Task);
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const overId = event?.over?.id;

    if (!overId) return;

    const activeContainer = event.active.data.current?.sortable?.containerId;
    const overContainer = event.over?.data.current?.sortable?.containerId;

    if (!overContainer) return;

    const activeIndex = event.active.data.current?.sortable?.index;
    const overIndex = event.over?.data.current?.sortable?.index || 0;

    if (activeContainer !== overContainer) {
      const currentActiveItem = event.active.data.current as Task;
      currentActiveItem.status = overContainer;

      setItems((items) => {
        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          currentActiveItem
        );
      });

      const newItems = moveBetweenContainers(
        items,
        activeContainer,
        activeIndex,
        overContainer,
        overIndex,
        currentActiveItem
      );

      if (isFetching || !isDragEnd || !isAuthenticated) return;

      setIsFetching(true);

      try {
        await axios.delete(
          API_BASE_URL +
            `/search?status=*${overContainer}*&createdAt=${selectedDate}`
        );
        await axios.delete(API_BASE_URL + `/id/${activeItem?.id}`);
        await axios.post(
          API_BASE_URL,
          newItems[overContainer as keyof TaskState]
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
        setIsDragEnd(false);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over) return;

    if (event.active.id !== event.over.id) {
      const activeContainer: keyof TaskState =
        event.active.data.current?.sortable?.containerId;
      const overContainer: keyof TaskState =
        event.over.data.current?.sortable?.containerId || event.over.id;
      const activeIndex = event.active.data.current?.sortable?.index;
      const overIndex = event.over.data.current?.sortable?.index || 0;

      setIsDragEnd(true);

      let newItems: TaskState;

      setItems((items) => {
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            ),
          };
        } else {
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            event.active.data.current as Task
          );
        }

        return newItems;
      });

      if (isFetching || !isAuthenticated) return;

      if (activeContainer === overContainer) {
        newItems = {
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        };

        setIsFetching(true);
        try {
          console.log("end1");
          await axios.delete(
            API_BASE_URL +
              `/search?status=*${overContainer}*&createdAt=${selectedDate}`
          );
          await axios.delete(API_BASE_URL + `/id/*${activeItem?.id}*`);
          await axios.post(API_BASE_URL, newItems[activeContainer]);
        } catch (error) {
          console.log(error);
        } finally {
          setIsFetching(false);
        }
      } else {
        const currentActiveItem = event.active.data.current as Task;
        currentActiveItem.status = overContainer;

        newItems = moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          currentActiveItem
        );

        setIsFetching(true);
        try {
          console.log("end2");
          const responseTasks = await axios.get(
            API_BASE_URL +
              `/search?status=*${overContainer}*&createdAt=${selectedDate}`
          );
          if (responseTasks.data.length == 0) {
            await axios.delete(API_BASE_URL + `/id/*${currentActiveItem?.id}*`);
            await axios.post(API_BASE_URL, currentActiveItem);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsFetching(false);
        }
      }
    }
  };

  const moveBetweenContainers = (
    items: TaskState,
    activeContainer: keyof TaskState,
    activeIndex: number,
    overContainer: keyof TaskState,
    overIndex: number,
    item: Task
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  return (
    <main className="container mx-auto lg:px-48 px-3">
      <br />
      <TaskBoard
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      >
        {Object.keys(items).map((progress) => {
          if (isLoading[progress as keyof TaskState])
            return (
              <div key={progress} className="flex flex-col gap-y-4">
                <TaskLoading />
                <TaskLoading />
                <TaskLoading />
              </div>
            );

          return (
            <TaskDroppable
              key={progress}
              id={progress}
              progress={progress}
              items={items[progress as keyof TaskState]}
            />
          );
        })}
        <DragOverlay>
          {activeItem ? <TaskItem item={activeItem} /> : null}
        </DragOverlay>
      </TaskBoard>
    </main>
  );
}
