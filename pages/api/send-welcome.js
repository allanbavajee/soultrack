// pages/api/send-welcome.js
import { createClient } from '@supabase/supabase-js';
import Twilio from 'twilio';

export default async function handler(req, res) {
  if (req.headers['x-scheduler-secret'] !== process.env.SCHEDULER_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );
  const twilioClient = Twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );

  try {
    const cutoff = new Date(Date.now() - 48*60*60*1000).toISOString();
    const { data: members, error } = await supabase
      .from('members')
      .select('*')
      .eq('welcome_sent', false)
      .lte('date_premiere_visite', cutoff);

    if (error) throw error;

    let sent = 0;
    for (const m of members) {
      if (!m.phone_e164) continue;

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${m.phone_e164}`,
        body: `Bonjour ${m.first_name}, nous sommes heureux que tu aies visité notre église 🙏 — SoulTrack`
      });

      await supabase.from('members').update({ welcome_sent: true }).eq('id', m.id);
      await supabase.from('suivis').insert([{
        member_id: m.id,
        type_action: 'message',
        commentaire: 'Message de bienvenue automatique envoyé (48h)'
      }]);

      sent++;
    }

    res.json({ sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
