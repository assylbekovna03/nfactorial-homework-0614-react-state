import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];
const getItem = () => {
  let list = localStorage.getItem("key");

  if (list) {
    return JSON.parse(localStorage.getItem("key"));
  } else {
    return [];
  }
};

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(getItem());

  const [filterType, setFilterType] = useState("");

  const [searchs, setSearch] = useState([]);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleToSearch = (event) => {
    const find = event.target.value.toLowerCase();
    const delTodo = items.filter((item) =>
      item.label.toLowerCase().includes(find)
    );
    setFilterType("search");
    setSearch([...delTodo]);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);

    setItemToAdd("");
    localStorage.setItem("key", JSON.stringify(itemToAdd));
    localStorage.getItem("key");
  };

  useEffect(() => {
    localStorage.setItem("key", JSON.stringify(items));
  }, [items]);

  const handleToDelete = ({ key }) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const handleToImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  };

  const handleItemDone = ({ key }) => {
    //second way update
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };
  //first way
  // const itemIndex = items.findIndex((item) => item.key === key);
  // const oldItem = items[itemIndex];
  // const newItem = { ...oldItem, done: !oldItem.done };
  // const leftSideOfAnArray = items.slice(0, itemIndex);
  // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
  // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

  //  second way
  // const changedItem = items.map((item) => {
  //   if (item.key === key) {
  //     return { ...item, done: item.done ? false : true };
  //   } else return item;
  // });

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : filterType === "search"
      ? searchs
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>
      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          // value={searchs}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleToSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span
                className={`todo-list-item  
                 ${item.important ? " important" : ""}  
                  ${item.done ? "done" : ""}`}
              >
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className={`"btn ${
                    item.important ? "btn-success" : "btn-outline-success"
                  } btn-sm float-right`}
                  onClick={() => handleToImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  onClick={() => handleToDelete(item)}
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>
      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
