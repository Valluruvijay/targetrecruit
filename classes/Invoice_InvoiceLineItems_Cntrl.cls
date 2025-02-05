public class Invoice_InvoiceLineItems_Cntrl {
    @AuraEnabled(cacheable=true)
    public static Map<Id, List<Invoice_Line_Item__c>> getInvoicesWithLineItems() {
        Map<Id, List<Invoice_Line_Item__c>> invoiceMap = new Map<Id, List<Invoice_Line_Item__c>>();

        
        List<Invoice__c> invoices = [SELECT Id, Name FROM Invoice__c];

        
        List<Invoice_Line_Item__c> lineItems = [SELECT Id, Name, Invoice__c,Invoice__r.Name FROM Invoice_Line_Item__c WHERE Invoice__c IN :invoices];

        
        for (Invoice__c invoice : invoices) {
            invoiceMap.put(invoice.Id, new List<Invoice_Line_Item__c>());
        }
        for (Invoice_Line_Item__c lineItem : lineItems) {
            if (invoiceMap.containsKey(lineItem.Invoice__c)) {
                if (lineItem.Name != null) {
                    invoiceMap.get(lineItem.Invoice__c).add(lineItem);
                }
            }
        }

        return invoiceMap;
    }

    @AuraEnabled(cacheable=true)
    public static List<Invoice_Line_Item__c> getInvoiceLineItems(Id invoiceId, Integer offset) {
        return [SELECT Id, Name FROM Invoice_Line_Item__c WHERE Invoice__c = :invoiceId LIMIT 10 OFFSET :offset];
    }
}