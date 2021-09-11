const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.js');
const postRoutes = require('./routes/post.js');
const commentsRoutes = require('./routes/comments.js');
const path = require('path');
const app = express();
const { Sequelize, sequelize } = require('./models')

 async function main() {
   await sequelize.authenticate({ force:true })
 }

main()
try {
    sequelize.authenticate();
    console.log('Connecté à la base de données MySQL!');
  } catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
  }
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;