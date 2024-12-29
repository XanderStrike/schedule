let shifts = JSON.parse(localStorage.getItem('shifts')) || [
    { name: "Morning Shift", day: "Monday", startTime: "09:00", endTime: "13:00" },
    { name: "Afternoon Shift", day: "Monday", startTime: "13:00", endTime: "17:00" },
    { name: "Evening Shift", day: "Monday", startTime: "17:00", endTime: "21:00" },
    { name: "Morning Shift", day: "Tuesday", startTime: "09:00", endTime: "13:00" },
    { name: "Afternoon Shift", day: "Tuesday", startTime: "13:00", endTime: "17:00" }
];

let availabilities = JSON.parse(localStorage.getItem('availabilities')) || [
    { name: "Alice", day: "Monday", startTime: "09:00", endTime: "17:00" },
    { name: "Bob", day: "Monday", startTime: "13:00", endTime: "21:00" },
    { name: "Charlie", day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    { name: "Dana", day: "Tuesday", startTime: "13:00", endTime: "21:00" }
];

document.getElementById('employeeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const employeeName = document.getElementById('employeeName').value;
    const availabilityDay = document.getElementById('availabilityDay').value;
    const availabilityStartTime = document.getElementById('availabilityStartTime').value;
    const availabilityEndTime = document.getElementById('availabilityEndTime').value;
    const availability = {
        name: employeeName,
        day: availabilityDay,
        startTime: availabilityStartTime,
        endTime: availabilityEndTime
    };
    availabilities.push(availability);
    updateAvailabilityTable();
    generateSchedule();
});

document.getElementById('shiftForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const shiftName = document.getElementById('shiftName').value;
    const shiftDay = document.getElementById('shiftDay').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const shift = {
        name: shiftName,
        day: shiftDay,
        startTime: startTime,
        endTime: endTime
    };
    shifts.push(shift);
    updateShiftTable();
    generateSchedule();
});

function updateTable(tableId, data) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    data.forEach(item => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = item.name;
        newRow.insertCell(1).textContent = item.day;
        newRow.insertCell(2).textContent = item.startTime;
        newRow.insertCell(3).textContent = item.endTime;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.onclick = function () {
            const index = Array.from(table.rows).indexOf(newRow);
            data.splice(index, 1);
            updateTable(tableId, data);
            generateSchedule();
        };
        newRow.insertCell(4).appendChild(removeButton);
    });
}

function updateAvailabilityTable() {
    updateTable('availabilityTable', availabilities);
}

function updateShiftTable() {
    updateTable('shiftTable', shifts);
}

// populate with test data on page load
updateAvailabilityTable();
updateShiftTable();
generateSchedule();

function generateSchedule() {
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    localStorage.setItem('availabilities', JSON.stringify(availabilities));
    localStorage.setItem('shifts', JSON.stringify(shifts));

    const schedule = [];
    const scheduledEmployees = {};
    const unmatchedShifts = [];
    shifts.forEach(shift => {
        const availableEmployees = availabilities.filter(availability =>
            availability.day === shift.day &&
            availability.startTime <= shift.startTime &&
            availability.endTime >= shift.endTime &&
            !scheduledEmployees[availability.name]?.includes(shift.day)
        );
        if (availableEmployees.length > 0) {
            const selectedEmployee = getRandomElement(availableEmployees);
            schedule.push({
                employee: selectedEmployee.name,
                shiftName: shift.name,
                day: shift.day,
                startTime: shift.startTime,
                endTime: shift.endTime
            });
            if (!scheduledEmployees[selectedEmployee.name]) {
                scheduledEmployees[selectedEmployee.name] = [];
            }
            scheduledEmployees[selectedEmployee.name].push(shift.day);
        } else {
            unmatchedShifts.push(shift);
        }
    });
    updateGeneratedScheduleTable(schedule, unmatchedShifts);
}

function updateGeneratedScheduleTable(schedule, unmatchedShifts) {
    const table = document.getElementById('generatedScheduleTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    schedule.forEach(entry => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = entry.employee;
        newRow.insertCell(1).textContent = entry.shiftName;
        newRow.insertCell(2).textContent = entry.day;
        newRow.insertCell(3).textContent = entry.startTime;
        newRow.insertCell(4).textContent = entry.endTime;
    });

    let unmatchedContainer = document.querySelector('#unmatched-shifts');
    if (!unmatchedContainer) {
        unmatchedContainer = document.createElement('div');
        unmatchedContainer.id = 'unmatched-shifts';
        unmatchedContainer.style.marginTop = '20px';
        table.parentElement.appendChild(unmatchedContainer);
    }
    unmatchedContainer.innerHTML = '';
    if (unmatchedShifts.length > 0) {
        unmatchedContainer.style.color = 'red';
        unmatchedContainer.innerHTML = '<h3>Unmatched Shifts</h3>';
        unmatchedShifts.forEach(shift => {
            const shiftInfo = document.createElement('p');
            shiftInfo.textContent = `${shift.name} on ${shift.day} from ${shift.startTime} to ${shift.endTime}`;
            unmatchedContainer.appendChild(shiftInfo);
        });
    } else {
        unmatchedContainer.style.color = 'green';
        unmatchedContainer.innerHTML = '<h3>No Unmatched Shifts!</h3>';
    }
}
