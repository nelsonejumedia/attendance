// Initial student data
let students = [
    { name: "John Doe", matric: "12345" },
    { name: "Jane Smith", matric: "67890" },
    { name: "Bob Johnson", matric: "11223" }
];

// Load attendance data from localStorage
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

function renderTable() {
    const tableBody = document.getElementById('attendanceBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.matric}</td>
            <td>
                <input type="radio" name="attendance_${student.matric}" value="present" 
                    ${attendanceData[student.matric] ? 'checked disabled' : ''}>
            </td>
        `;
        tableBody.appendChild(row);

        // Add event listener to radio button
        const radio = row.querySelector('input[type="radio"]');
        radio.addEventListener('change', () => {
            if (radio.checked) {
                attendanceData[student.matric] = true;
                localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                radio.disabled = true;
            }
        });
    });
}

// Add new student form submission
document.getElementById('newStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('newName').value;
    const matric = document.getElementById('newMatric').value;
    students.push({ name, matric });
    renderTable();
    this.reset();
});

// Download CSV function
function downloadCSV() {
    let csvContent = "Name,Matric Number,Attendance\n";
    students.forEach(student => {
        const status = attendanceData[student.matric] ? "Present" : "Absent";
        csvContent += `${student.name},${student.matric},${status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "attendance.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Attach download function to button
document.getElementById('downloadBtn').addEventListener('click', downloadCSV);

// Initial render
renderTable();

