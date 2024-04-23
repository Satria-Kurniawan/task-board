import React from "react";

import { PiPlusLight } from "react-icons/pi";
import IconButton from "../ui/IconButton/IconButton";
import TaskForm from "./TaskForm";

import { TaskProgressProps } from "./type";

export default function TaskProgress({
  children,
  progress,
}: TaskProgressProps) {
  const [showForm, setShowForm] = React.useState<boolean>(false);

  return (
    <div className="flex-1 p-4 rounded-xl">
      <div>
        <div className="flex justify-between mb-3">
          <h1 className="font-bold first-letter:uppercase">{progress}</h1>
          <IconButton
            icon={
              <PiPlusLight
                className={`${
                  showForm ? "rotate-45" : "rotate-0"
                } duration-300`}
              />
            }
            onClick={() => setShowForm((show) => !show)}
          />
        </div>
        {showForm && (
          <TaskForm
            progress={progress}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        )}
      </div>
      <section className={`mt-8 flex-1 flex flex-col gap-y-3`}>
        {children}
      </section>
    </div>
  );
}
