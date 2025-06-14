import { projectsData } from "./data.js";

window.projectsData = projectsData;

const itemsPerPage = 5;
let currentPage = 1;
let filteredData = [...projectsData];

document.addEventListener("DOMContentLoaded", () => {
  updateTable(filteredData);
  generatePagination();
});

// Debounce function for optimized searching
function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

// Live Search Function
function searchTable() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const noMatchMessage = document.getElementById("noMatchMessage");

  if (searchInput === "") {
    filteredData = [...projectsData]; // Reset to default if input is empty
    noMatchMessage.style.display = "none";
  } else {
    filteredData = projectsData.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().includes(searchInput)));

    noMatchMessage.style.display = filteredData.length === 0 ? "block" : "none";
  }

  currentPage = 1;
  updateTable(filteredData);
  generatePagination();
}

const debouncedSearch = debounce(searchTable, 300);

// Function to update the table with pagination
function updateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${item.description}</td>
            <td>${item.client}</td>
            <td>${item.date}</td>
            <td>${item.status}</td>
        `;
    tableBody.appendChild(row);
  });
}

// Function to generate pagination with numbers and arrows
function generatePagination() {
  const paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (totalPages <= 1) return;

  // Create Previous Button
  const prevButton = document.createElement("button");
  prevButton.innerText = "←";
  prevButton.classList.add("pagination-btn");
  if (currentPage === 1) prevButton.disabled = true;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(filteredData);
      generatePagination();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Create Numbered Buttons
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.classList.add("pagination-btn");
    if (i === currentPage) button.classList.add("active");

    button.addEventListener("click", () => {
      currentPage = i;
      updateTable(filteredData);
      generatePagination();
    });

    paginationContainer.appendChild(button);
  }

  // Create Next Button
  const nextButton = document.createElement("button");
  nextButton.innerText = "→";
  nextButton.classList.add("pagination-btn");
  if (currentPage === totalPages) nextButton.disabled = true;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable(filteredData);
      generatePagination();
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Attach the debounced search function
document.getElementById("searchInput").addEventListener("input", debouncedSearch);
