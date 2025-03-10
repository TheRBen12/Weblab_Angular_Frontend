import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {EmailListItemComponent} from '../email-list-item/email-list-item.component';
import {Email} from '../../../../models/email';
import {EmailService} from '../../../../services/email.service';
import {LoginService} from '../../../../services/login.service';
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-index',
  imports: [
    RouterOutlet,
    NgForOf,
    EmailListItemComponent,
    RouterLink,
    NgIf
  ],
  templateUrl: './email-index.component.html',
  standalone: true,
  styleUrl: './email-index.component.css'
})
export class EmailIndexComponent implements OnInit {
  title: any;
  route = inject(ActivatedRoute);
  router = inject(Router);
  emailService = inject(EmailService);
  userService: LoginService = inject(LoginService);
  mails: Email[] = [];
  fetchedMails: Email[] = [];
  selectedEmail: Email | null = null;
  snackBar = inject(MatSnackBar);
  stack: Email[] = [];
  lastDeletedMailIndex: number = 0;
  private snackBarRef: any;
  mailWasDeleted: boolean = false;

  constructor() {
    this.title = this.route.snapshot.title;
  }

  ngOnInit(): void {

    this.snackBar._openedSnackBarRef?.afterDismissed().subscribe(event => this.stack = [])
    const urlSegments = this.router.url.split("/");
    if(urlSegments[urlSegments.length - 1] == "deletedItems"){
      this.fetchDeletedEmails();
    }else{
      this.fetchMails();
    }

  }


  deleteEmail(deletedMail: Email) {
    this.emailService.emitMailDeleted(deletedMail);
    deletedMail.user = this.userService.currentUser()?.id ?? 0;
    deletedMail.deletedAt = Date.now();
    this.stack.push(deletedMail);
    this.fetchedMails = this.fetchedMails.filter((mail, index) => {
      if (mail.id == deletedMail.id) {
        this.lastDeletedMailIndex = index;
      }
      return mail.id != deletedMail.id
    });
    this.openSnackBar("Gelöscht", "Rückgängig");
    // visualize input field

  }

  fetchDeletedEmails() {
    this.emailService.getDeletedEmails().subscribe((deletedEmail) => {
      this.fetchedMails = deletedEmail;
    });
  }

  fetchMails() {
    this.emailService.getMails().subscribe((mails) => {
      this.fetchedMails = mails;
    });
  }


  isDeleted() {
    const urlSegments = this.router.url.split("/");
    return urlSegments[urlSegments.length - 1] == "deletedItems";
  }

  openSnackBar(message: string, action: string) {
    const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = this.snackBar.open(message, action, {duration: 6000});
    snackBarRef.onAction().subscribe((event) => {
      this.undoDeletingMail();
    });
    snackBarRef.afterDismissed().subscribe((event) => {
      if (this.stack.length > 0) {
        this.emailService.saveDeletedEmail(this.stack[this.stack.length - 1]).subscribe()
      }
    })
  }

  private undoDeletingMail() {
    this.fetchedMails.splice(this.lastDeletedMailIndex, 0, this.stack[this.stack.length - 1]);
    this.stack.pop();
  }
}
