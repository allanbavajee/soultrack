/* /pages/members.js */
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Members() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const { data } = await supabase.from('membres').select('*')
    setMembers(data)
  }

  const sendWhatsApp = (member) => {
    const assignee = member.assignee
    const message = `Bonjour ${assignee} 🌸, nous avons la joie d’accueillir ${member.nom} ${member.prenom} dans notre église.\nTéléphone: ${member.telephone}\nEmail: ${member.email}\nComment est-il venu: ${member.how_came}\nBesoins: ${member.besoins}\nAssigné à votre cellule: ${assignee}\nMerci de l’accueillir avec amour ! 🙏`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const getColor = (statut) => {
    switch(statut) {
      case 'nouveau': return 'bg-green-100 text-green-800'
      case 'veut rejoindre ICC': return 'bg-blue-100 text-blue-800'
      case 'a déjà mon église': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Liste des membres</h1>
      <div className="space-y-2">
        {members.map(m => (
          <div key={m.id} className={`p-3 rounded flex justify-between items-center ${getColor(m.statut)}`}>
            <div>
              <div>{m.nom} {m.prenom}</div>
              <div className="text-sm">Tel: {m.telephone}</div>
              <div className="text-sm">Assigné à: {m.assignee}</div>
            </div>
            {m.statut === 'veut rejoindre ICC' && (
              <button onClick={() => sendWhatsApp(m)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">WhatsApp</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
