import { useState } from 'react'
import { Shield, AlertTriangle, Eye, Keyboard, MousePointer, Type, Code, Palette, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'

interface A11yIssue {
  id: string
  title: string
  component: string
  file: string
  wcag: string
  level: 'A' | 'AA' | 'AAA'
  description: string
  howToTest: string
}

interface IssueCategory {
  id: string
  title: string
  icon: React.ReactNode
  principle: string
  issues: A11yIssue[]
}

const issueCategories: IssueCategory[] = [
  {
    id: 'contrast',
    title: 'Color Contrast Failures',
    icon: <Palette className="w-5 h-5" />,
    principle: 'Perceivable',
    issues: [
      {
        id: 'contrast-1',
        title: 'Footer status labels have low contrast',
        component: 'Footer',
        file: 'src/components/layout/Footer.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Text using text-gray-700 on dark background fails 4.5:1 contrast ratio.',
        howToTest: 'Use color contrast analyzer tool on "System Status:" and "Active Sites:" labels.',
      },
      {
        id: 'contrast-2',
        title: 'Footer sync timestamp low contrast',
        component: 'Footer',
        file: 'src/components/layout/Footer.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Timestamp text using text-gray-600 fails minimum contrast requirements.',
        howToTest: 'Inspect the "Last sync:" timestamp in the footer.',
      },
      {
        id: 'contrast-3',
        title: 'Header Mercury Time label low contrast',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: '"Mercury Time" label uses text-gray-600 which fails contrast.',
        howToTest: 'Check the Mercury Time display in the top right header area.',
      },
      {
        id: 'contrast-4',
        title: 'Dashboard metric card labels low contrast',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Metric labels and units use text-gray-600 failing contrast.',
        howToTest: 'Inspect the four metric cards at top of Dashboard.',
      },
      {
        id: 'contrast-5',
        title: 'Dashboard alert timestamps low contrast',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Alert timestamps use text-gray-600 which fails contrast.',
        howToTest: 'Check timestamps in the Recent Alerts section.',
      },
      {
        id: 'contrast-6',
        title: 'Equipment legend text low contrast',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Equipment status legend uses text-gray-600.',
        howToTest: 'Look at the legend below the Equipment Status grid.',
      },
      {
        id: 'contrast-7',
        title: 'Commodity names/symbols low contrast',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Commodity names use text-gray-600, symbols use text-gray-700.',
        howToTest: 'Inspect the Commodity Prices section.',
      },
      {
        id: 'contrast-8',
        title: 'Export modal text low contrast',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '1.4.3',
        level: 'AA',
        description: 'Metric names use text-gray-500, units use text-gray-700.',
        howToTest: 'Open Export modal from Reports page and inspect metric list.',
      },
    ],
  },
  {
    id: 'color-only',
    title: 'Color-Only Status Indicators',
    icon: <Eye className="w-5 h-5" />,
    principle: 'Perceivable',
    issues: [
      {
        id: 'color-1',
        title: 'Equipment status grid uses color only',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.1',
        level: 'A',
        description: 'Equipment operational status shown only through colors (green/yellow/red/gray).',
        howToTest: 'View page in grayscale mode - status becomes indistinguishable.',
      },
      {
        id: 'color-2',
        title: 'Metric trends use color only',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.1',
        level: 'A',
        description: 'Positive/negative trends shown only by green/yellow text color.',
        howToTest: 'Check metric card trend text - no icon indicates direction.',
      },
      {
        id: 'color-3',
        title: 'Unread alert indicator is color only',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.1',
        level: 'A',
        description: 'Unread alerts shown with small amber dot, no text alternative.',
        howToTest: 'Look for amber dots next to unread alerts.',
      },
      {
        id: 'color-4',
        title: 'Commodity price change uses color only',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.4.1',
        level: 'A',
        description: 'Price changes shown in green/red without up/down icons.',
        howToTest: 'Check commodity price badges - only +/- sign and color indicate direction.',
      },
      {
        id: 'color-5',
        title: 'Sensor warning dot uses color only',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '1.4.1',
        level: 'A',
        description: 'Yellow dot on Sensors tab indicates warnings without text.',
        howToTest: 'Open Equipment modal when equipment has sensor warnings.',
      },
    ],
  },
  {
    id: 'names',
    title: 'Missing Accessible Names',
    icon: <Type className="w-5 h-5" />,
    principle: 'Perceivable',
    issues: [
      {
        id: 'names-1',
        title: 'Notification button lacks accessible name',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '1.1.1',
        level: 'A',
        description: 'Bell icon button has no aria-label.',
        howToTest: 'Use screen reader on notification bell - announces nothing meaningful.',
      },
      {
        id: 'names-2',
        title: 'Profile button lacks accessible name',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '1.1.1',
        level: 'A',
        description: 'User profile button has no aria-label.',
        howToTest: 'Tab to profile button - no clear announcement.',
      },
      {
        id: 'names-3',
        title: 'Metric icons have no text alternative',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.1.1',
        level: 'A',
        description: 'Metric card icons marked aria-hidden with no visible text describing them.',
        howToTest: 'Screen reader skips icons entirely.',
      },
      {
        id: 'names-4',
        title: 'Unread dot has no screen reader text',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '1.1.1',
        level: 'A',
        description: 'Amber unread indicator dot is aria-hidden with no alternative.',
        howToTest: 'Screen reader does not announce unread status.',
      },
    ],
  },
  {
    id: 'keyboard-trap',
    title: 'Keyboard Traps',
    icon: <Keyboard className="w-5 h-5" />,
    principle: 'Operable',
    issues: [
      {
        id: 'trap-1',
        title: 'Equipment modal has no escape key handler',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '2.1.2',
        level: 'A',
        description: 'Modal does not close when Escape key is pressed.',
        howToTest: 'Open equipment detail modal, press Escape - nothing happens.',
      },
      {
        id: 'trap-2',
        title: 'Export modal has no escape key handler',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '2.1.2',
        level: 'A',
        description: 'Modal does not close when Escape key is pressed.',
        howToTest: 'Open export modal from Reports, press Escape - nothing happens.',
      },
      {
        id: 'trap-3',
        title: 'Personnel form has no escape key handler',
        component: 'PersonnelFormWizard',
        file: 'src/components/personnel/PersonnelFormWizard.tsx',
        wcag: '2.1.2',
        level: 'A',
        description: 'Form wizard does not close when Escape key is pressed.',
        howToTest: 'Open Add Personnel form, press Escape - nothing happens.',
      },
    ],
  },
  {
    id: 'focus',
    title: 'Missing Focus Indicators',
    icon: <MousePointer className="w-5 h-5" />,
    principle: 'Operable',
    issues: [
      {
        id: 'focus-1',
        title: 'Header notification button no focus ring',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'focus:outline-none removes visible focus indicator.',
        howToTest: 'Tab to notification bell - no visible focus state.',
      },
      {
        id: 'focus-2',
        title: 'Header profile button no focus ring',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'focus:outline-none removes visible focus indicator.',
        howToTest: 'Tab to profile button - no visible focus state.',
      },
      {
        id: 'focus-3',
        title: 'Dashboard alert cards not focusable',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'Clickable alert cards have no focus state since they are divs.',
        howToTest: 'Cannot tab to alert cards at all.',
      },
      {
        id: 'focus-4',
        title: 'Equipment modal tabs no focus ring',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'Tab buttons have focus:outline-none.',
        howToTest: 'Tab through modal tabs - no visible focus indication.',
      },
      {
        id: 'focus-5',
        title: 'Personnel form buttons no focus ring',
        component: 'PersonnelFormWizard',
        file: 'src/components/personnel/PersonnelFormWizard.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'Navigation buttons have focus:outline-none.',
        howToTest: 'Tab through form wizard - buttons show no focus.',
      },
      {
        id: 'focus-6',
        title: 'Export modal checkboxes no focus ring',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '2.4.7',
        level: 'AA',
        description: 'Checkbox inputs have focus:outline-none.',
        howToTest: 'Tab through export modal checkboxes.',
      },
    ],
  },
  {
    id: 'keyboard-access',
    title: 'Non-Keyboard Accessible Elements',
    icon: <Keyboard className="w-5 h-5" />,
    principle: 'Operable',
    issues: [
      {
        id: 'kb-1',
        title: 'Alert cards not keyboard accessible',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '2.1.1',
        level: 'A',
        description: 'Alert cards use div with onClick but no keyboard handler or tabindex.',
        howToTest: 'Try to tab to and activate alert cards - impossible.',
      },
      {
        id: 'kb-2',
        title: 'Equipment grid squares not focusable',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '2.1.1',
        level: 'A',
        description: 'Equipment status squares show info in title, not keyboard accessible.',
        howToTest: 'Cannot tab to equipment grid items.',
      },
    ],
  },
  {
    id: 'focus-order',
    title: 'Focus Order Issues',
    icon: <MousePointer className="w-5 h-5" />,
    principle: 'Operable',
    issues: [
      {
        id: 'order-1',
        title: 'Equipment modal button focus order wrong',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '2.4.3',
        level: 'A',
        description: 'Footer buttons have tabindex values (1, 2) disrupting natural order.',
        howToTest: 'Tab through modal footer - focus jumps unexpectedly.',
      },
      {
        id: 'order-2',
        title: 'Personnel form button focus order wrong',
        component: 'PersonnelFormWizard',
        file: 'src/components/personnel/PersonnelFormWizard.tsx',
        wcag: '2.4.3',
        level: 'A',
        description: 'Footer buttons have tabindex values (1, 2, 3) creating illogical order.',
        howToTest: 'Tab through form wizard footer - focus order does not match visual layout.',
      },
    ],
  },
  {
    id: 'labels',
    title: 'Missing Form Labels',
    icon: <Type className="w-5 h-5" />,
    principle: 'Understandable',
    issues: [
      {
        id: 'label-1',
        title: 'Header search has no label',
        component: 'Header',
        file: 'src/components/layout/Header.tsx',
        wcag: '3.3.2',
        level: 'A',
        description: 'Search input relies on placeholder only, no label element.',
        howToTest: 'Screen reader does not announce field purpose clearly.',
      },
      {
        id: 'label-2',
        title: 'Export modal metrics label not associated',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '3.3.2',
        level: 'A',
        description: 'Uses span instead of label, not programmatically associated.',
        howToTest: 'Click on "Include Metrics" text - checkboxes don\'t respond.',
      },
      {
        id: 'label-3',
        title: 'Export modal checkbox labels missing for attribute',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Checkboxes wrapped in label but lack explicit id/for association.',
        howToTest: 'Inspect checkbox inputs - no id attributes.',
      },
    ],
  },
  {
    id: 'aria',
    title: 'ARIA Issues',
    icon: <Code className="w-5 h-5" />,
    principle: 'Robust',
    issues: [
      {
        id: 'aria-1',
        title: 'Alert feed missing aria-live',
        component: 'Dashboard',
        file: 'src/pages/Dashboard.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Dynamic alert content not announced to screen readers.',
        howToTest: 'New alerts appear without screen reader announcement.',
      },
      {
        id: 'aria-2',
        title: 'Equipment modal missing dialog role',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Modal lacks role="dialog" and aria-modal="true".',
        howToTest: 'Screen reader does not announce modal context.',
      },
      {
        id: 'aria-3',
        title: 'Equipment modal tabs missing ARIA',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Tab container missing role="tablist", tabs missing role="tab", aria-selected.',
        howToTest: 'Screen reader does not announce tab interface properly.',
      },
      {
        id: 'aria-4',
        title: 'Equipment modal tab panels missing ARIA',
        component: 'EquipmentDetailModal',
        file: 'src/components/equipment/EquipmentDetailModal.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Tab panels missing role="tabpanel" and aria-labelledby.',
        howToTest: 'Tab panel content not associated with tabs.',
      },
      {
        id: 'aria-5',
        title: 'Export modal missing dialog role',
        component: 'ExportModal',
        file: 'src/components/reports/ExportModal.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Modal lacks role="dialog" and aria-modal="true".',
        howToTest: 'Screen reader does not announce modal context.',
      },
      {
        id: 'aria-6',
        title: 'Personnel form missing dialog role',
        component: 'PersonnelFormWizard',
        file: 'src/components/personnel/PersonnelFormWizard.tsx',
        wcag: '4.1.2',
        level: 'A',
        description: 'Form wizard lacks role="dialog" and aria-modal="true".',
        howToTest: 'Screen reader does not announce dialog context.',
      },
    ],
  },
]

export default function Admin() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['contrast']))

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalIssues = issueCategories.reduce((sum, cat) => sum + cat.issues.length, 0)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A':
        return 'bg-status-error/20 text-status-error border-status-error/30'
      case 'AA':
        return 'bg-status-warning/20 text-status-warning border-status-warning/30'
      case 'AAA':
        return 'bg-status-active/20 text-status-active border-status-active/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPrincipleColor = (principle: string) => {
    switch (principle) {
      case 'Perceivable':
        return 'text-blue-400'
      case 'Operable':
        return 'text-green-400'
      case 'Understandable':
        return 'text-yellow-400'
      case 'Robust':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-status-warning/10 rounded-lg">
          <Shield className="w-8 h-8 text-status-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Accessibility Issues Registry</h1>
          <p className="text-gray-500">Hidden admin page documenting all intentional a11y issues</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Issues</p>
          <p className="text-3xl font-bold text-mercury-amber">{totalIssues}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-3xl font-bold text-gray-200">{issueCategories.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Level A Issues</p>
          <p className="text-3xl font-bold text-status-error">
            {issueCategories.reduce((sum, cat) => sum + cat.issues.filter(i => i.level === 'A').length, 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Level AA Issues</p>
          <p className="text-3xl font-bold text-status-warning">
            {issueCategories.reduce((sum, cat) => sum + cat.issues.filter(i => i.level === 'AA').length, 0)}
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-status-warning/10 border border-status-warning/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-status-warning">For Testing Practice Only</p>
          <p className="text-sm text-gray-400 mt-1">
            These accessibility issues are intentionally implemented for testing practice.
            In a production application, all these issues should be fixed to ensure the site
            is accessible to all users.
          </p>
        </div>
      </div>

      {/* Issue Categories */}
      <div className="space-y-3">
        {issueCategories.map(category => (
          <div key={category.id} className="border border-mercury-dark-tertiary rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 bg-mercury-dark hover:bg-mercury-dark-tertiary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-mercury-amber">{category.icon}</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-200">{category.title}</h3>
                  <p className="text-xs text-gray-500">
                    <span className={getPrincipleColor(category.principle)}>{category.principle}</span>
                    {' • '}
                    {category.issues.length} issues
                  </p>
                </div>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedCategories.has(category.id) && (
              <div className="border-t border-mercury-dark-tertiary">
                {category.issues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className={`p-4 ${index > 0 ? 'border-t border-mercury-dark-tertiary' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-200">{issue.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getLevelColor(issue.level)}`}>
                            Level {issue.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>
                            <strong className="text-gray-400">Component:</strong> {issue.component}
                          </span>
                          <span>
                            <strong className="text-gray-400">WCAG:</strong> {issue.wcag}
                          </span>
                        </div>
                        <div className="mt-3 p-3 bg-mercury-dark-tertiary/50 rounded text-sm">
                          <p className="text-gray-400">
                            <strong className="text-mercury-amber">How to Test:</strong> {issue.howToTest}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <code className="px-2 py-1 bg-mercury-dark rounded text-gray-400">{issue.file}</code>
                      <a
                        href={`https://www.w3.org/WAI/WCAG21/Understanding/${issue.wcag.replace('.', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-mercury-amber hover:underline"
                      >
                        WCAG Reference <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Documentation Link */}
      <div className="card">
        <h3 className="font-medium text-gray-200 mb-2">Documentation</h3>
        <p className="text-sm text-gray-400 mb-3">
          For a complete testing guide with detailed instructions, see the Testing Guide documentation.
        </p>
        <code className="text-sm text-mercury-amber">docs/TESTING-GUIDE.md</code>
      </div>
    </div>
  )
}
