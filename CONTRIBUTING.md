# Contributing to Mock Invoice Generator

Thank you for your interest in contributing! This document provides guidelines for adding new service templates.

## Adding a New Service Template

To add support for a new service (e.g., OpenAI, GitHub, Vercel), follow these steps:

### 1. Create a Template File

Create a new file in `src/templates/` named after the service (e.g., `openai.js`, `github.js`).

### 2. Template Structure

Your template should follow this structure:

```javascript
const YourServiceTemplate = {
    name: 'YourService',

    // Generate invoice number (customize based on service's format)
    generateInvoiceNumber() {
        // Return a realistic-looking invoice number
        return 'INV-' + Date.now();
    },

    // Generate receipt number (if applicable)
    generateReceiptNumber() {
        // Return a realistic-looking receipt number
        return 'REC-' + Date.now();
    },

    // Format date as needed for this service
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Generate HTML preview
    generatePreview(data) {
        // Return HTML string for preview
        return `
            <div class="invoice-header">
                <!-- Your invoice HTML here -->
            </div>
        `;
    },

    // Generate PDF
    generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add content to PDF
        doc.text('Your Invoice', 20, 20);

        // Save PDF
        doc.save('invoice.pdf');
    }
};
```

### 3. Register the Template

1. Add your template file to `index.html`:
```html
<script src="src/templates/yourservice.js"></script>
```

2. Add the template to the generator in `src/generator.js`:
```javascript
this.templates = {
    'anthropic': AnthropicTemplate,
    'yourservice': YourServiceTemplate  // Add this line
};
```

3. Add the service to the dropdown in `index.html`:
```html
<select id="service">
    <option value="anthropic">Anthropic (Claude API)</option>
    <option value="yourservice">Your Service</option>
</select>
```

### 4. Customize Plan Types (if needed)

If your service has specific plan types, you can add them to the plan dropdown or make them dynamic based on the selected service.

### 5. Test Your Template

1. Open `index.html` in a browser
2. Select your service from the dropdown
3. Fill in the form
4. Generate a preview and PDF
5. Verify the output looks realistic

## Design Guidelines

- **Realism**: Study real invoices from the service to match their style
- **Accuracy**: Use correct company information (address, contact info)
- **Clarity**: Make sure all text is readable in both preview and PDF
- **Consistency**: Follow the existing code style

## What to Include

- Company logo or branding (text-based)
- Invoice/Receipt number
- Dates (issue, due, paid)
- Company information (address, contact)
- Billing information
- Line items with descriptions
- Subtotal, tax (if applicable), total
- Payment information (for receipts)

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow the existing code structure
- Keep functions small and focused

## Testing

Before submitting a PR:

1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Verify PDF generation works correctly
3. Check that all form fields are properly used
4. Ensure the preview looks good on mobile devices

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b add-openai-template`)
3. Commit your changes (`git commit -m 'Add OpenAI invoice template'`)
4. Push to your fork (`git push origin add-openai-template`)
5. Open a Pull Request

## Questions?

If you have questions or need help, please open an issue on GitHub.

Thank you for contributing!
