//import fivestar static resource, call it fivestar

import fivestar from '@salesforce/resourceUrl/fivestar';
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
// add constants here
const ERROR_TITLE = 'Error loading five-star';
const ERROR_VARIANT = 'error';
const EDITABLE_CLASS = 'c-rating';
const READ_ONLY_CLASS = 'readonly c-rating';


export default class FiveStarRating extends LightningElement {
  //initialize public readOnly and value properties
  @api
  readOnly;
  @api
  value;

  editedValue;
  isRendered;

  //getter function that returns the correct class depending on if it is readonly
  get starClass() {
    return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  // Render callback to load the script once the component renders.
  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.loadScript();
    this.isRendered = true;
  }

  //Method to load the 3rd party script and initialize the rating.
  //call the initializeRating function after scripts are loaded
  //display a toast with error message if there is an error loading script
  loadScript() {
    // Tworzy tablicę dwóch obiektów Promise, każdy z nich reprezentuje jedną funkcję: 
    // loadScript() i loadStyle(). W obu funkcjach podajemy aktualny komponent 'this' i ścieżkę pliku JavaScript lub CSS.
    Promise.all([
      loadScript(this, fivestar + '/rating.js'), // Ładuje plik rating.js
      loadStyle(this, fivestar + '/rating.css') // Ładuje plik rating.css
    ]).then(() => {
      // Po pomyślnym załadowaniu obu plików inicjuje ocenianie przez wywołanie funkcji initializeRating().
      this.initializeRating();
    })
    .catch(error => {
      // W przypadku błędu ładowania plików tworzy obiekt toastu, który wyświetla komunikat o błędzie na ekranie.
      const toast = new ShowToastEvent({
        title: ERROR_TITLE, // Tytuł wiadomości o błędzie.
        message: error.message, // Komunikat o błędzie zwrócony przez funkcję Promise.
        variant: ERROR_VARIANT, // Rodzaj toastu, np. błąd, ostrzeżenie itp.
      });
      this.dispatchEvent(toast); // Wywołanie funkcji, która wyświetla toast na ekranie.
    });
  }

  initializeRating() {
    let domEl = this.template.querySelector('ul');
    let maxRating = 5;
    let self = this;
    let callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };
    this.ratingObj = window.rating(
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }

  // Method to fire event called ratingchange with the following parameter:
  // {detail: { rating: CURRENT_RATING }}); when the user selects a rating
  ratingChanged(rating) {     
    const ratingchangeEvent = new CustomEvent('ratingchange', {
      detail: {
        rating: rating
      }
    });
    this.dispatchEvent(ratingchangeEvent);    
  }
}