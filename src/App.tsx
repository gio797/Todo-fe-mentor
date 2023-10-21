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

  return (
    <div className={darkTheme ? "app" : "app-light-bg"}>
      <div className={darkTheme ? "head-bg-dark" : "head-bg-light"}></div>
      <div className="main">
        <div className="header">
          <h1>TODO</h1>
          <div onClick={() => setDarkTheme((prev) => !prev)}>
            <img src={darkTheme ? sun : moon} alt="" />
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="20"
              height="20"
            >
              <path
                fill="hsl(234, 39%, 85%)"
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

        <div className="tasks">
          {items.map((item, index) => (
            <div className="task" key={item.name + index}>
              <input
                type="checkbox"
                name="item"
                checked={item.done}
                onChange={() => handleCheckboxChange(index)}
              />
              <p className={item.done ? "task-line-through" : ""}>
                {item.name}
              </p>
              <button onClick={() => handleDelete(index)}>
                <img src={cross} alt="" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;