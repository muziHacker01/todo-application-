// ==============================
// ✅ Importing Firebase Modules
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js"; 
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"; 

// ==============================
// ✅ Firebase Configuration
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyCxbO-SbHz5wq-OyG-A8-juBef9HUtVVko",
  authDomain: "mutahir-todo.firebaseapp.com",
  projectId: "mutahir-todo",
  storageBucket: "mutahir-todo.firebasestorage.app",
  messagingSenderId: "294292955949",
  appId: "1:294292955949:web:21441ae60a16f678e369a4"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==============================
// ✅ Add Task
// ==============================
window.add = async function() {
  const taskInput = document.getElementById("task");           // Get input
  if (!taskInput.value.trim()) {
    Swal.fire("Error", "Please enter a task!", "error");       // If empty, alert
    return;
  }
  try {
    await addDoc(collection(db, "todo data"), {
      task: taskInput.value.trim()
    });                                                         // Add data
    Swal.fire("Success", "Task added successfully!", "success"); // Show alert
    taskInput.value = "";                                      // Clear input
    readData();                                                  // Refresh list
  } catch (e) {
    console.error("Error:", e);
    Swal.fire("Error", "Something went wrong!", "error");       // If error
  }
}

// ==============================
// ✅ Read and Render Task List
// ==============================
window.readData = async function() {
  const container = document.getElementById("listContainer");  // Get container
  container.innerHTML = "";                                     // Clear old data
  const snapshot = await getDocs(collection(db, "todo data"));
  snapshot.forEach((d) => {
    const data = d.data();
    const id = d.id;

    // Create a new Div
    const div = document.createElement("div");
    div.classList.add("task-item");                            // Add class
    div.innerHTML = `
      <span>${data.task}</span>
      <div class="actions">
        <button onClick="deleteTask('${id}')">Delete</button>
        <button onClick="updateTask('${id}', '${data.task}')">Update</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// ==============================
// ✅ Delete Task
// ==============================
window.deleteTask = async function(id) {
  await deleteDoc(doc(db, "todo data", id));
  Swal.fire("Deleted!", "Task deleted successfully!", "success"); // Confirm delete
  readData();
}

// ==============================
// ✅ Update Task
// ==============================
window.updateTask = async function(id, oldValue) {
  const newValue = prompt("Enter new value:", oldValue);
  if (newValue && newValue.trim() !== "") {
    await updateDoc(doc(db, "todo data", id), {
      task: newValue.trim()
    });                                                         // Save changes
    Swal.fire("Updated", "Task updated successfully!", "success"); // Confirm
    readData();
  }
}

readData();