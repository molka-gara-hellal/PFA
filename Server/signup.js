import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const db = await connectToDatabase();
    const users = db.collection('users');  // Collection pour les users

    const { firstname, lastname, email, password, role } = req.body;

    // Vérifie si email existe déjà
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Insère l'utilisateur (hash le password en prod avec bcrypt !)
    const result = await users.insertOne({
      firstname,
      lastname,
      email,
      password,  // À sécuriser
      role,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Inscription réussie !', id: result.insertedId });
  } catch (error) {
    console.error('Erreur DB :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}