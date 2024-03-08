const token = localStorage.getItem("JWTtoken");
const option = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

function fetchAllTodos() {
  fetch("https://api.kelasprogramming.com/todo", option)
    .then((response) => response.json())
    .then((body) => {
      // convert list kepada list of HTML element
      const todoList = body.entry.map(
        (todo) => `<div class="pt-1 d-flex justify-content-between">
    ${todo.details}
    <div class="d-flex">
      <button class="btn btn-${
        todo.completed == 1 ? "success" : "warning"
      } me-1">
        ${
          todo.completed == 1
            ? '<i class="bi bi-check"></i>'
            : '<i class="bi bi-x"></i>'
        }
      </button>
      <div
        class="btn btn-primary me-1"
        data-bs-toggle="modal"
        data-bs-target="#editTodo"
        onclick='selectTodo(${JSON.stringify(todo)})'
      >
        <i class="bi bi-pencil"></i>
      </div>
      <div class="btn btn-danger" onclick='selectTodo(${JSON.stringify(
        todo
      )}); deleteTodo()'>
        <i class="bi bi-trash"></i>
      </div>
    </div>
  </div>`
      );

      // render list of HTML kepada innerHTML dalam #todoList

      document.getElementById("todoList").innerHTML = todoList.join("");
    })
    .catch((err) => {
      console.log(err);
    });
}

// kena list to onclick event dekat button 'add'
//onclick button,
// 1) dapatkan value dari input
// 2) buat post request utk create
// onsuccess,
// 3.1) refetch all todo items
// 3.2) clearkan input
// onfailed, keluar alert
function onSubmit() {
  let inputValue = document.getElementById("todoInput").value;

  //   if (inputValue == "") {
  //     inputValue = `Unnamed Task`;
  //   }

  console.log("input value", inputValue);

  fetch("https://api.kelasprogramming.com/todo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      details: inputValue,
    }),
  })
    .then((res) => res.json())
    .then((body) => {
      //   console.log(body);
    })
    .then((err) => console.log(err));
  fetchAllTodos();

  document.getElementById("todoInput").value = "";
}

//Login
// onclick submit, kita hantar POST request utk login
// dapatkan value username
// dapatkan value password
// buat HTTP request utk login
// onsuccess
// 1) save token dan refresh token dalam browser
// 2) redirect user ke index.html
// onerror, display error

function login() {
  const userName = document.getElementById("userName").value;
  const password = document.getElementById("password").value;

  fetch("https://api.kelasprogramming.com/consumer/login", {
    method: "POST",
    body: JSON.stringify({
      username: `${userName}`,
      password: `${password}`,
    }),
  })
    .then((res) => res.json())
    .then((body) => {
      console.log(body);
      localStorage.setItem("JWTtoken", body.token);
      localStorage.setItem("refresh_token", body.refresh_token);
      if (body.success == false) {
        alert(`${body.message}`);
        document.getElementById("userName").value = "";
        document.getElementById("password").value = "";
        return;
      }
      window.location.href = "./index.html";
    })
    .then((err) => {});
}

//update

let selectedTodo = "";

function selectTodo(todo) {
  console.log(todo);
  selectedTodo = todo;
  document.getElementById("todoUpdate").value = todo.details;
}

function updateTodo() {
  const inputUpdate = document.getElementById("todoUpdate").value;
  const completed = document.getElementById("completed").checked;

  let completed_flag = "";
  if (completed == true) {
    completed_flag = 1;
  } else {
    completed_flag = 0;
  }

  fetch(`https://api.kelasprogramming.com/todo/${selectedTodo.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      details: inputUpdate,
      completed: completed_flag,
    }),
  })
    .then((res) => res.json())
    .then((body) => {
      fetchAllTodos();
      document.getElementById("closeModal").click();
    })
    .then((err) => {
      console.log(err);
    });
}

//DELETE

function deleteTodo() {
  fetch(`https://api.kelasprogramming.com/todo/${selectedTodo.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((body) => {
      fetchAllTodos();
    })
    .then((err) => {
      console.log(err);
    });
}

fetchAllTodos();

// if JWTtoken is not empty, remove Register and login
if (token !== "") {
  document.getElementById("register").remove();
  document.getElementById("sign-in").remove();
}

//if click logout, remove JWTtoken and bring to login screen

function signOut() {
  localStorage.clear();
  window.location.href = "./sign-in.html";
}

//REGISTER

function onRegister() {
  const userName = document.getElementById("userNameRegister").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("passwordRegister").value;
  console.log(userName, email, password);

  fetch("https://api.kelasprogramming.com/register", {
    method: "POST",
    body: JSON.stringify({
      username: userName,
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body.success == false) {
        alert(`${body.message}`);
        document.getElementById("userNameRegister").value = "";
        document.getElementById("email").value = "";
        document.getElementById("passwordRegister").value = "";
      } else {
        alert("User Created. Proceed to login page");
        window.location.href = "./sign-in.html";
      }
    })
    .then((err) => err);
}
