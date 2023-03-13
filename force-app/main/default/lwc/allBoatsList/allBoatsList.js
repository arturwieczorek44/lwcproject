import { LightningElement, wire } from 'lwc';
import getBoatTypesList from '@salesforce/apex/BoatDataService.getBoatTypesList';

export default class AllBoatsList extends LightningElement {
    boatTypes__c;
    error;


    @wire(getBoatTypesList)
    wiredBoatTypes({ error, data }) {
        if (data) {
            this.boatTypes__c = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.boatTypes__c = undefined;
        }
    }


    getBoatTypesClick() {
        this.wiredBoatTypes();
    }

}