/* =====================================================
   Lab 05 - ES6 Features, Modules, Callbacks,
   Promises and Async/Await
   Course: Full Stack Web Development (CS-301L)
   NOTE: loaded with type="module" (use Live Server)
===================================================== */

import formatStudentResult, {
  DEPARTMENT_NAME,
  calculateTotal,
  calculateAverage as lab05CalculateAverage, // aliased import
  getGrade,
  getStatus
} from "./studentUtils.js";

/* =====================================================
   LAB 05
   HELPER FUNCTIONS
===================================================== */
function lab05Append(id, html) {
  document.getElementById(id).innerHTML += html + "<br>";
}

function lab05Clear(id) {
  document.getElementById(id).innerHTML = "";
}

// Builds one result card (same look as the Lab 05 portal cards)
function lab05Card(title, lines, borderClass = "") {
  return `
    <div class="border rounded p-3 mb-3 ${borderClass}">
      <h5>${title}</h5>
      <p>${lines.join("<br>")}</p>
    </div>`;
}

/* =====================================================
   TASK 1 - UNIVERSITY COURSE ENROLLMENT MANAGER
===================================================== */
const lab05CoreCourses = [
  "Web Development",
  "Database Systems",
  "Data Structures"
];
const lab05ElectiveCourses = [
  "Artificial Intelligence",
  "Computer Networks",
  "Cloud Computing"
];
const lab05Student = {
  name: "Ali",
  rollNumber: "BSCS-001",
  department: "Computer Science",
  semester: 6
};
const lab05CgpaList = [3.75, 2.9, 3.1, 2.8, 3.05];

// 1. Merge arrays with spread
const lab05AllCourses = [...lab05CoreCourses, ...lab05ElectiveCourses];

// 2. Copy with spread, add a course to the copy only
const lab05CoursesCopy = [...lab05AllCourses];
lab05CoursesCopy.push("Software Engineering");

// 3. Updated student object with spread
const lab05UpdatedStudent = { ...lab05Student, semester: 7, cgpa: 3.45 };

// 4. Rest parameter
function enrollStudent(name, ...courses) {
  return `${name} enrolled in ${courses.length} course(s): ${courses.join(", ")}`;
}

// 5. Rest parameter + arrow function
const calculateAverageCGPA = (...cgpas) =>
  cgpas.reduce((sum, cgpa) => sum + cgpa, 0) / cgpas.length;

// 7. Default parameter
function getStudentInfo(name, department = "Computer Science") {
  return `Student: ${name}, Department (default): ${department}`;
}

// 6. Highest CGPA with spread
const lab05HighestCgpa = Math.max(...lab05CgpaList);

// 8 & 9. Template literals + card
document.getElementById("task1Output").innerHTML = lab05Card(
  "Course Enrollment Summary",
  [
    `Core Courses: ${lab05CoreCourses.join(", ")}`,
    `Elective Courses: ${lab05ElectiveCourses.join(", ")}`,
    `All Courses (${lab05AllCourses.length}): ${lab05AllCourses.join(", ")}`,
    `Copy after adding a course (${lab05CoursesCopy.length}): ${lab05CoursesCopy.join(", ")}`,
    `Original still has ${lab05AllCourses.length} courses`,
    `Original Student: ${lab05Student.name}, Semester ${lab05Student.semester}`,
    `Updated Student: ${lab05UpdatedStudent.name}, Semester ${lab05UpdatedStudent.semester}, CGPA ${lab05UpdatedStudent.cgpa}`,
    enrollStudent(
      lab05Student.name,
      lab05AllCourses[0],
      lab05AllCourses[1],
      lab05AllCourses[3]
    ),
    `Average CGPA: ${calculateAverageCGPA(...lab05CgpaList).toFixed(2)}`,
    `Highest CGPA: ${lab05HighestCgpa}`,
    getStudentInfo(lab05Student.name)
  ]
);

/* =====================================================
   TASK 2 - STUDENT UTILITY MODULE
===================================================== */
document.getElementById("departmentOutput").innerHTML =
  `Department: ${DEPARTMENT_NAME}`;

