/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const registrationForm = document.getElementById("registration-form");

const studentsTableBody = document.getElementById("students-table-body");

const studentSearch = document.getElementById("student-search");

const studentCount = document.getElementById("student-count");

const formMessage = document.getElementById("form-message");

/* =========================================
   2. STORAGE KEY
========================================= */

const STORAGE_KEY = "studentPortalRecords";

/* =========================================
   3. SAMPLE STUDENTS
========================================= */

const sampleStudents = [
  {
    id: "000001",
    name: "John Kamau",
    email: "john@example.com",
    course: "Medicine",
    status: "Registered",
  },
  {
    id: "000002",
    name: "Mary Wanjiku",
    email: "mary@example.com",
    course: "Nursing",
    status: "Registered",
  },
  {
    id: "000003",
    name: "Peter Otieno",
    email: "peter@example.com",
    course: "Computer Science",
    status: "Pending",
  },
];

/* =========================================
   4. LOAD STUDENTS
========================================= */

function loadStudents() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleStudents));

      return [...sampleStudents];
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      throw new Error("Invalid student data");
    }

    return parsedData;
  } catch (error) {
    console.error("Loading error:", error);

    return [...sampleStudents];
  }
}

/* =========================================
   5. STUDENT ARRAY
========================================= */

let students = loadStudents();

/* =========================================
   6. SAVE STUDENTS
========================================= */

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

    return true;
  } catch (error) {
    console.error("Saving error:", error);

    return false;
  }
}

/* =========================================
   7. UPDATE STUDENT COUNT
========================================= */

function updateStudentCount() {
  studentCount.textContent = students.length;
}

/* =========================================
   8. DISPLAY STUDENTS
========================================= */

function renderStudents(records = students) {
  studentsTableBody.replaceChildren();

  updateStudentCount();

  if (records.length === 0) {
    const row = document.createElement("tr");

    const cell = document.createElement("td");

    cell.colSpan = 6;

    cell.className = "empty-row";

    cell.textContent = "No student records found.";

    row.appendChild(cell);

    studentsTableBody.appendChild(row);

    return;
  }

  records.forEach(function (student) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");

    idCell.textContent = student.id;

    const nameCell = document.createElement("td");

    nameCell.textContent = student.name;

    const emailCell = document.createElement("td");

    emailCell.textContent = student.email;

    const courseCell = document.createElement("td");

    courseCell.textContent = student.course;

    const statusCell = document.createElement("td");

    const statusLabel = document.createElement("span");

    statusLabel.textContent = student.status;

    statusLabel.className = "status registered";

    statusCell.appendChild(statusLabel);

    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.textContent = "Delete";

    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", function () {
      deleteStudent(student.id);
    });

    actionCell.appendChild(deleteButton);

    row.append(idCell, nameCell, emailCell, courseCell, statusCell, actionCell);

    studentsTableBody.appendChild(row);
  });
}

/* =========================================
   9. DISPLAY FORM MESSAGE
========================================= */

function showMessage(message, type) {
  formMessage.textContent = message;

  formMessage.className = `form-message ${type}`;
}

/* =========================================
   10. REGISTER STUDENT
========================================= */

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(registrationForm);

  const id = formData.get("student_id").trim();

  const name = formData.get("fullname").trim();

  const email = formData.get("email").trim();

  const course = formData.get("course");

  const studyMode = formData.get("study_mode");

  const interests = formData.getAll("interests");

  // Check duplicate student IDs.

  const duplicateStudent = students.find(function (student) {
    return student.id === id;
  });

  if (duplicateStudent) {
    showMessage("This student ID is already registered.", "error");

    return;
  }

  // Create student object.

  const newStudent = {
    id: id,

    name: name,

    email: email,

    course: course,

    studyMode: studyMode,

    interests: interests,

    status: "Registered",
  };

  // Add student to array.

  students.push(newStudent);

  // Save the updated array.

  if (!saveStudents()) {
    students.pop();

    showMessage("Could not save student information.", "error");

    return;
  }

  // Refresh the student table.

  renderStudents();

  // Clear form.

  registrationForm.reset();

  // Display success message.

  showMessage(`Registration successful! Welcome, ${name}.`, "success");

  console.log("Registered student:", newStudent);
});

/* =========================================
   11. SEARCH STUDENTS
========================================= */

studentSearch.addEventListener("input", function () {
  const searchTerm = studentSearch.value.toLowerCase().trim();

  const filteredStudents = students.filter(function (student) {
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.id.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.course.toLowerCase().includes(searchTerm)
    );
  });

  renderStudents(filteredStudents);
});

/* =========================================
   12. DELETE STUDENT
========================================= */

function deleteStudent(studentId) {
  const confirmation = confirm("Are you sure you want to delete this student?");

  if (!confirmation) {
    return;
  }

  const updatedStudents = students.filter(function (student) {
    return student.id !== studentId;
  });

  const previousStudents = students;

  students = updatedStudents;

  if (!saveStudents()) {
    students = previousStudents;

    alert("Could not delete student.");

    return;
  }

  renderStudents();

  // Reapply current search.

  studentSearch.dispatchEvent(new Event("input"));
}

/* =========================================
   13. INITIALIZE APPLICATION
========================================= */

renderStudents();

console.log("Student Registration Portal is running!");
