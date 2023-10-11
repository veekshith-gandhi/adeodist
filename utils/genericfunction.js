const path = require('path');
const fs = require("fs")

// Directory to store log files
const logDir = 'log';

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Function to create a new log file
const createLog = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFileName = path.join(logDir, `log_${timestamp}.txt`);
    fs.writeFileSync(logFileName, 'New log entry', 'utf-8');
    console.log(`Created new log file: ${logFileName}`);
}

// Function to delete log files older than 30 minutes
const deleteOldLogs = () => {
    const now = new Date().getTime();
    fs.readdirSync(logDir).forEach((file) => {
        const filePath = path.join(logDir, file);
        const fileStat = fs.statSync(filePath);
        console.log("fileStat", fileStat)
        if (now - fileStat.mtime.getTime() > 30 * 60 * 1000) {
            fs.unlinkSync(filePath);
            console.log(`Deleted old log file: ${filePath}`);
        }
    });
}


module.exports = { createLog, deleteOldLogs }