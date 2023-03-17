public with sharing class MaintenanceRequestHelper extends TriggerHandler {
    public override void beforeUpdate() {
        Map<Id, Case> casesForUpdate = (Map<Id,Case>)trigger.newMap;
        List<Case> casesForCreation = new List<Case>();
        Set<Id> equipmentsSet = new Set<Id>();
        Map<Integer, Case> OldCases = new  Map<Integer, Case>();
        Map<Integer, Case> NewCases = new  Map<Integer, Case>();
        Integer numberOfCase= 0;
        List<Equipment_Maintenance_Item__c> junctionsForInsert = new List<Equipment_Maintenance_Item__c>();
        


        List<Equipment_Maintenance_Item__c> junctions= [
            SELECT Name,Equipment__c,Maintenance_Request__c
            FROM Equipment_Maintenance_Item__c 
            WHERE Maintenance_Request__c IN: casesForUpdate.keySet()
        ];

        for(Equipment_Maintenance_Item__c emi : junctions){
            equipmentsSet.add(emi.Equipment__c);
        }

        List<Product2> equipments = [
                    SELECT Name,Maintenance_Cycle__c,ProductCode,Cost__c,Current_Inventory__c,Lifespan_Months__c,Family
                    FROM Product2 
                    WHERE Id IN: equipmentsSet
                    ];

        for(Case caseff: casesForUpdate.values()){
            System.debug('caseffid: ' + caseff.id);
            if(caseff.status == 'Closed'&&(caseff.type == 'Repair' || caseff.type == 'Routine Maintenance')){
                Case c = new Case();
                Integer maintenanceTime= obtainMaintenanceTime(equipments);
                c.Date_Due__c = System.today();
                c.Date_Due__c = c.Date_Due__c.addDays(maintenanceTime);
                c.Status = 'New';
                c.Priority = 'Low';
                c.Origin = 'Web';
                c.Type = 'Routine Maintenance';
                c.Vehicle__c = caseff.Vehicle__c;
                c.Account =  caseff.Account;
                c.Contact =   caseff.Contact;
                OldCases.put(numberOfCase, caseff);
                NewCases.put(numberOfCase, c);
                numberOfCase++;
                }
            }
            insert NewCases.values();

            for(Integer i = 0; i<numberOfCase;i++){
                for (Equipment_Maintenance_Item__c oldEmi : junctions) {
                    if((OldCases.get(i)).id==oldEmi.Maintenance_Request__c){
                        Equipment_Maintenance_Item__c newEmi = new Equipment_Maintenance_Item__c();
                        newEmi= oldEmi.clone();
                        newEmi.Maintenance_Request__c = (NewCases.get(i)).id;
                        junctionsForInsert.add(newEmi);
                    }
                }
                

            }
            insert junctionsForInsert;




        }
  

    public static Integer obtainMaintenanceTime(List<Product2> equipments){
        Decimal maintenance_Time=365;
        for(Product2 product :equipments){
            if(maintenance_Time>product.Maintenance_Cycle__c){
                Maintenance_Time=product.Maintenance_Cycle__c;
            }             
        }
        return (Integer.valueOf(maintenance_Time));
    }


}



    
