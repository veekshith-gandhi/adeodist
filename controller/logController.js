const fs = require("fs")
const path = require("path")

const getLogs = (req, res) => {

    console.log("getlogs", req.auth)
    // Checking for super-admin
    if (req.auth.role !== 'super-admin') {
        return res.status(403).json({ message: 'Permission denied.' });
    }

    // Directory to store log files
    const logDir = 'log';

    // Create the log directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Get the list of log files created within the last 5 minutes
    const now = new Date().getTime();
    const logs = fs.readdirSync(logDir).filter((file) => {
        console.log(file, "file")
        const filePath = path.join(logDir, file);
        const fileStat = fs.statSync(filePath);
        return now - fileStat.mtime.getTime() <= 5 * 60 * 1000;
    });

    const logContents = [];

    logs.forEach((file) => {
        const filePath = path.join(logDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        logContents.push({ fileName: file, content });
    });

    res.json(logContents);
}


module.exports = { getLogs }