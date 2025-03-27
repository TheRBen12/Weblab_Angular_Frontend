import {inject, Injectable, signal, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Email} from '../models/email';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  http: HttpClient = inject(HttpClient);
  deletedMailSubscription = new BehaviorSubject<{mail: Email, position: number} | null>(null);
  undoEventSubscription: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null)

  constructor() {
  }

  saveDeletedEmail(email: Email): Observable<Email> {
    return this.http.post<Email>("https://localhost:7147/api/email/new", email)
  }


  getDeletedEmails(): Observable<Email[]> {
    return this.http.get<Email[]>("https://localhost:7147/api/email/deleted/all")
  }

  getMails() {
    return this.http.get<Email[]>("https://localhost:7147/api/email/mails/all")
  }

  getDeletedMailSubscripition() {
    return this.deletedMailSubscription.asObservable();
  }
  emitMailDeleted(data: any){
    this.deletedMailSubscription.next(data);
  }

  emitUndoEvent(emailIndex: number){
    this.undoEventSubscription.next(emailIndex);
  }
  getUndoEventSubscription() {
    return this.undoEventSubscription.asObservable();
  }
}
