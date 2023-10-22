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

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // useEffect(() => {
  //   if (!darkTheme) {
  //     document.body.style.backgroundColor = "hsl(0, 0%, 98%)";
  //   } else document.body.style.backgroundColor = "hsl(235, 21%, 11%)";
  // }, [darkTheme]);

  // useEffect(() => {
  //   // Retrieve data from localStorage when the component mounts
  //   const storedItems = localStorage.getItem("items");
  //   if (storedItems) {
  //     setItems(JSON.parse(storedItems));
  //   }
  // }, []); // The empty dependency array ensures this effect runs only once on mount

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

  // Filter the tasks based on the selected filter
  const filteredItems = items.filter((item) => {
    if (filter === "Active") {
      return !item.done;
    } else if (filter === "Completed") {
      return item.done;
    }
    return true; // "All" filter, show all items
  });

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

        <div className={darkTheme ? "tasks" : "tasks-light"}>
          {filteredItems.map((item, index) => (
            <div className="task" key={item.name + index}>
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
