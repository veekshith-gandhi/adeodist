const db = require("../db");

const createFeed = async (req, res) => {
    try {
        const { id, name, url, description } = req.query
        // console.log(req.query)

        // Checking for super-admin and admin
        // if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Permission denied.' });
        // }

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

        // if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Permission denied.' });
        // }


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

        // if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Permission denied.' });
        // }

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

const getAllFeed = (req, res) => {

    db.all('SELECT * FROM feed', (err, feeds) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve feeds' });
        }
        res.status(200).json(feeds);
    });

}

module.exports = { createFeed, editFeed, deletFeed, getFeed, getAllFeed }
