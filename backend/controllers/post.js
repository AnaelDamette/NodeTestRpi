
let models = require('../models');
const fs = require('fs');




exports.createMsg = (req, res, next) => {
    let uuid = req.params.uuid;
    console.log("Voici l'uuid : " + uuid)
    models.User.findOne({
        where: { uuid }
    })
        .then(user => {
            if (user) {
                let message = req.body.message;
                let titre = req.body.titre;
                console.log(req.body)
                if (req.file) {
                    attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } else {
                    attachmentURL == null
                };
                if (message == 'null' && titre == 'null' && attachmentURL == null) {
                    res.status(400).json({ error: "Rien à publier" })
                }
                else {
                    console.log("tentative de post")
                    models.post.create({
                        message: message,
                        attachement: attachmentURL,
                        titre: titre,
                        userId: user.id
                    })
                        .then((newPost) => {
                            res.status(201).json(newPost)
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                        })
                }
            }
            else {
                res.status(400).json(error);
            }
        })
        .catch(error => res.status(501).json(error));
}
exports.listMsg = (req, res, next) => {
    console.log("Je suis bien dans la fonction listMsg")
    models.post.findAll({
        include: [
            { model: models.User, as: 'user' },
            { model: models.comment, as: 'comment', include: [{ model: models.User, as: 'user' }], order: [['createdAt', 'DESC']] }
        ],
        order: [['createdAt', 'DESC']]
    })
        .then(posts => {
            if (posts) {
                res.status(200).json(posts)
            } else {
                res.status(404).json({ error: 'Pas de post à afficher' })
            }
        })
        .catch(err => res.status(500).json(err))
}
exports.listMesMsg = (req, res, next) => {
    let uuid = req.params.uuid;
    console.log("Je suis bien dans la fonction listMesMsg " + uuid)
    models.User.findOne({
        include: [{
            model: models.post, as: 'post',
        }],

        where: { uuid },
        order: [['createdAt', 'DESC']],

    })
        .then(posts => {
            if (posts) {
                res.status(200).json(posts)
            } else {
                res.status(404).json({ error: 'Pas de post à afficher' })
            }
        })
        .catch(err => res.status(500).json(err))
}




exports.deleteMsg = (req, res, next) => {
    let userIsAdmin = req.body.userIsAdmin;
    let uuidPost = req.body.uuidPost;
    let uuid = req.params.uuid

    models.post.findOne({
        include: [{
            model: models.User, as: 'user',
        }],
        where: { uuidPost: uuidPost },

    })
        .then(post => {
            if (post && (userIsAdmin == 1 || post.user.uuid == uuid)) {

                if (post.attachement) {
                    const filename = post.attachement.split('/images/')[1];
                    console.log("Ici je supprime le file name  " + filename)
                    fs.unlink(`images/${filename}`, () => {
                        models.comment.destroy({
                            where: { postId: post.id }
                        }).then(() => {
                            models.post.destroy({
                                include: [{ model: models.comment, as: "comment" }],
                                where: { uuidPost }
                            })
                                .then(() => res.end())
                                .catch(err => res.status(500).json(err))
                        })
                            .catch(err => res.status(500).json(err))

                    })
                }
                else {
                    console.log("je suis bien dans le else et j'ai toujours : " + req.body.uuidPost)
                    models.comment.destroy({
                        where: { postId: post.id }
                    }).then(() => {
                        models.post.destroy({
                            include: [{ model: models.comment, as: "comment" }],
                            where: { uuidPost }
                        })
                            .then(() => res.end())
                            .catch(err => res.status(500).json(err))
                    })
                        .catch(err => res.status(500).json(err))
                }



            }
            else { res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
        })
        .catch(error => res.status(500).json(error));
}


exports.updateMsg = (req, res, next) => {

    //récupération de l'id du demandeur pour vérification
    let userOrder = req.body.userOrder;
    let uuidPost = req.body.uuidPost;
    console.log("je test à l'entrée de updateMsg  uuidPost  " + uuidPost + " userOrder  " + userOrder)

    models.post.findOne({
        include: [{
            model: models.User, as: 'user',
        }],
        where: { uuidPost: uuidPost }
    })

        .then(post => {
            console.log(post.user.uuid + "  je test l'userr uuid" + (post && (post.user.uuid == userOrder)))
            console.log(req.body.newTitre)
            console.log("uuidPost =  " + uuidPost)

            if (post && (post.user.uuid == userOrder)) {
                if (post.attachement != req.body.image) {
                    const filename = post.attachement.split('/images/')[1];
                    console.log("Ici je supprime le file name  " + filename)
                    fs.unlink(`images/${filename}`, () => {
                        attachementURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        console.log("image bien supprimé" + attachementURL)
                        models.post.update(
                            {
                                titre: req.body.newTitre,
                                message: req.body.newMessage,
                                attachement: attachementURL
                            },
                            { where: { uuidPost: uuidPost } }
                        )
                            .then(() => res.end())
                            .catch(err => res.status(500).json(err))

                    })


                } else {
                    console.log('suis-je dedans ? ')
                    attachementURL = post.attachement
                    models.post.update(
                        {
                            titre: req.body.newTitre,
                            message: req.body.newMessage,
                            attachement: attachementURL
                        },
                        { where: { uuidPost: uuidPost } }
                    )
                        .then(() => res.end())
                        .catch(err => res.status(500).json(err))
                }

            } else {
                res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce post' })
            }
        }
        )
        .catch(error => res.status(500).json(error));

}