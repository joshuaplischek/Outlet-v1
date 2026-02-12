# Fensterpreiswert Outlet Portal

Modern Angular 18 web portal for a window outlet business with product filtering, detail views, and inquiry functionality.

## Features

- ✨ Modern, minimalist design with black background and blue/white accents
- 🪟 Product catalog with filtering (All, Fenster, Balkontüren, Haustüren)
- 📊 Position-based product sorting
- 🔍 Detailed product view with image gallery
- 📧 Inquiry form with email integration
- 📱 Fully responsive design
- ⚡ Built with Angular 18, TypeScript, and SCSS

## Project Structure

```
Fensterpreiswert/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── header/
│   │   │   ├── hero/
│   │   │   ├── benefits/
│   │   │   ├── product-list/
│   │   │   ├── product-card/
│   │   │   ├── product-detail-modal/
│   │   │   ├── inquiry-form/
│   │   │   └── footer/
│   │   ├── pages/               # Page components
│   │   │   ├── home/
│   │   │   ├── impressum/
│   │   │   └── datenschutz/
│   │   ├── services/            # Services
│   │   │   ├── product.service.ts
│   │   │   └── email.service.ts
│   │   └── models/              # Data models
│   │       └── product.model.ts
│   ├── assets/
│   │   └── data/
│   │       └── products.json    # Product data
│   └── styles.scss              # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

Due to PowerShell execution policy restrictions, you may need to run npm commands using one of these methods:

**Option 1: Use Command Prompt (cmd.exe)**
```cmd
cd c:\Users\jplis\Desktop\Fensterpreiswert.de\Fensterpreiswert
npm install
npm start
```

**Option 2: Temporarily bypass PowerShell policy**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm start
```

**Option 3: Use npx directly**
```powershell
npx -y npm install
npx -y npm start
```

### Development Server

After installation, run:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Email Configuration

The inquiry form uses EmailJS for sending emails. To set up:

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Update the credentials in `src/app/services/email.service.ts`:
   ```typescript
   private readonly SERVICE_ID = 'YOUR_SERVICE_ID';
   private readonly TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   private readonly PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```

### EmailJS Template Variables

Your EmailJS template should include these variables:
- `{{product_id}}` - Product ID
- `{{product_name}}` - Product name
- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone (optional)
- `{{delivery_option}}` - Lieferung or Selbstabholung
- `{{to_email}}` - Your business email

## Managing Products

Products are stored in `src/assets/data/products.json`. To add, edit, or remove products:

### Product Structure
```json
{
  "id": "unique-id",
  "name": "Product Name",
  "category": "Fenster" | "Balkontür" | "Haustür",
  "price": 299,
  "images": ["path/to/image.jpg"],
  "condition": "Condition description",
  "description": "Product description",
  "specifications": {
    "Key": "Value"
  },
  "pos": 1,
  "available": true
}
```

### Adding Product Images

1. Place product images in `public/images/products/`
2. Update the `images` array in the product JSON with the relative path
3. Example: `"images": ["images/products/fenster-1.jpg"]`

### Sorting Products

Products are sorted by the `pos` property (ascending). Lower numbers appear first.

## Pages

- **Home** (`/`) - Main landing page with hero, benefits, and product catalog
- **Impressum** (`/impressum`) - Legal imprint page
- **Datenschutz** (`/datenschutz`) - Privacy policy page

## Customization

### Colors

Edit CSS variables in `src/styles.scss`:
```scss
:root {
  --color-bg-primary: #000000;
  --color-accent-blue: #0066FF;
  --color-text-primary: #FFFFFF;
  // ... more variables
}
```

### Company Information

Update company details in:
- `src/app/pages/impressum/impressum.component.html`
- `src/app/pages/datenschutz/datenschutz.component.html`
- `src/app/components/footer/footer.component.html`

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Technologies

- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **SCSS** - Styling
- **RxJS** - Reactive programming
- **EmailJS** - Email service integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2026 Fensterpreiswert. All rights reserved.
