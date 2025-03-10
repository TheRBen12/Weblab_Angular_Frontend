import {Email} from '../../../../models/email';

export const deletedEmails: Email[] = [];
export const emails: Email[] = [
  {
    deletedAt: Date.now(),
    id: 1,
    user: 1,
    subject: "Projektstatus",
    body: "Das Projekt ist zu 80% abgeschlossen.",
    date: "Mi, 6.3",
    receiver: "teamlead@example.com",
    sender: "dev@example.com"
  },

];
