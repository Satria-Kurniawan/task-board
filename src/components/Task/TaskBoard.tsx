import React from "react";
import axios from "axios";
import { DndContext } from "@dnd-kit/core";
import toast from "react-hot-toast";

import Modal from "../ui/Modal/Modal";
import Button from "../ui/Button/Button";
import TextInput from "../ui/TextInput/TextInput";

import { AuthContext } from "../../context/Auth/AuthContext";
import { TaskBoardProps } from "./type";

export default function TaskBoard({
  children,
  sensors,
  collisionDetection,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TaskBoardProps) {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const API_BASE_URL_USER = import.meta.env.VITE_API_BASE_URL_USER;

  React.useEffect(() => {
    const sessionString = sessionStorage.getItem("session");
    const session = sessionString && JSON.parse(sessionString);

    if (!session) return;

    const fetchSession = async () => {
      try {
        const response = await axios.get(API_BASE_URL_USER);

        if (response.data[0].password != session.password) {
          setError("Password salah!");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSession();
  }, [API_BASE_URL_USER, password, setIsAuthenticated]);

  const activateEditMode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsFetching(true);

    try {
      const response = await axios.get(API_BASE_URL_USER);

      if (response.data[0].password != password) {
        const errorMessage =
          password == "bitcoinToTheMoon" ? "Prank wkwkw" : "Password salah!";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsAuthenticated(false);
        return;
      }

      sessionStorage.setItem(
        "session",
        JSON.stringify({ isAuthenticated: true, password })
      );
      toast.success("Edit mode activated!");
      setIsAuthenticated(true);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <main>
      <header className="flex flex-wrap gap-3 justify-between">
        <div>
          <h1 className="font-bold text-2xl">Task Board</h1>
          <p>The task board to keep track of your tasks.</p>
        </div>
        {isAuthenticated ? (
          <span className="font-semibold">Edit Mode Activated</span>
        ) : (
          <div>
            <Button
              variant="primary"
              text="Aktifkan Edit Mode"
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
      </header>
      <br />
      <br />
      <section className="grid lg:grid-cols-3 grid-cols-1 lg:gap-10 gap-5">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          {children}
        </DndContext>
      </section>

      <Modal show={showModal} close={() => setShowModal(false)}>
        <form onSubmit={activateEditMode}>
          <TextInput
            required
            type="password"
            placeholder="Passwordnya bitcoinToTheMoon"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && (
            <span className="text-sm font-semibold text-red-500">{error}</span>
          )}
          <div className="mt-3 w-fit ml-auto">
            {isFetching ? (
              "Loading..."
            ) : (
              <Button variant="primary" text="Gaskan" />
            )}
          </div>
        </form>
      </Modal>
    </main>
  );
}