const lab05ClassStudents = [
  { name: "Sara", rollNumber: "BSCS-023", assignment: 28, midterm: 26, finalExam: 28 },
  { name: "Ahmed", rollNumber: "BSCS-002", assignment: 20, midterm: 22, finalExam: 25 },
  { name: "Ayesha", rollNumber: "BSCS-014", assignment: 15, midterm: 16, finalExam: 17 },
  { name: "Hassan", rollNumber: "BSCS-031", assignment: 24, midterm: 25, finalExam: 25 }
];

let lab05Task2Html = "";

lab05ClassStudents.forEach((student) => {
  // Object destructuring
  const { name, rollNumber, assignment, midterm, finalExam } = student;

  const total = calculateTotal(assignment, midterm, finalExam);
  const average = lab05CalculateAverage(assignment, midterm, finalExam);
  const grade = getGrade(total);
  const status = getStatus(total);

  lab05Task2Html += lab05Card(
    formatStudentResult(name, rollNumber, total),
    [
      `Average: ${average.toFixed(2)}`,
      `Grade: ${grade}`,
      `Status: ${status}`
    ],
    status === "Pass" ? "border-success" : "border-danger"
  );
});

document.getElementById("task2Output").innerHTML = lab05Task2Html;

/* =====================================================
   TASK 3 - ONLINE EXAMINATION WORKFLOW
===================================================== */

// Part B: error-first callback
function verifyStudent(roll, callback) {
  setTimeout(function () {
    if (roll === "") {
      callback("Roll number is required", null);
    } else {
      callback(null, `Student ${roll} verified`);
    }
  }, 1000);
}

function loadExamPaper(callback) {
  setTimeout(function () {
    callback("Exam paper loaded");
  }, 1500);
}

function submitAnswers(callback) {
  setTimeout(function () {
    callback("Answers submitted");
  }, 2000);
}

function generateResult(callback) {
  setTimeout(function () {
    callback("Result generated: 82 marks");
  }, 1000);
}

function lab05RunExam(roll) {
  lab05Clear("task3Output");

  // Printed immediately -> proves the code is asynchronous
  lab05Append("task3Output", "Exam workflow started...");

  // Why "callback hell"? Every step must be written INSIDE the callback of
  // the previous step, so the code keeps moving to the right and forms a
  // pyramid. It becomes hard to read, and error handling is repeated at
  // every level.
  verifyStudent(roll, function (error, data) {
    if (error) {
      lab05Append("task3Output", `<strong style="color:red">Error: ${error}</strong>`);
      return; // remaining steps do not run
    }
    lab05Append("task3Output", `Step 1: ${data}`);

    loadExamPaper(function (message2) {
      lab05Append("task3Output", `Step 2: ${message2}`);

      submitAnswers(function (message3) {
        lab05Append("task3Output", `Step 3: ${message3}`);

        generateResult(function (message4) {
          lab05Append("task3Output", `Step 4: ${message4}`);
          lab05Append(
            "task3Output",
            "<strong>Exam completed successfully!</strong>"
          );
        });
      });
    });
  });
}

document
  .getElementById("examValidBtn")
  .addEventListener("click", () => lab05RunExam("BSCS-001"));

document
  .getElementById("examEmptyBtn")
  .addEventListener("click", () => lab05RunExam(""));

/* =====================================================
   TASK 4 - UNIVERSITY RESULT PORTAL
===================================================== */
const lab05Database = [
  { name: "Ali", rollNumber: "BSCS-001", department: "Computer Science",
    semester: 6, assignment: 25, midterm: 27, finalExam: 30 },
  { name: "Ahmed", rollNumber: "BSCS-002", department: "Computer Science",
    semester: 5, assignment: 20, midterm: 22, finalExam: 25 },
  { name: "Sara", rollNumber: "BSCS-023", department: "Software Engineering",
    semester: 6, assignment: 28, midterm: 26, finalExam: 28 },
  { name: "Ayesha", rollNumber: "BSCS-014", department: "Computer Science",
    semester: 4, assignment: 15, midterm: 16, finalExam: 17 },
  { name: "Hassan", rollNumber: "BSCS-031", department: "Data Science",
    semester: 8, assignment: 24, midterm: 25, finalExam: 25 }
];

