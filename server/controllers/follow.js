const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const { followee_id, follower_id } = req.params
    const queryCheckForFollow = `SELECT * FROM follows
    WHERE followee_id = '${followee_id}' && follower_id = '${follower_id}'`
    sql.query(queryCheckForFollow, (err, result) => {
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
    const queryGetFollowsCount = `SELECT COUNT(*) AS followers_count FROM follows
    WHERE followee_id = '${user_id}'
    GROUP BY followee_id`
    sql.query(queryGetFollowsCount, (err, result) => {
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

exports.set = (req, res) => {
    const { followee_id, follower_id } = req.body
    const queryCheckForFollow = `SELECT * FROM follows
    WHERE followee_id = '${followee_id}' && follower_id = '${follower_id}'`
    sql.query(queryCheckForFollow, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForFollow' })
        } else {
            if (result.length > 0) {
                const queryUnfollow = `DELETE FROM follows
                WHERE followee_id = '${followee_id}' && follower_id = '${follower_id}'`
                sql.query(queryUnfollow, (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryUnfollow' })
                    } else {
                        res.send({ success: true, unfollowed: true })
                    }
                })
            } else {
                const queryFollow = `INSERT INTO follows (followee_id, follower_id)
                VALUES('${followee_id}', '${follower_id}')`
                sql.query(queryFollow, (err, result) => {
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