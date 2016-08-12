import { Component, ElementRef, Renderer } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { Http, HTTP_PROVIDERS} from '@angular/http';

import template from './trello.view.html';
import {event, board, list, card} from './trello.interface';

@Component({
  selector: 'trello',
  template,
  providers: [HTTP_PROVIDERS],
})
export class TrelloComponent {
  draggingTask: card;
  newCard: card = {name:'',desc:''};
  creatingNewCard: boolean = false;
  showCard: boolean = false;
  boards: any = [];//[board];
  renderer: Renderer;
  listenMouseMove: Function;
  listenMouseUp: Function;
  isItClick: boolean;
  activeBoard: Object = {};
  landingColumn: list;
  linkToTrello: number = 0;
  landingPosition: number;
  globalTrelloUserToken: string;
  globalApiKey: string;

  constructor(elementRef: ElementRef, renderer: Renderer, private window: Window, public http: Http) {
    this.renderer = renderer;
  }

  onAuthorizeTrello (token?: string) {
    
    let authenticationSuccess = () => { 
      console.log('Successful authentication');
      this.onGetCardsInfo();
    };
    let authenticationFailure = () => { 
      this.linkToTrello = -1;
      console.log('Failed authentication');
    };

    window.Trello.authorize({
      type: 'popup',
      name: 'Getting Started Application',
      scope: {
        read: true,
        write: true },
      expiration: 'never',
      success: authenticationSuccess,
      error: authenticationFailure
    })

    this.globalTrelloUserToken = token;

  }

  onGetCardsInfo ()  {

    let getListSuccess = (boards) => {
      var boardOptions = {
        list_fields: ['name'],
        lists: 'open',
        fields: ['name', 'desc']
      };
      for (let board of boards) { // Putting getted boards to app's boards
        this.boards.push({
          id: board.id,
          name: board.name,
          desc: board.desc,
          lists: []
        })
        window.Trello.get(`/boards/${board.id}`, boardOptions, includeListsToBoard);
      }
    }

    let includeListsToBoard = ((gettedBoard) => {
      var listOptions = {
        card_fields: ['name','desc'],
        cards: 'open',
        board: true, 
        fields: ['name']
      };
      for(let board of this.boards) {
        if(board.id == gettedBoard.id) {
          for (let list of gettedBoard.lists) { // Setting getted lists by app's boards
            board.lists.push(list);
            window.Trello.get(`/lists/${list.id}`, listOptions, includeCardsToList);
          }
        }
      }
    })

    let includeCardsToList = ((gettedList) => {
      for(let board of this.boards) {
        if(board.id == gettedList.board.id) {
          for(let list of board.lists) { // Setting getted cards by app's lists
            if(list.id == gettedList.id) {
              list.cards = gettedList.cards;
            }
          }
        }
      }
      this.linkToTrello = 1;
      setTimeout( ()=> this.linkToTrello = 2, 5000)
    })

    window.Trello.get(`/members/me/boards/`, getListSuccess);
    
  }

  onCloseModal () {
    this.creatingNewCard = false;
    this.showCard = false;
  }

  oShowCard (card) {
    console.log('click');
    this.showCard = true;
    this.newCard = card;
  }

  onStartCreateNewCard (list) {
    this.creatingNewCard = true;
    this.newCard = {
      name: '',
      desc: '',
      list: list
    }
  }
  onCreateNewCard () {

    let createdCardSuccess = returnedCard => {
      console.log(returnedCard);
      this.newCard.list.cards.unshift({id: returnedCard.id, name: returnedCard.name, desc: returnedCard.desc});
      this.onCloseModal();
    }

    let newCard = {
      name: this.newCard.name, 
      desc: this.newCard.desc,
      idList: this.newCard.list.id,
      pos: 'top',
      due: new Date()
    };
    window.Trello.post('/cards/', newCard, createdCardSuccess);
  }

  onDragStart (card: card, list: list, e: event) {
    console.log('keydown');
    this.isItClick = true;
    setTimeout( ()=> this.isItClick = false, 300)
    this.draggingTask = card;
    card.dragging = true;
    card.posX = e.clientX;
    card.posY = e.clientY;
    card.visualX = 0;
    card.visualY = 0;

    this.listenMouseMove = this.renderer.listenGlobal('document', 'mousemove', (e: event) => {
      if (this.draggingTask.dragging) {
        card.visualX = e.clientX - card.posX;
        card.visualY = e.clientY - card.posY;
      }
    });

    this.listenMouseUp = this.renderer.listenGlobal('document', 'mouseup', (e: event) => {
      card.visualX = 0;
      card.visualY = 0;

      let operationSuccess = data => {
          console.log('Operation success');
      };

      if (this.landingColumn) {
        if(!this.isItClick){
          console.log('keyup');
          list.cards.splice(list.cards.indexOf(card),1);
          this.landingColumn.cards.splice(this.landingPosition, 0, this.draggingTask);
          window.Trello.put(`/cards/${this.draggingTask.id}/`, {idList: this.landingColumn.id}, operationSuccess);
        }
      }

      this.landingColumn = undefined;
      this.landingPosition = undefined;
      this.draggingTask = undefined;
      card.dragging = false;
      this.listenMouseMove();
      this.listenMouseUp();
      
    });

  }

  onDragMove (card: card, list: list, e: event) {
    if(this.draggingTask) {
      this.landingColumn = list;
      this.landingPosition = list.cards.indexOf(card);
    }
  }

}
