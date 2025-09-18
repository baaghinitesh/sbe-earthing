interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

interface ExportOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  columns?: string[];
  format?: 'csv' | 'xlsx' | 'json' | 'pdf';
}

export class DataExporter {
  // CSV Export
  static exportToCSV(data: ExportData): void {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell
        ).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, `${data.filename}.csv`, 'text/csv');
  }

  // JSON Export
  static exportToJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  // Excel-like format (TSV for simplicity, can be opened in Excel)
  static exportToExcel(data: ExportData): void {
    const tsvContent = [
      data.headers.join('\t'),
      ...data.rows.map(row => row.join('\t'))
    ].join('\n');

    this.downloadFile(tsvContent, `${data.filename}.tsv`, 'text/tab-separated-values');
  }

  // Generic file download helper
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Format date for export
  static formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'long') {
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return dateObj.toLocaleDateString('en-US');
  }

  // Export contacts/queries
  static exportContacts(contacts: any[], options: ExportOptions = {}): void {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Category',
      'Status',
      'Priority',
      'Created Date',
      'Updated Date',
      'Message'
    ];

    const rows = contacts
      .filter(contact => {
        if (options.dateRange) {
          const createdDate = new Date(contact.createdAt);
          return createdDate >= options.dateRange.start && createdDate <= options.dateRange.end;
        }
        return true;
      })
      .filter(contact => {
        if (options.filters) {
          return Object.entries(options.filters).every(([key, value]) => {
            if (value === 'all' || !value) return true;
            return contact[key] === value;
          });
        }
        return true;
      })
      .map(contact => [
        contact.name,
        contact.email,
        contact.phone || '',
        contact.subject,
        contact.category,
        contact.status,
        contact.priority,
        this.formatDate(contact.createdAt),
        this.formatDate(contact.updatedAt),
        contact.message
      ]);

    const filename = `contacts_${new Date().toISOString().split('T')[0]}`;
    
    if (options.format === 'json') {
      this.exportToJSON(contacts, filename);
    } else if (options.format === 'xlsx') {
      this.exportToExcel({ headers, rows, filename });
    } else {
      this.exportToCSV({ headers, rows, filename });
    }
  }

  // Export products
  static exportProducts(products: any[], options: ExportOptions = {}): void {
    const headers = [
      'Name',
      'Category',
      'Status',
      'Featured',
      'Variants Count',
      'Total Stock',
      'Price Range',
      'Created Date',
      'Updated Date'
    ];

    const rows = products
      .filter(product => {
        if (options.filters) {
          return Object.entries(options.filters).every(([key, value]) => {
            if (value === 'all' || !value) return true;
            return product[key] === value;
          });
        }
        return true;
      })
      .map(product => {
        const prices = product.variants.map((v: any) => v.price);
        const priceRange = prices.length > 0 
          ? `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`
          : 'N/A';
        
        const totalStock = product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);

        return [
          product.name,
          product.category,
          product.status,
          product.isFeatured ? 'Yes' : 'No',
          product.variants.length,
          totalStock,
          priceRange,
          this.formatDate(product.createdAt),
          this.formatDate(product.updatedAt)
        ];
      });

    const filename = `products_${new Date().toISOString().split('T')[0]}`;
    
    if (options.format === 'json') {
      this.exportToJSON(products, filename);
    } else if (options.format === 'xlsx') {
      this.exportToExcel({ headers, rows, filename });
    } else {
      this.exportToCSV({ headers, rows, filename });
    }
  }

  // Export FAQs
  static exportFAQs(faqs: any[], options: ExportOptions = {}): void {
    const headers = [
      'Question',
      'Answer',
      'Category',
      'Status',
      'Priority',
      'Views',
      'Helpful Count',
      'Not Helpful Count',
      'Created Date',
      'Updated Date'
    ];

    const rows = faqs
      .filter(faq => {
        if (options.filters) {
          return Object.entries(options.filters).every(([key, value]) => {
            if (value === 'all' || !value) return true;
            return faq[key] === value;
          });
        }
        return true;
      })
      .map(faq => [
        faq.question,
        faq.answer,
        faq.category,
        faq.status,
        faq.priority,
        faq.views,
        faq.helpful,
        faq.notHelpful,
        this.formatDate(faq.createdAt),
        this.formatDate(faq.updatedAt)
      ]);

    const filename = `faqs_${new Date().toISOString().split('T')[0]}`;
    
    if (options.format === 'json') {
      this.exportToJSON(faqs, filename);
    } else if (options.format === 'xlsx') {
      this.exportToExcel({ headers, rows, filename });
    } else {
      this.exportToCSV({ headers, rows, filename });
    }
  }

  // Export analytics data
  static exportAnalytics(data: any, type: 'overview' | 'detailed', options: ExportOptions = {}): void {
    if (type === 'overview') {
      const summaryData = [
        ['Metric', 'Value', 'Change'],
        ['Total Products', data.totalProducts, data.productsChange || 'N/A'],
        ['Total Contacts', data.totalContacts, data.contactsChange || 'N/A'],
        ['Total FAQs', data.totalFAQs, data.faqsChange || 'N/A'],
        ['Monthly Queries', data.monthlyQueries, data.queriesChange || 'N/A'],
        ['Conversion Rate', `${data.conversionRate || 0}%`, data.conversionChange || 'N/A']
      ];

      const filename = `analytics_overview_${new Date().toISOString().split('T')[0]}`;
      
      this.exportToCSV({
        headers: summaryData[0] as string[],
        rows: summaryData.slice(1) as (string | number)[][],
        filename
      });
    } else {
      // Detailed analytics export would include time-series data
      const filename = `analytics_detailed_${new Date().toISOString().split('T')[0]}`;
      this.exportToJSON(data, filename);
    }
  }

  // Bulk export all data
  static exportAllData(allData: {
    contacts: any[];
    products: any[];
    faqs: any[];
    analytics: any;
  }): void {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Export each dataset
    this.exportContacts(allData.contacts, { format: 'csv' });
    
    setTimeout(() => {
      this.exportProducts(allData.products, { format: 'csv' });
    }, 500);
    
    setTimeout(() => {
      this.exportFAQs(allData.faqs, { format: 'csv' });
    }, 1000);
    
    setTimeout(() => {
      this.exportAnalytics(allData.analytics, 'overview');
    }, 1500);
  }

  // Generate export summary report
  static generateExportSummary(exportStats: {
    contactsCount: number;
    productsCount: number;
    faqsCount: number;
    dateRange?: { start: Date; end: Date };
  }): void {
    const summary = [
      ['Export Summary Report', ''],
      ['Generated On', this.formatDate(new Date(), 'long')],
      ['', ''],
      ['Data Exported', 'Count'],
      ['Contacts', exportStats.contactsCount],
      ['Products', exportStats.productsCount],
      ['FAQs', exportStats.faqsCount],
      ['', ''],
      ['Date Range', exportStats.dateRange 
        ? `${this.formatDate(exportStats.dateRange.start)} to ${this.formatDate(exportStats.dateRange.end)}`
        : 'All Time'
      ]
    ];

    const filename = `export_summary_${new Date().toISOString().split('T')[0]}`;
    
    this.exportToCSV({
      headers: ['Field', 'Value'],
      rows: summary as (string | number)[][],
      filename
    });
  }
}

export default DataExporter;