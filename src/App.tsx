import { useEffect, useState } from "react";
import sun from "./assets/images/icon-sun.svg";
import moon from "./assets/images/icon-moon.svg";

import cross from "./assets/images/icon-cross.svg";

type TaskType = {
  name: string;
  done: boolean;
};

function App() {
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<TaskType[]>(
    JSON.parse(localStorage.getItem("items") || "[]")
  );
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

  const [dragging, setDragging] = useState<number | null>(null); // Track the index of the dragging item
  const [dragOver, setDragOver] = useState<number | null>(null); // Track the index of the item being dragged over

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setItem(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setItems((prevItems) => {
      return [...prevItems, { name: item, done: false }];
    });
    setItem("");
  }

  function handleCheckboxChange(index: number) {
    setItems((prevItems) => {
      const newItems = prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, done: !item.done };
        } else {
          return item;
        }
      });
      return newItems;
    });
  }

  function handleDelete(index: number) {
    setItems((prevItems) => {
      const newItems = prevItems.filter((_, i) => index !== i);
      return newItems;
    });
  }

  function deleteCompleted() {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => !item.done);
      return newItems;
    });
  }

  const totalTasks = items.length;
  const completed = items.filter((item) => item.done).length;
  const notCompleted = totalTasks - completed;

  const filteredItems = items.filter((item) => {
    if (filter === "Active") {
      return !item.done;
    } else if (filter === "Completed") {
      return item.done;
    }
    return true;
  });

  function handleDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    setDragging(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(index);
  }

  function handleDragEnd() {
    setDragOver(null);
    setDragging(null);
  }

  function handleDrop(e: React.DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/html"));
    if (fromIndex !== toIndex) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return newItems;
      });
    }
    setDragOver(null);
  }

  return (
    <div className={darkTheme ? "app" : "app-light-bg"}>
      <div className={darkTheme ? "head-bg-dark" : "head-bg-light"}></div>
      <div className="main">
        <div className="header">
          <h1>TODO</h1>
          <div onClick={() => setDarkTheme((prev) => !prev)}>
            <img
              src={darkTheme ? sun : moon}
              alt="theme switcher"
              className="theme-image"
            />
          </div>
        </div>
        <form
          className={darkTheme ? "form" : "form-light"}
          onSubmit={handleSubmit}
        >
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="20"
              height="20"
            >
              <path
                fill="gray"
                d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
              />
            </svg>
          </button>
          <input
            required
            type="text"
            name="item"
            value={item}
            onChange={handleChange}
            placeholder="Create a new todo"
          />
        </form>

        <div
          className={darkTheme ? "tasks" : "tasks-light"}
          onDrop={(e) => handleDrop(e, dragOver as number)}
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
        >
          {filteredItems.map((item, index) => (
            <div
              className="task"
              key={item.name + index}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <label
                htmlFor={item.name}
                className={
                  item.done
                    ? "custom-checkbox task-line-through"
                    : "custom-checkbox"
                }
              >
                <input
                  type="checkbox"
                  id={item.name}
                  checked={item.done}
                  onChange={() => handleCheckboxChange(index)}
                />
                <span className="checkmark"></span>

                {item.name}
              </label>

              <button onClick={() => handleDelete(index)}>
                <img src={cross} alt="" />
              </button>
            </div>
          ))}
          <div className="info">
            <p className="info-items-color">{notCompleted} items left</p>

            <button
              onClick={deleteCompleted}
              className={`info-items-color ${
                darkTheme ? "info-btn" : "info-btn-light"
              }`}
            >
              Clear Completed
            </button>
          </div>
        </div>
        <div className={darkTheme ? "info-items" : "info-items-light"}>
          <button
            onClick={() => setFilter("All")}
            className={`
                  ${filter === "All" ? "active-filter" : "info-items-color"}
                  ${darkTheme ? "info-btn" : "info-btn-light"}
                `}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Active")}
            className={`
                  ${filter === "Active" ? "active-filter" : "info-items-color"}
                  ${darkTheme ? "info-btn" : "info-btn-light"}
                `}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`
                  ${
                    filter === "Completed"
                      ? "active-filter"
                      : "info-items-color"
                  }
                  ${darkTheme ? "info-btn" : "info-btn-light"}
                `}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