// Promise 1: resolves with the student or rejects
function findStudent(rollNumber) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      const found = lab05Database.find(
        (student) => student.rollNumber === rollNumber.trim()
      );
      if (found) {
        resolve(found);
      } else {
        reject("Student not found");
      }
    }, 1000);
  });
}

// Promise 2: calculates total, average, grade and status
function calculateResult(student) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // Object destructuring + rest
      const { assignment, midterm, finalExam } = student;
      const marks = [assignment, midterm, finalExam];

      if (marks.some((mark) => typeof mark !== "number")) {
        reject("Invalid marks");
        return;
      }

      const total = calculateTotal(...marks); // spread
      resolve({
        total,
        average: lab05CalculateAverage(...marks),
        grade: getGrade(total),
        status: getStatus(total)
      });
    }, 1000);
  });
}

// Full result card of one student
function lab05ResultCard(student, result) {
  const { name, rollNumber, department, semester } = student;
  const { total, average, grade, status } = result;
  return lab05Card(
    `Student: ${name}`,
    [
      `Roll No: ${rollNumber}`,
      `Department: ${department}`,
      `Semester: ${semester}`,
      `Total: ${total}`,
      `Average: ${average.toFixed(2)}`,
      `Grade: ${grade}`,
      `Status: ${status}`
    ],
    status === "Pass" ? "border-success" : "border-danger"
  );
}

/* ---------- Part A: Promise chain ---------- */
function lab05SearchWithChain(rollNumber) {
  const output = document.getElementById("task4AOutput");
  output.innerHTML = "Searching...<br>";

  findStudent(rollNumber)
    .then((student) =>
      calculateResult(student).then((result) => ({ student, result }))
    )
    .then(({ student, result }) => {
      output.innerHTML += lab05ResultCard(student, result);
    })
    .catch((error) => {
      output.innerHTML +=
        `<strong style="color:red">Error: ${error}</strong><br>`;
    })
    .finally(() => {
      output.innerHTML += "Search completed<br>";
    });
}

document
  .getElementById("chainFoundBtn")
  .addEventListener("click", () => lab05SearchWithChain("BSCS-001"));
document
  .getElementById("chainMissingBtn")
  .addEventListener("click", () => lab05SearchWithChain("BSCS-999"));

/* ---------- Part B: async / await ---------- */
async function showResult(rollNumber) {
  const output = document.getElementById("task4COutput");
  output.innerHTML = "Searching...<br>";

  try {
    const student = await findStudent(rollNumber);
    const result = await calculateResult(student);
    output.innerHTML += lab05ResultCard(student, result);
  } catch (error) {
    output.innerHTML +=
      `<strong style="color:red">Error: ${error}</strong><br>`;
  } finally {
    output.innerHTML += "Search completed<br>";
  }
}

/* ---------- Part C: search form ---------- */
document.getElementById("searchBtn").addEventListener("click", () => {
  showResult(document.getElementById("rollInput").value);
});

/* ---------- Part D: load all results with Promise.all ---------- */
async function loadAllResults() {
  const output = document.getElementById("task4DOutput");
  output.innerHTML = "Loading all results...";

  try {
    // all results are calculated at the same time
    const results = await Promise.all(
      lab05Database.map((student) => calculateResult(student))
    );

    let html = "";
    let passed = 0;

    results.forEach((result, index) => {
      html += lab05ResultCard(lab05Database[index], result);
      if (result.status === "Pass") {
        passed++;
      }
    });

    html += lab05Card(
      "Final Statistics",
      [
        `Total Students: ${results.length}`,
        `Passed Students: ${passed}`,
        `Failed Students: ${results.length - passed}`
      ]
    );

    output.innerHTML = html;
  } catch (error) {
    output.innerHTML = `<strong style="color:red">Error: ${error}</strong>`;
  }
}

document
  .getElementById("loadAllBtn")
  .addEventListener("click", loadAllResults);
