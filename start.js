const { execSync, spawn } = require("child_process");
const readline = require("readline");
const os = require("os");
const path = require("path");
const net = require("net");



function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close();
      resolve(false); // Port is available
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (os.platform() === 'win32') {
          try {
            const result = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf-8" });
            const lines = result.split("\n").filter(line => line.includes("LISTENING"));
            if (lines.length > 0) {
              const parts = lines[0].trim().split(/\s+/);
              resolve(parts[parts.length - 1]); // Get the PID
            }
          } catch {
            resolve(true);
          }
        } else {
          try {
            const result = execSync(`lsof -i :${port}`, { encoding: "utf-8" });
            const lines = result.split("\n");
            if (lines.length > 1) {
              const parts = lines[1].trim().split(/\s+/);
              resolve(parts[1]); // PID is in the second column
            }
          } catch {
            resolve(true);
          }
        }
      } else {
        reject(err);
      }
    });
  });
}

function killProcess(pid) {
  try {
    if (os.platform() === 'win32') {
      execSync(`taskkill /PID ${pid} /F`);
    } else {
      execSync(`kill -9 ${pid}`);
    }
    console.log(`Process ${pid} terminated.`);
  } catch (error) {
    console.error("Error terminating process:", error.message);
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer.toLowerCase());
  }));
}
function openFrontend() {
  // Resolving the absolute path to 'index.html' in the 'frontend' directory
  const frontendPath = path.resolve(__dirname, 'frontend', 'index.html');

  // Log the resolved path for debugging purposes
  console.log('Resolved frontend path:', frontendPath);

  // Convert backslashes to forward slashes and ensure no issues with UNC paths
  const fileUrl = `file://${frontendPath.replace(/\\/g, '/')}`;

  try {
    // Use a single command for all platforms
    switch (os.platform()) {
      case 'win32':
        execSync(`start "" "${fileUrl}"`);
        break;
      case 'darwin':
        execSync(`open "${fileUrl}"`);
        break;
      case 'linux':
        execSync(`xdg-open "${fileUrl}"`);
        break;
      default:
        console.log("Unsupported operating system for opening frontend");
    }
  } catch (error) {
    console.error("Error opening frontend:", error.message);
  }
}
async function checkIfServerIsRunning(port, retries = 10, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    const isServerRunning = await checkPort(port);
    if (isServerRunning === false) {
      return true;  // Server is running
    }
    console.log(`Waiting for the server to start... Attempt ${i + 1}`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return false;  // Server failed to start within the retry limit
}
async function startServer() {
  const port = 3000;

  try {
    const portInUse = await checkPort(port);

    if (portInUse) {
      console.log(`Port ${port} is already in use.`);
      const answer = await askQuestion("Do you want to terminate the process? (y/n): ");
      
      if (answer === "y" && typeof portInUse === 'string') {
        killProcess(portInUse);
      } else {
        console.log("Exiting...");
        process.exit(0);  // Exit early if user doesn't want to terminate the process
      }
    }

    console.log("Starting the server...");
    const serverProcess = spawn("node", ["backend/server.js"], {
      detached: true,
      stdio: "ignore"
    });
    
    serverProcess.unref(); // Allow process to run independently

    console.log("Server is starting...");

    // Wait for the server to actually start
    const serverStarted = await checkIfServerIsRunning(port);

    if (serverStarted) {
      console.log("Server started successfully!");
      console.log("Opening the frontend...");
      openFrontend();  // Frontend opened after server starts
    } else {
      console.error("Error: Server failed to start.");
      process.exit(1); // Ensure exit when server fails to start
    }

  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Handle errors properly
  }
}
startServer();








