import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export type TodosResponse = {
  readonly todos: Todo[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
};

export type Todo = {
  readonly id: number;
  readonly todo: string;
  readonly completed: boolean;
  readonly userId: number;
};

export function ButtonAppBar() {
  const [todos, setTodos] = React.useState<TodosResponse>();
  const [todoText, setTodoText] = React.useState<string>("");

  const getTodos = () => {
    fetch("https://dummyjson.com/todos?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  };

  const addTodo = () => {
    fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: todoText,
        completed: false,
        userId: 5,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((x) => {
        if (todos) {
          const _todos = todos?.todos;
          _todos.push(x as any);
          setTodos({ ...todos, todos: _todos });
        }
        setTodoText("");
      });
  };

  const deleteTodo = (id: number) => {
    if (!window.confirm("Are you sure to delete to do")) return;
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (todos) {
          setTodos({
            ...todos,
            todos: todos?.todos.filter((x) => x.id !== id),
          });
        }
        alert("Todo successfully deleted");
      });
  };

  React.useEffect(() => {
    getTodos();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Box display={"flex"} justifyContent={"space-between"} margin={"10px"}>
        <TextField
          id="outlined-basic"
          label="To Do"
          variant="outlined"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          style={{ width: "600px" }}
        />
        <Button
          variant="contained"
          onClick={() => {
            addTodo();
          }}
        >
          Add Todo
        </Button>
      </Box>
      {todos?.todos.map((x) => {
        return (
          <Box
            key={x.id}
            textAlign={"left"}
            component="section"
            sx={{ p: 2, border: "1px dashed grey" }}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box>{x.todo}</Box>
            <Button
              variant="contained"
              onClick={() => {
                deleteTodo(x.id);
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}