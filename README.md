# Discover Mercury

**Mining Operations Dashboard for Accessibility Testing Practice**

A fictional mining operations dashboard designed as part of the Discover Planets accessibility testing website series. This site simulates a real-time command center for a rare mineral extraction operation on the planet Mercury.

![License](https://img.shields.io/badge/license-ISC-blue.svg)

## 🚀 Live Demo

Visit the live site: [https://discovermercury.site](https://discovermercury.site)

## 📖 About

Discover Mercury is designed to help accessibility testers practice their skills on a realistic, data-rich dashboard interface. The site features:

- **Dark Mode Interface**: Industrial control room aesthetic with amber/orange accents
- **Complex Interactive Components**: Data tables, charts, forms, modals, and more
- **Intentional Accessibility Issues**: Distributed throughout for testing practice
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Fictional Setting

Helios Mining Corporation operates the largest rare mineral extraction facility on Mercury. The dashboard allows operations supervisors to monitor:

- Extraction rates for Mercurium, Solar Platinum, and Thermal Crystals
- Equipment status and maintenance schedules
- Personnel shifts and certifications
- Real-time alerts and commodity prices

## 🛠️ Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router (HashRouter for GitHub Pages)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/nsquared-team/a11y-practice-mercury.git
cd a11y-practice-mercury

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared UI components
│   ├── layout/          # Header, Sidebar, Footer, Layout
│   ├── dashboard/       # Dashboard-specific components
│   ├── operations/      # Operations view components
│   ├── personnel/       # Personnel management components
│   ├── equipment/       # Equipment monitoring components
│   ├── reports/         # Reports & analytics components
│   └── settings/        # Settings components
├── context/             # React Context providers
├── data/                # Fixture data
├── hooks/               # Custom hooks
├── pages/               # Page components
├── types/               # TypeScript types
└── utils/               # Helper functions
```

## ♿ Accessibility Testing

This site is designed as a practice environment for accessibility testers. It contains:

- **Intentional Issues**: Distributed accessibility problems for discovery
- **Correct Implementations**: Best practice examples for comparison
- **Diverse Components**: Tables, forms, charts, modals, and more

### Categories of Issues

- Perceivable: Color contrast, missing alt text, color-only indicators
- Operable: Keyboard traps, focus issues, non-keyboard-accessible elements
- Understandable: Form labels, error messages, navigation patterns
- Robust: ARIA issues, HTML validity, dynamic content announcements

## 📚 Documentation

- [Development Plan](./docs/DEVELOPMENT-PLAN.md) - Detailed implementation plan
- [Requirements](./docs/project-requirements.md) - Full project requirements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## � License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

*Part of the Discover Planets accessibility testing website series*
