trigger MaintenanceRequest on Case (before update,after update) {
    new MaintenanceRequestHelper().run();

}