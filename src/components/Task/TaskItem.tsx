import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { LiaUserSecretSolid } from "react-icons/lia";
import { TbDots } from "react-icons/tb";
import IconButton from "../ui/IconButton/IconButton";
import TaskForm from "./TaskForm";
// import Avatar from "../../assets/celestia.png";

import { formatReadableDate } from "../../utils/date";
import { Task } from "./type";

type Props = {
  item: Task;
};

export default function TaskItem({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id, data: item });
  const [showForm, setShowForm] = React.useState<boolean>(false);

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div>
      <div
        ref={setNodeRef}
        style={itemStyle}
        {...(showForm ? {} : listeners)}
        {...(showForm ? {} : attributes)}
      >
        {!showForm ? (
          <div
            className={`p-4 w-full rounded-xl flex flex-col gap-y-3 border-l-4 shadow-md ${
              item.status == "backlog"
                ? "border-[#FED5F3]"
                : item.status == "ongoing"
                ? "border-[#DCFCFF]"
                : item.status == "done"
                ? "border-[#E2FFC7]"
                : "border-lightGlass"
            }`}
          >
            <section className="flex justify-between items-center">
              <div className="flex gap-x-3">
                <span className="py-0.5 px-3 h-fit bg-primary/5 text-primary rounded-xl text-xs font-semibold">
                  {item.type}
                </span>
                <span className="py-0.5 px-3 h-fit bg-primary/5 text-primary rounded-xl text-xs font-semibold">
                  {item.priority}
                </span>
              </div>
              <div>
                <IconButton
                  icon={<TbDots />}
                  onClick={() => setShowForm(true)}
                />
              </div>
            </section>

            <section>
              <p className="text-gray-500">{item.text}</p>
            </section>

            <section className="flex items-center gap-3">
              <div className="w-fit h-fit rounded-full overflow-hidden bg-primary text-white">
                {/* <img src={Avatar} width={25} height={25} /> */}
                <LiaUserSecretSolid size={20} />
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                {formatReadableDate(item.createdAt)}
              </span>
            </section>
          </div>
        ) : (
          <TaskForm
            progress={item.status}
            showForm={showForm}
            setShowForm={setShowForm}
            editing={true}
            item={item}
          />
        )}
      </div>
    </div>
  );
}
