import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InstructionService {

  constructor() { }


  getRecallRecognitionPartOneInstructions(){
    return ["Finden Sie die Produktkategorie IT und Multimedia"]
  }
}
