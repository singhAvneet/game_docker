var express = require('express');
var router = express.Router();

/* GET game page. */
router.get('/', function(req, res, next) {
  res.render('game.html');
});

module.exports = router;
// router.get('/', (req, res) => {
//     res.sendFile('index.html', {
//       root: 'yourPathToIndexDirectory'
//     });
//  });