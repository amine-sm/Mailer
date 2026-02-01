const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Email 
const EMAIL_ENTREPRISE = 'entrepsire@gmail.com';

// Route API pour envoyer le message client
app.post('/api/contact', async (req, res) => {
    try {
        const {
            civilite,
            nomPrenom,
            email,
            entreprise,
            secteur,
            mobile,
            fixe,
            objet,
            message
        } = req.body;

        // Vérification des champs obligatoires
        if (!civilite || !nomPrenom || !email || !entreprise || !secteur || !mobile || !objet || !message) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
        }

        // Contenu de l'email
        const emailContent = `
Civilité: ${civilite}
Nom & Prénom: ${nomPrenom}
Email: ${email}
Entreprise: ${entreprise}
Secteur d'activité: ${secteur}
Numéro Mobile: ${mobile}
Tél. Fixe: ${fixe || 'N/A'}
Objet: ${objet}
Message: ${message}
`;

        // Transporteur Nodemailer (Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_ENTREPRISE,
                pass: 'Password' // mot de passe D'application
            }
        });

        const mailOptions = {
            from: email,
            to: EMAIL_ENTREPRISE,
            subject: `Contact Client: ${objet}`,
            text: emailContent

        };

        // Envoi de l'email
        await transporter.sendMail(mailOptions);

        // Réponse au client (pas le contenu du mail)
        res.status(200).json({ message: 'Votre message a été envoyé avec succès à l’entreprise !' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
    }
});

// Démarrer le serveur
const PORT = 3400;
app.listen(PORT, () => console.log(`API démarrée sur http://localhost:${PORT}`));
