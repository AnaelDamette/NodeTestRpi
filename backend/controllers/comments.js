let models = require('../models');
const user = require('../models/user');

exports.createComments = (req, res, next) => {
    console.log('test create')
    let uuidPost = req.body.uuidPost
    let uuid = req.params.uuid
    models.post.findOne({
        where: { uuidPost }
    })
        .then(post => {
            if (post) {
                console.log(post.id)
                let postId = post.id
                console.log("test postId  " + postId)
                models.User.findOne({
                    where: { uuid }
                }).then(user => {
                    console.log("test models.comment")
                    console.log(req.body.message)
                    console.log(user.id)
                    console.log(postId)

                    models.comment.create({
                        message: req.body.message,
                        userId: user.id,
                        postId: postId
                    })
                        .then((newComment) => { res.status(201).json(newComment) })
                        .catch((err) => { res.status(500).json(err) })
                })
                    .catch((err) => { res.status(500).json(err) })

            } else { res.status(400).json(error) }

        }).catch((err) => res.status(500).json(err))
}


exports.deleteComments = (req, res, next) => {
    console.log("test delete")
    console.log(req.body.uuidComment)
    let userIsAdmin = req.body.userIsAdmin;
    let uuidComment = req.body.uuidComment;
    let uuid = req.params.uuid;

    models.comment.findOne({
        include: [{
            model: models.User, as: 'user',
        }],
        where: { uuidComment }
    })
        .then(comment => {
            console.log("j'ai trouvé le commentaire")
            console.log(comment.user.uuid, "test comment.user.uuid")
            if ( comment && (userIsAdmin == 1 || comment.user.uuid == uuid)) {
                models.comment.destroy({
                    where: { uuidComment }
                })
                    .then(() => res.end())
                    .catch((err => res.status(500).json(err)))
            }
        })
        .catch((err => res.status(500).json(err)))
}
