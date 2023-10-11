const fs = require("fs")
const path = require("path")
let logDir = "log"

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

function logAPICalls(req, res, next) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFileName = path.join(logDir, `log_${timestamp}.txt`);

    // Create a log entry with request information
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}\n`;

    // Append the log entry to the log file
    fs.appendFileSync(logFileName, logEntry, 'utf-8');

    next();
}

module.exports = logAPICalls;
