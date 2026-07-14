async function convertTemperature() {
      // Gets the value from the input fields on the page instead of Typing them
      const API_URL = 'http://localhost:8081/api/temperatures/convert';
      const API_KEY = 'SUPER-SECRET-DEV-KEY-123' // Base URL for the API endpoint;

      const temperature = document.getElementById('tempValue').value;
      const fromUnit = document.getElementById('tempUnit').value;
      const outputArea = document.getElementById('outputBox');

     if (!temperature) {
        outputArea.textContent = ' Error !!! Please enter a valid temperature value.';
        return;
      }

      outputArea.textContent = 'Converting...';

      try {
        // Fetch API will send request to the Java Back-end server
        const response = await fetch(`${API_URL}?value=${temperature}&unit=${fromUnit}`,{
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
                         `Input: ${data.inputTemperature} ${data.inputUnit}\n` +
                         `Output: ${data.outputTemperature} ${data.outputUnit}\n` +
                         `Timestamp: ${data.timestamp}`;

} catch (error) {
  outputArea.textContent = `Error: ${error.message}`;
}
    }