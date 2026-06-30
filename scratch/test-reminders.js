import { spawn } from 'child_process';

async function runTest() {
  console.log("Starting backend server process...");
  const server = spawn('node', ['server/index.js'], {
    env: { ...process.env, PORT: '3002' } // run on different port to avoid conflicts
  });

  server.stdout.on('data', (data) => {
    console.log(`[Server stdout] ${data.toString().trim()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`[Server stderr] ${data.toString().trim()}`);
  });

  // Wait 3 seconds for server to start
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    console.log("Sending request to /api/send-reminders...");
    const res = await fetch('http://localhost:3002/api/send-reminders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your-secret-api-key',
        'Content-Type': 'application/json'
      }
    });

    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (res.ok && data.thank_you && data.reminder_1day) {
      console.log("✅ Reminders endpoint test PASSED!");
    } else {
      console.log("❌ Reminders endpoint test FAILED!");
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    console.log("Stopping server...");
    server.kill();
  }
}

runTest();
