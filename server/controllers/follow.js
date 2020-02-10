const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const { followee_id, follower_id } = req.params
    const placeholder = [{ followee_id }, { follower_id }]
    const queryCheckForFollow = `SELECT * FROM follows
    WHERE ? && ?`
    sql.query(queryCheckForFollow, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForFollow' })
        } else {
            if (result.length > 0) {
                res.send({ success: true, isFollowing: true })
            } else {
                res.send({ success: true, isFollowing: false })
            }
        }
    })
}

exports.getCountByUser = (req, res) => {
    const user_id = req.params.id
    const placeholder = { followee_id: user_id }
    const queryGetFollowsCount = `SELECT COUNT(*) AS followers_count FROM follows
    WHERE ?
    GROUP BY followee_id`
    sql.query(queryGetFollowsCount, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetFollowsCount' })
        } else {
            if (result.length === 0) {
                res.send({ success: true, followersCount: 0 })
            } else {
                res.send({ success: true, followersCount: result[0].followers_count })
            }
        }
    })
}

exports.getFollowedUsers = (req, res) => {
    const user_id = req.params.id
    const placeholder = { follower_id: user_id }
    const queryGetFollowedUsers = `SELECT users.id, users.first_name, users.last_name, users.image
    FROM follows JOIN users ON users.id = followee_id
    WHERE follows.?`
    sql.query(queryGetFollowedUsers, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetFollowedUsers' })
        } else {
            res.send({ success: true, followedUsers: result })
        }
    })
}

exports.set = (req, res) => {
    const { followee_id, follower_id } = req.body
    const placeholder = [{ followee_id }, { follower_id }]
    const queryCheckForFollow = `SELECT * FROM follows
    WHERE ? && ?`
    sql.query(queryCheckForFollow, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForFollow' })
        } else {
            if (result.length > 0) {
                const placeholder2 = [{ followee_id }, { follower_id }]
                const queryUnfollow = `DELETE FROM follows
                WHERE ? && ?`
                sql.query(queryUnfollow, [...placeholder2], (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryUnfollow' })
                    } else {
                        res.send({ success: true, unfollowed: true })
                    }
                })
            } else {
                const placeholder3 = [followee_id, follower_id]
                const queryFollow = `INSERT INTO follows (followee_id, follower_id)
                VALUES(?, ?)`
                sql.query(queryFollow, [...placeholder3], (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryFollow' })
                    } else {
                        res.send({ success: true, followed: true })
                    }
                })
            }
        }
    })
}