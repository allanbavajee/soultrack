import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { plain, hash } = req.body;

  const valid = await bcrypt.compare(plain, hash);
  res.status(200).json({ valid });
}
