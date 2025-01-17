// Function to connect to a Bluetooth device
async function connectToDevice() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'], // Required to access battery data
    });
    updateOutput(`Device selected: ${device.name}`);
    return device;
  } catch (error) {
    updateOutput(`Error: ${error.message}`);
  }
}

// Function to connect to the GATT server
async function connectToServer(device) {
  try {
    const server = await device.gatt.connect();
    console.log('', server);
    updateOutput(`Connected to GATT server.`);
    return server;
  } catch (error) {
    updateOutput(`Error: ${error.message}`);
  }
}

// Function to retrieve the battery level
async function getBatteryLevel(server) {
  console.log('server::', server);
  try {
    const service = await server.getPrimaryService('battery_service');
    const characteristic = await service.getCharacteristic('battery_level');
    const value = await characteristic.readValue();
    const batteryLevel = value.getUint8(0); // Read the first byte
    updateOutput(`Battery Level: ${batteryLevel}%`);
  } catch (error) {
    updateOutput(`Error: ${error.message}`);
  }
}

// Main function to handle the interaction
async function startBluetoothInteraction() {
  const device = await connectToDevice();
  if (device) {
    const server = await connectToServer(device);
    if (server) {
      await getBatteryLevel(server);
    }
  }
}

// Function to update the output section
function updateOutput(message) {
  const outputDiv = document.getElementById('output');
  outputDiv.textContent = message;
}

// Attach the main function to the button
document.getElementById('connectBtn').addEventListener('click', startBluetoothInteraction);
