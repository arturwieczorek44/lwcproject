import { LightningElement,track } from 'lwc';

export default class ParentVideo extends LightningElement {

    @track parentValue = "Second value";


    handleThirdChange() {
        this.parentValue = "Third Value";
    }
    handleSecondChange() {
        this.parentValue = "Second Value";
    }

    



}