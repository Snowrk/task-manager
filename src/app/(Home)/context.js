import { createContext } from "react";

const TaskContext = createContext({
  taskList: [],
  setTaskList: () => {},
});

export default TaskContext;
