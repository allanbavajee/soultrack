/* /pages/add-member.js */
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function AddMember() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    statut: 'nouveau',
    how_came: '',
    assignee: '',
    besoins: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('membres').insert([formData])
    if (error) alert('Erreur : ' + error.message)
    else alert('Membre ajouté avec succès')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-24"/>
      <h1 className="text-xl font-bold mb-4 text-center">Ajouter un nouveau membre</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nom" placeholder="Nom" onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="prenom" placeholder="Prénom" onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="telephone" placeholder="Téléphone" onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded"/>
        <select name="statut" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="nouveau">Nouveau</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="ancien">Ancien</option>
          <option value="visiteur">Visiteur</option>
          <option value="suivi">Suivi</option>
          <option value="inactif">Inactif</option>
        </select>
        <select name="assignee" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Assignée a :</option>
          <option value="Curepipe">Cellule de Curepipe</option>
          <option value="Bois Rouge">Cellule de Bois Rouge</option>
          <option value="Bambous">Cellule de Bambous</option>
          <option value="Rose Hill">Cellule de Rose Hill</option>
          <option value="Mon Gout">Cellule de Mon Gout</option>
          <option value="Eglise">Eglise</option>
        </select>
        <input name="how_came" placeholder="Comment est-il venu ?" onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="besoins" placeholder="Besoins de la personne" onChange={handleChange} className="w-full p-2 border rounded"/>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ajouter</button>
      </form>
    </div>
  )
}
