import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue, push, set, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { firebaseui } from "https://cdn.firebase.com/libs/firebaseui/6.0.0/firebaseui.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// FirebaseUI configuration
const uiConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: "password",
      requireDisplayName: false,
    },
  ],
};

// Initialize FirebaseUI
const ui = new firebaseui.auth.AuthUI(auth);
ui.start("#firebaseui-auth-container", uiConfig);

// DOM elements
const taskForm = document.getElementById("add-task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const signOutBtn = document.getElementById("sign-out-btn");
const todoContainer = document.getElementById("todo-container");
const authContainer = document.querySelector(".auth-container");

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    authContainer.style.display = "none";
    todoContainer.style.display = "block";
    fetchTasks(user);
  } else {
    authContainer.style.display = "block";
    todoContainer.style.display = "none";
  }
});

// Fetch user tasks and listen for changes
function fetchTasks(user) {
  const tasksRef = ref(db, "tasks/" + user.uid);
  onValue(tasksRef, (snapshot) => {
    renderTaskList(snapshot);
  });
}

// Render task list
function renderTaskList(snapshot) {
  const tasks = snapshot.val();
  let listItems = "";

  for (const taskId in tasks) {
    const task = tasks[taskId].task;
    const questions = tasks[taskId].questions.join('<br>');
    const answers = tasks[taskId].answers.replace(/\n/g, '<br>');
    const breakdownTasks = tasks[taskId].breakdownTasks.join('<br>');

    listItems += `
      <li data-id="${taskId}">
        <input type="text" value="${task}" data-id="${taskId}" class="editable-task">
        <button class="view-task-btn">View</button>
        <button class="breakdown-task-btn">Breakdown</button>
        <button class="delete-task-btn">Delete</button>
      </li>
    `;
  }

  taskList.innerHTML = listItems;
}

// Add a new task
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = taskInput.value.trim();
  if (task) {
    const newTaskRef = push(ref(db, "tasks/" + auth.currentUser.uid));
    set(newTaskRef, {
      task,
      questions: [],
      answers: "",
      breakdownTasks: [],
    });
    taskInput.value = "";
  }
});

// Update a task in real time
function taskList.addEventListener("input", (event) => {
  if (event.target.classList.contains("editable-task")) {
    const taskId = event.target.getAttribute("data-id");
    const taskRef = ref(db, "tasks/" + auth.currentUser.uid + "/" + taskId);
    update(taskRef, { task: event.target.value });
  }
});

// Delete a task
taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-task-btn")) {
    const taskId = event.target.parentElement.getAttribute("data-id");
    const taskRef = ref(db, "tasks/" + auth.currentUser.uid + "/" + taskId);
    remove(taskRef);
  }
});

// View task clarifying questions and answers
function viewTask(event) {
  if (event.target.classList.contains("view-task-btn")) {
    const taskElement = event.target.parentElement;
    const taskId = taskElement.getAttribute("data-id");
    const questions = tasks[taskId].questions.join('<br>');
    const answers = tasks[taskId].answers.replace(/\n/g, '<br>');

    const modalText = `
      <div><strong>Questions:</strong><br>${questions}</div>
      <div><strong>Answers:</strong><br>${answers}</div>
    `;

    document.getElementById("modal-text").innerHTML = modalText;
    modal.style.display = "block";
  }
}

taskList.addEventListener("click", viewTask);

// Add Breakdown button event listener
taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("breakdown-task-btn")) {
    // Add code to handle breakdown task functionality here
  }
});

// Sign out
signOutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Modal functionality
const modal = document.getElementById("modal");
const modalClose = document.querySelector(".modal-close");

modalClose.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
