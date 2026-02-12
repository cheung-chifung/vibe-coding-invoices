class InvoiceGenerator {
    constructor() {
        this.templates = {
            'anthropic': AnthropicTemplate
        };
    }

    getTemplate(serviceName) {
        return this.templates[serviceName];
    }

    generatePreview(serviceName, data) {
        const template = this.getTemplate(serviceName);
        if (!template) {
            throw new Error(`Template not found for service: ${serviceName}`);
        }

        return template.generatePreview(data);
    }

    exportToPDF(element, serviceName) {
        const template = this.getTemplate(serviceName);
        if (!template) {
            throw new Error(`Template not found for service: ${serviceName}`);
        }

        // Get the invoice document element (not the entire preview div)
        const invoiceDoc = element.querySelector('.invoice-document');
        if (!invoiceDoc) {
            throw new Error('Invoice document not found in preview');
        }

        // Open print dialog - this gives 100% consistency with preview
        // User can save as PDF from the print dialog
        window.print();

        return Promise.resolve();
    }

    // Helper to format plan names
    formatPlanName(planValue) {
        const planNames = {
            'max-20x': 'Max plan - 20x',
            'max-10x': 'Max plan - 10x',
            'pro': 'Pro plan',
            'team': 'Team plan'
        };

        return planNames[planValue] || planValue;
    }
}
