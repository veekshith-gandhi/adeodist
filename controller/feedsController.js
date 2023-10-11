const db = require("../db");

const createFeed = async (req, res) => {
    try {
        const { id, name, url, description } = req.query
        // Checking for super-admin and admin
        if (req.auth.role !== 'super-admin' && req.auth.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        if (id && name && url && description) {
            db.run(`INSERT INTO feed (id , name , url , description) VALUES (?,?,?,?)`, [id, name, url, description], (err) => {
                if (err) return res.status(501).json({ msg: "DB insert failed", err: err })
                return res.status(201).json({ msg: "DB insert Success" })
            });
        } else {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to create feed' });
    }
}


const editFeed = async (req, res) => {

    try {
        const { name, url, description } = req.query
        const { id } = req.params

        if (req.auth.role !== 'super-admin' && req.auth.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        //Validation
        if (!name || !url || !description) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (name && url && description) {
            db.run(`UPDATE feed SET name=?, url=?, description=? WHERE id=?`, [name, url, description, id], (err) => {
                if (err) return res.status(501).json({ msg: "DB insert failed", err: err })
                return res.status(201).json("DB insert Success")
            });
        } else {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to edit feed' });
    }
}


const deletFeed = (req, res) => {
    try {

        const { id } = req.params
        const feedId = id

        if (req.auth.role !== 'super-admin' && req.auth.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        if (!feedId) {
            return res.status(400).json({ error: 'Invalid feed ID' });
        }

        db.run('DELETE FROM feed WHERE id = ?', [feedId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete feed' });
            }
            res.status(200).json({ message: 'Feed deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delet feed' });
    }
}

const getFeed = (req, res) => {
    const { id } = req.params
    const feedId = id

    if (!feedId) {
        return res.status(400).json({ error: 'Invalid feed ID' });
    }

    db.get('SELECT * FROM feed WHERE id = ?', [feedId], (err, feed) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve feed' });
        }
        if (!feed) {
            return res.status(404).json({ error: 'Feed not found' });
        }
        res.status(200).json(feed);
    });

}

//admin provide feed access
const feedAccess = (req, res) => {

    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied.' });
    }

    const { userid, feedid, candelete } = req.query;
    console.log(req.query)
    // Validate that the user making this request is an Admin
    if (req.auth.role === 'admin') {
        // Insert the access control entry
        db.run('INSERT INTO AccessControl (userId, feedId, canDelete) VALUES (?, ?, ?)', [userid, feedid, candelete], (err) => {
            if (err) {
                res.status(400).send('Access control creation failed.');
            } else {
                res.status(201).send('Access control created successfully.');
            }
        });
    } else {
        res.status(403).send('Access denied. You are not an Admin.');
    }

}
const getAllFeed = (req, res) => {
    const userRole = req.auth.role;
    const userId = req.auth.id;

    if (userRole === 'super-admin') {
        // Super Admin has access to all feeds
        db.all('SELECT * FROM Feed', (err, feeds) => {
            if (err) {
                res.status(500).send('Internal Server Error.');
            } else {
                res.json({ data: feeds });
            }
        });
    } else if (userRole === 'admin') {
        // Admin can access feeds they have access to
        db.all('SELECT f.* FROM feed f JOIN AccessControl ac ON f.id = ac.feedId WHERE ac.userId = ?', [userId], (err, feeds) => {
            if (err) {
                res.status(500).send('Internal Server Error.');
            } else {
                res.json(feeds);
            }
        });
    } else if (userRole === 'basic') {
        // Basic users can only read feeds they have access to
        db.all('SELECT f.* FROM Feed f JOIN AccessControl ac ON f.id = ac.feedId WHERE ac.userId = ? AND ac.canDelete = 0', [userId], (err, feeds) => {
            if (err) {
                res.status(500).send('Internal Server Error.');
            } else {
                res.json(feeds);
            }
        });
    }

}

module.exports = { createFeed, editFeed, deletFeed, getFeed, getAllFeed, feedAccess }
