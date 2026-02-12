// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const generator = new InvoiceGenerator();

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDate').value = today;
    document.getElementById('dueDate').value = today;

    // Get form elements
    const generateBtn = document.getElementById('generateBtn');
    const previewDiv = document.getElementById('preview');

    // Form fields
    const fields = {
        service: document.getElementById('service'),
        documentType: document.getElementById('documentType'),
        amount: document.getElementById('amount'),
        currency: document.getElementById('currency'),
        planType: document.getElementById('planType'),
        issueDate: document.getElementById('issueDate'),
        dueDate: document.getElementById('dueDate'),
        paymentMethod: document.getElementById('paymentMethod'),
        cardLast4: document.getElementById('cardLast4'),
        billToName: document.getElementById('billToName'),
        billToEmail: document.getElementById('billToEmail'),
        billToAddress: document.getElementById('billToAddress'),
        billToCity: document.getElementById('billToCity'),
        billToState: document.getElementById('billToState'),
        billToZip: document.getElementById('billToZip'),
        billToCountry: document.getElementById('billToCountry')
    };

    // Validate card last 4 digits
    fields.cardLast4.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    // Collect form data
    function getFormData() {
        return {
            documentType: fields.documentType.value,
            amount: parseFloat(fields.amount.value) || 0,
            currency: fields.currency.value,
            planType: generator.formatPlanName(fields.planType.value),
            issueDate: fields.issueDate.value,
            dueDate: fields.dueDate.value,
            paymentMethod: fields.paymentMethod.value,
            cardLast4: fields.cardLast4.value,
            billToName: fields.billToName.value,
            billToEmail: fields.billToEmail.value,
            billToAddress: fields.billToAddress.value,
            billToCity: fields.billToCity.value,
            billToState: fields.billToState.value,
            billToZip: fields.billToZip.value,
            billToCountry: fields.billToCountry.value
        };
    }

    // Validate form
    function validateForm(data) {
        const errors = [];

        if (data.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }

        if (!data.issueDate) {
            errors.push('Issue date is required');
        }

        if (!data.dueDate) {
            errors.push('Due date is required');
        }

        if (data.cardLast4.length !== 4) {
            errors.push('Card last 4 digits must be exactly 4 digits');
        }

        if (!data.billToName.trim()) {
            errors.push('Bill to name is required');
        }

        if (!data.billToEmail.trim() || !data.billToEmail.includes('@')) {
            errors.push('Valid email is required');
        }

        return errors;
    }

    // Generate and preview invoice
    generateBtn.addEventListener('click', () => {
        const serviceName = fields.service.value;
        const formData = getFormData();

        // Validate
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        try {
            // Generate preview
            const previewHTML = generator.generatePreview(serviceName, formData);
            previewDiv.innerHTML = previewHTML;

            // Add print/download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn-primary';
            downloadBtn.textContent = 'Print / Save as PDF';
            downloadBtn.style.marginTop = '20px';
            downloadBtn.addEventListener('click', async () => {
                try {
                    await generator.exportToPDF(previewDiv, serviceName);
                } catch (error) {
                    console.error('Error opening print dialog:', error);
                    alert('Failed to open print dialog. Please try again.');
                }
            });

            previewDiv.appendChild(downloadBtn);

            // Scroll to preview
            previewDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('An error occurred while generating the invoice. Please check the console for details.');
        }
    });

    // Auto-preview on Enter key
    Object.values(fields).forEach(field => {
        field.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generateBtn.click();
            }
        });
    });
});
