import React from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

import Button from "../ui/Button/Button";
import RadioInput from "../ui/RadioInput/RadioInput";
import TextAreaInput from "../ui/TextAreaInput/TextAreaInput";

import IconButton from "../ui/IconButton/IconButton";
import { PiPlusLight } from "react-icons/pi";

import { AuthContext } from "../../context/Auth/AuthContext";
import { TaskContext } from "../../context/Task/TaskContext";
import {
  InputPriorityState,
  InputTypeState,
  TaskFormProps,
  TaskState,
} from "./type";

export default function TaskForm({
  progress,
  showForm,
  setShowForm,
  editing = false,
  item,
}: TaskFormProps) {
  const { isAuthenticated } = React.useContext(AuthContext);
  const { setItems } = React.useContext(TaskContext);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);

  const [activity, setActivity] = React.useState<string>("");
  const [type, setType] = React.useState<InputTypeState>({
    bug: false,
    feature: false,
    refactor: false,
  });
  const [priority, setPriority] = React.useState<InputPriorityState>({
    low: false,
    medium: false,
    high: false,
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  React.useEffect(() => {
    if (!editing) return;

    setActivity(item?.text || "");
    setType((type) => ({
      ...type,
      bug: item?.type == "bug",
      feature: item?.type == "feature",
      refactor: item?.type == "refactor",
    }));
    setPriority((priority) => ({
      ...priority,
      low: item?.priority == "low",
      medium: item?.priority == "medium",
      high: item?.priority == "high",
    }));
  }, [editing, item]);

  const saveTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) return;

    try {
      const { bug, feature, refactor } = type;
      const typeCheckedString = bug
        ? "bug"
        : feature
        ? "feature"
        : refactor && "refactor";
      const { low, medium, high } = priority;
      const priorityCheckedString = low
        ? "low"
        : medium
        ? "medium"
        : high && "high";

      setIsFetching(true);

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];

      if (editing) {
        const response = await axios.patch(API_BASE_URL + `/id/*${item?.id}*`, {
          text: activity,
          type: typeCheckedString,
          priority: priorityCheckedString,
          status: progress,
          createdAt: formattedDate,
        });

        setItems((prevItems) => ({
          ...prevItems,
          [progress]: prevItems[progress as keyof TaskState].map((item) => {
            if (item.id != response.data[0].id) return item;
            return { ...item, ...response.data[0] };
          }),
        }));
      } else {
        const response = await axios.post(API_BASE_URL, {
          id: uuidv4(),
          text: activity,
          type: typeCheckedString,
          priority: priorityCheckedString,
          status: progress,
          createdAt: formattedDate,
        });
        setItems((prevItems) => ({
          ...prevItems,
          [progress]: [
            ...prevItems[progress as keyof TaskState],
            response.data[0],
          ],
        }));
      }

      setShowForm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const deleteTask = async () => {
    if (!isAuthenticated) return;

    setIsFetching(true);

    try {
      const response = await axios.delete(API_BASE_URL + `/id/*${item?.id}*`);
      setItems((prevItems) => ({
        ...prevItems,
        [progress]: prevItems[progress as keyof TaskState].filter((item) => {
          return item.id != response.data[0].id;
        }),
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showForm ? "100%" : 0, opacity: showForm ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={saveTask}
      className="p-4 rounded-xl shadow-md flex flex-col gap-y-4"
    >
      {editing && (
        <div className="w-fit ml-auto">
          <IconButton
            icon={<PiPlusLight className={"rotate-45"} />}
            onClick={() => setShowForm((show) => !show)}
          />
        </div>
      )}
      <div>
        <TextAreaInput
          value={activity}
          onChange={(event) => setActivity(event.target.value)}
          placeholder="What are you working on?"
        />
      </div>

      <div>
        <h1 className="font-semibold text-sm mb-2">Task Type</h1>
        <div className="flex gap-x-3">
          <RadioInput
            label="Bug"
            checked={type.bug}
            onClick={() =>
              setType((type) => ({
                ...type,
                bug: true,
                feature: false,
                refactor: false,
              }))
            }
          />
          <RadioInput
            label="Feature"
            checked={type.feature}
            onClick={() =>
              setType((type) => ({
                ...type,
                bug: false,
                feature: true,
                refactor: false,
              }))
            }
          />
          <RadioInput
            label="Refactor"
            checked={type.refactor}
            onClick={() =>
              setType((type) => ({
                ...type,
                bug: false,
                feature: false,
                refactor: true,
              }))
            }
          />
        </div>
      </div>

      <div>
        <h1 className="font-semibold text-sm mb-2">Priority</h1>
        <div className="flex gap-x-3">
          <RadioInput
            label="Low"
            checked={priority.low}
            onClick={() =>
              setPriority((priority) => ({
                ...priority,
                low: true,
                medium: false,
                high: false,
              }))
            }
          />
          <RadioInput
            label="Medium"
            checked={priority.medium}
            onClick={() =>
              setPriority((priority) => ({
                ...priority,
                low: false,
                medium: true,
                high: false,
              }))
            }
          />
          <RadioInput
            label="High"
            checked={priority.high}
            onClick={() =>
              setPriority((priority) => ({
                ...priority,
                low: false,
                medium: false,
                high: true,
              }))
            }
          />
        </div>
      </div>

      {isFetching ? (
        <div className="w-fit ml-auto">Loading...</div>
      ) : (
        <div className="flex justify-end items-center gap-3">
          {editing && (
            <Button
              type="button"
              variant={isAuthenticated ? "secondary" : "disabled"}
              text="Delete"
              onClick={deleteTask}
            />
          )}
          <Button
            variant={isAuthenticated ? "primary" : "disabled"}
            text="Save"
          />
        </div>
      )}
    </motion.form>
  );
}
