import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {EmailListItemComponent} from '../email-list-item/email-list-item.component';
import {Email} from '../../../models/email';
import {EmailService} from '../../../services/email.service';
import {LoginService} from '../../../services/login.service';
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '../../../snackbar/snackbar.component';
import {timeout} from 'rxjs';

@Component({
  selector: 'app-email-index',
  imports: [
    RouterOutlet,
    NgForOf,
    EmailListItemComponent,
    RouterLink,
    NgIf,
    SnackbarComponent,
    NgClass
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
  fetchedMails: Email[] = [];
  selectedEmail: Email | null = null;
  snackBar = inject(MatSnackBar);
  stack: Email[] = [];
  lastDeletedMailIndex: number = 0;
  emailsToDisable: Email[] = [];

  @ViewChild('container', {static: true}) container!: ElementRef;
  snackBarNumber: number = 0;
  oldSnackBarNumber: number = 0;



  constructor() {
    this.title = this.route.snapshot.title;
  }

  ngOnInit(): void {
    this.snackBar._openedSnackBarRef?.afterDismissed().subscribe(event => this.stack = [])
    const urlSegments = this.router.url.split("/");
    if (urlSegments[urlSegments.length - 1] == "deletedItems") {
      this.fetchDeletedEmails();
    } else {
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
    if (this.router.url.split("/").indexOf("fitts-law") != -1) {
      this.openRandomSnackbar()
      this.disableMail(deletedMail);
    } else {
      this.openSnackBar("Gelöscht", "Rückgängig");
    }

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
      if (this.router.url.split("/").indexOf("fitts-law") != -1) {
        this.fetchedMails = this.fetchedMails.slice(0, 9);
      }
    });
  }

  openRandomSnackbar() {
    if (this.oldSnackBarNumber > 0){
      this.snackBarNumber = this.oldSnackBarNumber+=1;
    }else{
      this.snackBarNumber++;
    }

    this.oldSnackBarNumber = this.snackBarNumber;
    const timeout = setTimeout(() => {
      this.snackBarNumber = 0;
    }, 2000)
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

   undoDeletingMail() {
    this.fetchedMails.splice(this.lastDeletedMailIndex, 0, this.stack[this.stack.length - 1]);
    this.stack.pop();
  }

  private disableMail(deletedMail: Email) {
    this.emailsToDisable.push(deletedMail);
  }
  disable(email: Email){
    return this.emailsToDisable.indexOf(email) != -1;

  }
}
