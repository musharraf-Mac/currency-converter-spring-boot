// API Configuration
const API_KEY = 'SUPER-SECRET-DEV-KEY-123';
let allHistoryData = [];

// Load history when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
});

// Function to load history from server
async function loadHistory() {
    const contentDiv = document.getElementById('historyContent');
    contentDiv.innerHTML = '<div class="loading">Loading history</div>';

    try {
        const response = await fetch('/api/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        }

        allHistoryData = await response.json();
        displayHistory(allHistoryData);
        updateStats(allHistoryData.length);
        
    } catch (error) {
        contentDiv.innerHTML = `<div class="error-message">❌ Error loading history: ${error.message}</div>`;
    }
}

// Function to display history data
function displayHistory(data) {
    const contentDiv = document.getElementById('historyContent');

    if (!data || data.length === 0) {
        contentDiv.innerHTML = '<div class="no-data">📭 No history records found</div>';
        return;
    }

    let html = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Input Amount</th>
                        <th>Input Unit</th>
                        <th>Output Amount</th>
                        <th>Output Unit</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach((log, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${log.inputAmount}</strong></td>
                <td>${log.inputUnit}</td>
                <td><strong>${log.outputAmount}</strong></td>
                <td>${log.outputUnit}</td>
                <td>${formatTimestamp(log.timestamp)}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    contentDiv.innerHTML = html;
}

// Function to format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Function to update statistics
function updateStats(count) {
    document.getElementById('totalRecords').textContent = count;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
}

// Function to apply filters
async function applyFilters() {
    const unit = document.getElementById('filterUnit').value;
    const date = document.getElementById('filterDate').value;
    const minAmount = parseFloat(document.getElementById('filterMinAmount').value);
    const maxAmount = parseFloat(document.getElementById('filterMaxAmount').value);

    let filteredData = allHistoryData;

    if (unit) {
        try {
            const response = await fetch(`/api/history/filter?unit=${unit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
            }

            filteredData = await response.json();
        } catch (error) {
            document.getElementById('historyContent').innerHTML = `<div class="error-message">❌ Error filtering history: ${error.message}</div>`;
            return;
        }
    }

    if (date) {
        const filterDate = new Date(date);
        filteredData = filteredData.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === filterDate.toDateString();
        });
    }

    if (!isNaN(minAmount)) {
        filteredData = filteredData.filter(log =>
            log.inputAmount >= minAmount || log.outputAmount >= minAmount
        );
    }

    if (!isNaN(maxAmount)) {
        filteredData = filteredData.filter(log =>
            log.inputAmount <= maxAmount || log.outputAmount <= maxAmount
        );
    }

    displayHistory(filteredData);
    updateStats(filteredData.length);

    if (filteredData.length < allHistoryData.length) {
        const contentDiv = document.getElementById('historyContent');
        const filterInfo = document.createElement('div');
        filterInfo.style.cssText = `
            background: #ebf5fb;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
            color: #2c3e50;
        `;
        filterInfo.innerHTML = `🔍 Showing ${filteredData.length} of ${allHistoryData.length} records`;
        contentDiv.prepend(filterInfo);
    }
}

// Function to reset filters
function resetFilters() {
    document.getElementById('filterUnit').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterMinAmount').value = '';
    document.getElementById('filterMaxAmount').value = '';
    
    displayHistory(allHistoryData);
    updateStats(allHistoryData.length);
}

// Function to refresh history
function refreshHistory() {
    loadHistory();
}

// Function to go back to main page
function goBack() {
    window.location.href = '/';
}