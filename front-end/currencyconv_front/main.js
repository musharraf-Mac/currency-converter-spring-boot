const API_KEY = 'SUPER-SECRET-DEV-KEY-123';

async function convertCurrency() {
  const amount = document.getElementById('amountValue').value;
  const fromUnit = document.getElementById('currencyUnit').value;
  const outputArea = document.getElementById('outputBox');

  if (!amount) {
    outputArea.textContent = 'Error: Please enter a valid currency value.';
    return;
  }

  outputArea.textContent = 'Converting...';

  try {
    const response = await fetch(`/api/convert?value=${amount}&unit=${fromUnit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    outputArea.textContent = `Conversion Successful!\n\n` +
      `ID: ${data.id}\n` +
      `Input: ${data.inputAmount} ${data.inputUnit}\n` +
      `Output: ${data.outputAmount} ${data.outputUnit}\n` +
      `Timestamp: ${data.timestamp}`;
  } catch (error) {
    outputArea.textContent = `Error: ${error.message}`;
  }
}

async function exchangeRate() {
  const fromUnit = document.getElementById('currencyUnit').value;
  const outputArea = document.getElementById('outputBox');

  outputArea.textContent = 'Loading exchange rate...';

  try {
    const response = await fetch(`/api/exchange-rate?unit=${fromUnit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
    }

    const message = await response.text();
    outputArea.textContent = `Exchange Rate\n\n${message}`;
  } catch (error) {
    outputArea.textContent = `Error: ${error.message}`;
  }
}

function goToHistory() {
  window.location.href = '/history.html';
}

window.convertCurrency = convertCurrency;
window.exchangeRate = exchangeRate;
window.goToHistory = goToHistory;