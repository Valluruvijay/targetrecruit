import { LightningElement, track, wire } from 'lwc';
import getInvoicesWithLineItems from '@salesforce/apex/Invoice_InvoiceLineItems_Cntrl.getInvoicesWithLineItems';
import getInvoiceLineItems from '@salesforce/apex/Invoice_InvoiceLineItems_Cntrl.getInvoiceLineItems';

export default class Invoice_InvoiceLineItems_UI extends LightningElement {
    @track invoices = [];
    @track error;

    @wire(getInvoicesWithLineItems)
    wiredInvoices({ error, data }) {
        if (data) {
            console.log(data);
            this.invoices = Object.keys(data).map(invoiceId => {
                const lineItems = data[invoiceId];
                return {
                    Id: invoiceId,
                    Name: lineItems.length > 0 ? lineItems[0].Invoice__r.Name : '',
                    lineItems: [],
                    isExpanded: false,
                    hasMore: lineItems.length === 10,
                    offset: 0,
                    isSelected: false
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.invoices = undefined;
        }
    }


    loadMore(invoiceId) {
        const invoice = this.invoices.find(inv => inv.Id === invoiceId);

        getInvoiceLineItems({ invoiceId, offset: invoice.offset })
            .then(data => {
                invoice.lineItems = [...invoice.lineItems, ...data];
                invoice.hasMore = data.length === 10;
                invoice.offset += 10;
                this.invoices = [...this.invoices];
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleLoadMore(event) {
        const invoiceId = event.target.dataset.id;
        this.loadMore(invoiceId);
    }
    handleInvoiceClick(event) {

        const invoiceId = event.target.dataset.id;
        this.invoices = this.invoices.map(invoice => {
            if (invoice.Id === invoiceId) {
                invoice.isExpanded = !invoice.isExpanded;
                if (invoice.isExpanded && invoice.lineItems.length === 0) {
                    this.loadMore(invoiceId);
                }
            } else {
                invoice.isExpanded = false;
            }
            return invoice;
        });
    }
}
