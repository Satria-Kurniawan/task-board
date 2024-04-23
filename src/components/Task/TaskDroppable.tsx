import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";

import { TbMoodSad2 } from "react-icons/tb";
import TaskProgress from "./TaskProgress";
import TaskItem from "./TaskItem";

import type { TaskDroppable } from "./type";

export default function TaskDroppable({ id, items, progress }: TaskDroppable) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={rectSwappingStrategy}>
      <div ref={setNodeRef} className="flex-1">
        <TaskProgress key={progress} progress={progress}>
          {items.length > 0 ? (
            items.map((item) => {
              return <TaskItem key={item.id} item={item} />;
            })
          ) : (
            <div className="flex justify-center items-center">
              <div>
                <TbMoodSad2 size={50} className="mx-auto text-gray-500" />
                <br />
                <p className="text-center text-gray-500 font-semibold">
                  There`s no activity made
                </p>
              </div>
            </div>
          )}
        </TaskProgress>
      </div>
    </SortableContext>
  );
}
