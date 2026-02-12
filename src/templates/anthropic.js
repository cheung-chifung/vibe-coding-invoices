const AnthropicTemplate = {
    name: 'Anthropic',

    // Generate invoice number in Anthropic's format (e.g., KZMX2BID-0012)
    generateInvoiceNumber() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = Array.from({length: 8}, () =>
            letters[Math.floor(Math.random() * letters.length)]
        ).join('');
        const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        return `${randomLetters}-${randomNum}`;
    },

    // Generate receipt number in Anthropic's format (e.g., 2538-4623-0971)
    generateReceiptNumber() {
        const part1 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        const part2 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        const part3 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        return `${part1}-${part2}-${part3}`;
    },

    // Format date as "Month DD, YYYY"
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Generate service period (1 month from start date)
    getServicePeriod(startDate) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const formatShort = (date) => date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        return `${formatShort(start)} – ${formatShort(end)}, ${end.getFullYear()}`;
    },

    // Generate HTML preview (this will be used for both preview and PDF)
    generatePreview(data) {
        const invoiceNumber = this.generateInvoiceNumber();
        const receiptNumber = data.documentType === 'receipt' ? this.generateReceiptNumber() : null;
        const isReceipt = data.documentType === 'receipt';

        // Store invoice/receipt number for PDF filename
        this.lastInvoiceNumber = invoiceNumber;
        this.lastDocumentType = data.documentType;

        return `
            <div class="invoice-document">
                <div class="invoice-header">
                    <div>
                        <div class="invoice-title">${isReceipt ? 'Receipt' : 'Invoice'}</div>
                    </div>
                    <div class="invoice-logo">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 92.2 65" xml:space="preserve">
                            <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
                        </svg>
                    </div>
                </div>

                <div class="invoice-meta">
                    <div class="meta-row"><span class="meta-label">Invoice number</span><span class="meta-value">${invoiceNumber}</span></div>
                    ${isReceipt ? `<div class="meta-row"><span class="meta-label">Receipt number</span><span class="meta-value">${receiptNumber}</span></div>` : ''}
                    <div class="meta-row"><span class="meta-label">Date ${isReceipt ? 'paid' : 'of issue'}</span><span class="meta-value">${this.formatDate(data.issueDate)}</span></div>
                    ${!isReceipt ? `<div class="meta-row"><span class="meta-label">Date due</span><span class="meta-value">${this.formatDate(data.dueDate)}</span></div>` : ''}
                </div>

                <div class="invoice-parties">
                    <div class="party-section">
                        <h4>Anthropic, PBC</h4>
                        <p>548 Market Street</p>
                        <p>PMB 90375</p>
                        <p>San Francisco, California 94104</p>
                        <p>United States</p>
                        <p>support@anthropic.com</p>
                    </div>

                    <div class="party-section">
                        <h4>Bill to</h4>
                        <p>${data.billToName}</p>
                        <p>${data.billToAddress}</p>
                        <p>${data.billToCity}, ${data.billToState} ${data.billToZip}</p>
                        <p>${data.billToCountry}</p>
                        <p>${data.billToEmail}</p>
                    </div>
                </div>

                <div class="invoice-amount">
                    $${data.amount.toFixed(2)} ${data.currency} ${isReceipt ? 'paid' : 'due'} ${this.formatDate(isReceipt ? data.issueDate : data.dueDate)}
                </div>

                ${!isReceipt ? '<div class="pay-online-link">Pay online</div>' : ''}

                <div class="payment-address-box">
                    <p>While we prefer electronic payment methods,</p>
                    <p>any checks must be sent to the address below, NOT to our San Francisco office.</p>
                    <p class="separator">----------------------------</p>
                    <p class="payment-address-label">PAYMENT ADDRESS:</p>
                    <p>Anthropic, PBC</p>
                    <p>P.O. Box 104477</p>
                    <p>Pasadena, CA 91189-4477</p>
                </div>

                <table class="invoice-table no-page-break">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit price</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="plan-name">${data.planType}</div>
                                <div class="service-period">${this.getServicePeriod(data.issueDate)}</div>
                            </td>
                            <td style="text-align: center;">1</td>
                            <td style="text-align: right;">$${data.amount.toFixed(2)}</td>
                            <td style="text-align: right;">$${data.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="invoice-totals no-page-break">
                    <div class="totals-row"><span>Subtotal</span><span>$${data.amount.toFixed(2)}</span></div>
                    <div class="totals-row"><span>Total</span><span>$${data.amount.toFixed(2)}</span></div>
                    <div class="totals-row total-amount">
                        <span>Amount ${isReceipt ? 'paid' : 'due'}</span>
                        <span>$${data.amount.toFixed(2)} ${data.currency}</span>
                    </div>
                </div>

                ${isReceipt ? `
                    <div class="payment-history-section no-page-break">
                        <h4>Payment history</h4>
                        <table class="invoice-table payment-history-table">
                            <thead>
                                <tr>
                                    <th>Payment method</th>
                                    <th>Date</th>
                                    <th style="text-align: right;">Amount paid</th>
                                    <th style="text-align: right;">Receipt number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${data.paymentMethod} - ${data.cardLast4}</td>
                                    <td>${this.formatDate(data.issueDate)}</td>
                                    <td style="text-align: right;">$${data.amount.toFixed(2)}</td>
                                    <td style="text-align: right;">${receiptNumber}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ` : ''}

                <div class="invoice-footer">
                    Page 1 of 1
                </div>
            </div>
        `;
    }
};
