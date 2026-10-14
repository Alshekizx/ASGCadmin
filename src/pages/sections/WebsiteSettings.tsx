import { useState } from 'react';
import { PageHeader, Card, Btn, Tabs, FormField, Input, Textarea, UploadBox } from '../../components/admin/ui';

export default function WebsiteSettings() {
  const [tab, setTab] = useState('Organisation');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const TABS = ['Organisation', 'Branding', 'Contact', 'Social Media', 'Footer', 'SEO', 'Advanced'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Website Settings"
        subtitle="Configure general website information, branding and settings."
        actions={<Btn variant="secondary" onClick={() => showToast('Settings saved successfully.')}>Save Changes</Btn>}
      />

      <div className="mb-5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Organisation' && (
        <Card className="p-6 space-y-5">
          <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Organisation Information</p>
          <FormField label="Organisation Name" required>
            <Input defaultValue="ASGC" />
          </FormField>
          <FormField label="Short Name / Acronym">
            <Input defaultValue="ASGC" />
          </FormField>
          <FormField label="Organisation Description" hint="Displayed in website metadata and About sections">
            <Textarea rows={4} defaultValue="The Africa Strategic Growth Council (ASGC) is a non-governmental organisation committed to championing sustainable economic growth, strategic partnerships, and responsible investment across Africa and the global south." />
          </FormField>
          <FormField label="Founding Year">
            <Input type="number" defaultValue="2015" />
          </FormField>
          <FormField label="Registered Country">
            <Input defaultValue="United Kingdom" />
          </FormField>
          <FormField label="Registration Number" hint="Company or charity registration number">
            <Input defaultValue="12345678" />
          </FormField>
        </Card>
      )}

      {tab === 'Branding' && (
        <div className="space-y-5">
          <Card className="p-6 space-y-5">
            <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Logo & Brand Assets</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Primary Logo (Light background)">
                <div className="bg-white rounded-lg p-4 mb-3"><img src="/ASGC_colored_logo.png" alt="ASGC" className="h-24 w-auto object-contain mx-auto" /></div>
                <UploadBox accept="image/png,image/svg+xml" hint="SVG or PNG · Transparent background" />
              </FormField>
              <FormField label="Primary Logo (Dark background)">
                <div className="bg-[#0d1e35] rounded-lg p-4 mb-3"><img src="/ASGC_White_Logo.png" alt="ASGC" className="h-24 w-auto object-contain mx-auto" /></div>
                <UploadBox accept="image/png,image/svg+xml" hint="White / light version of the logo" />
              </FormField>
            </div>
            <FormField label="Favicon">
              <UploadBox accept="image/x-icon,image/png" hint="32×32px or 16×16px ICO or PNG" />
            </FormField>
          </Card>

          <Card className="p-6 space-y-4">
            <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Brand Colours</p>
            <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>These colours are used across the website. Only change if rebranding.</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Primary Colour (Navy)">
                <div className="flex gap-2">
                  <div className="w-10 h-9 rounded-lg border" style={{ background: '#0a1628', borderColor: '#e2e4e9' }} />
                  <Input defaultValue="#0a1628" />
                </div>
              </FormField>
              <FormField label="Accent Colour (Gold)">
                <div className="flex gap-2">
                  <div className="w-10 h-9 rounded-lg border" style={{ background: '#c9a84c', borderColor: '#e2e4e9' }} />
                  <Input defaultValue="#c9a84c" />
                </div>
              </FormField>
            </div>
          </Card>
        </div>
      )}

      {tab === 'Contact' && (
        <Card className="p-6 space-y-5">
          <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Contact Information</p>
          <FormField label="Office Address">
            <Textarea rows={3} defaultValue="Africa Strategic Growth Council&#10;Suite 400, International House&#10;London, EC1A 1BB&#10;United Kingdom" />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Main Phone Number">
              <Input defaultValue="+44 20 7123 4567" />
            </FormField>
            <FormField label="Secondary Phone Number">
              <Input defaultValue="+234 1 234 5678" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="General Enquiries Email">
              <Input type="email" defaultValue="info@asgc.us.com" />
            </FormField>
            <FormField label="Media / Press Email">
              <Input type="email" defaultValue="info@asgc.us.com" />
            </FormField>
          </div>
          <FormField label="CEO Email">
            <Input type="email" defaultValue="ceo@asgc.us.com" />
          </FormField>
          <FormField label="Partnerships Email">
            <Input type="email" defaultValue="info@asgc.us.com" />
          </FormField>
          <FormField label="Contact Form Recipient" hint="Messages submitted through the website contact form are sent here">
            <Input type="email" defaultValue="info@asgc.us.com" />
          </FormField>
        </Card>
      )}

      {tab === 'Social Media' && (
        <Card className="p-6 space-y-4">
          <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Social Media Links</p>
          {[
            { label: 'LinkedIn', icon: '🔗', placeholder: 'https://linkedin.com/company/asgc…' },
            { label: 'Twitter / X', icon: '🐦', placeholder: 'https://x.com/asgc…' },
            { label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/asgc…' },
            { label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@asgc…' },
            { label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/asgc…' },
          ].map(social => (
            <FormField key={social.label} label={`${social.icon} ${social.label}`}>
              <Input placeholder={social.placeholder} />
            </FormField>
          ))}
        </Card>
      )}

      {tab === 'Footer' && (
        <Card className="p-6 space-y-4">
          <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Footer Content</p>
          <FormField label="Footer Tagline / Description">
            <Textarea rows={2} defaultValue="Advancing Africa's strategic growth through diplomacy, partnerships and responsible investment." />
          </FormField>
          <FormField label="Copyright Text">
            <Input defaultValue="© 2026 Africa Strategic Growth Council. All rights reserved." />
          </FormField>
          <FormField label="Privacy Policy URL">
            <Input defaultValue="/privacy-policy" />
          </FormField>
          <FormField label="Terms & Conditions URL">
            <Input defaultValue="/terms" />
          </FormField>
        </Card>
      )}

      {tab === 'SEO' && (
        <Card className="p-6 space-y-4">
          <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Default SEO Settings</p>
          <FormField label="Default SEO Title" hint="Used when a page doesn't have its own SEO title">
            <Input defaultValue="ASGC" />
          </FormField>
          <FormField label="Title Separator" hint="Shown between page title and site name">
            <Input defaultValue=" | ASGC" />
          </FormField>
          <FormField label="Default Meta Description" hint="Used when a page doesn't have its own description">
            <Textarea rows={2} defaultValue="The Africa Strategic Growth Council champions sustainable economic growth, strategic partnerships and responsible investment across Africa." />
          </FormField>
          <FormField label="Default OG / Social Share Image">
            <UploadBox accept="image/*" hint="1200×630px recommended for social sharing" />
          </FormField>
          <FormField label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX">
            <Input placeholder="G-…" />
          </FormField>
          <FormField label="Google Search Console Verification" hint="Meta tag content value">
            <Input placeholder="Verification token…" />
          </FormField>
        </Card>
      )}

      {tab === 'Advanced' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#0a1628', borderColor: '#f0f2f5', fontFamily: 'var(--font-display)' }}>Website Status</p>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e2e4e9' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>Website Online</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>The public website is live and accessible</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium" style={{ color: '#16a34a' }}>Online</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4" style={{ border: '1px solid #fecaca' }}>
            <p className="text-sm font-semibold pb-2 border-b" style={{ color: '#dc2626', borderColor: '#fecaca', fontFamily: 'var(--font-display)' }}>Danger Zone</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#dc2626' }}>Maintenance Mode</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Show a maintenance page to all public visitors</p>
                </div>
                <Btn variant="outline" size="sm">Enable</Btn>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#dc2626' }}>Clear Cache</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Force refresh all cached website content</p>
                </div>
                <Btn variant="outline" size="sm" onClick={() => showToast('Website cache cleared.')}>Clear Cache</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex justify-end mt-5">
        <Btn variant="secondary" onClick={() => showToast('Settings saved successfully.')}>Save Changes</Btn>
      </div>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}
