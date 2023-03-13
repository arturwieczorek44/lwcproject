import { LightningElement,track,api } from 'lwc';

export default class ChildY extends LightningElement {
    @track trackParam="trackValue";
    @api apiParam ="apiValue";
    nonReactiveProp="nonReactiveProperty";


    handleparamValues(){
        this.trackParam="value changed for trackParam";
        this.apiParam="value changed for apiParam";
        this.nonReactiveProp="value changed for nonReactiveProp";
    }


}