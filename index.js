const express = require('express');
const bodyParser = require('body-parser');
// Module JSONWEBTOKEN, l module hetha bch ykhalina nasen3ou des token d'acces t3awnouna bch naarfou est ce que l'utilisateur est authentifié wala lé
var jwt = require('jsonwebtoken');

//Module cookie-parser will help us extract data from cookies, in our case we are going to extract the token

const cookieParser = require('cookie-parser');
const app = express();

const port = 8080;

// app .use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// middlewares

// 1 . Ce middleware permet de verifier si l'utilisateur est login ou non,
//si oui le serveur va afficher la page damander
//sinon l'utilisateur va etre rediriger vers la page login
//Remarque : naguez partie l middleware kamel a9ra l be9i w mba3ed arj3elha
const authenticateJWT = (req, res, next) => {
  console.log(req.cookies);
  // we are going to extract the cookie to verify if the user is 'authentifié' wala lé
  const token = req.cookies['token'];
  if (token) {
    // fonction tkhalina on verifie si le token est valide ou non, deja nafs secret hatina elli aamalna bih signature
    jwt.verify(token, 'secretstring', (err, user) => {
      if (err) {
        console.log('unothorized');
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    return res.redirect('/');
  }
};

// routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

app.get('/protected', authenticateJWT, (req, res) => {
  res.sendFile(__dirname + '/view/protected.html');
});

app.get('/public', (req, res) => {
  res.sendFile(__dirname + '/view/public.html');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  // verifier si email est password correct
  const correctEmail = 'admin@gmail.com'; // supposé njibou ml database
  const correctpassword = '123654789'; // supposé hashé w njibouh ml base de donnée

  if (email === correctEmail && password === correctpassword) {
    //User authentified, we are now going to create a token for this user so that we can open a connection session
    var token = jwt.sign(
      {
        email: email,
        // id, role , nom_prenom ....
      },
      'secretstring',
      { expiresIn: 100000 }
    );
    // generalement fi maa l email nhotou l id mtaa user w role mte3ou w barcha hajet ndakhlouhom fil token
    // secretstring hethika c'est une chaine de caracteres secret naamlou biha signature mtaa token
    res.cookie('token', token);
    // hatina token fil cookie mtaa browser bch ki nest7a9ouh fi blasa okhra fi west l app najmou nestaamlouh
    res.redirect('/protected');
  } else {
    console.log('false credantials');
  }
});

app.listen(port, () => {
  console.log(`Listning on http://localhost:${port}`);
});
