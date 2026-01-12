import { Settings as SettingsIcon, Database, Mail, Key, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">System Settings</h2>
        <p className="text-foreground-muted mt-2">Configure system-wide settings and integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Settings */}
        <div className="border border-border rounded-xl bg-background/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Database</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Provider</span>
              <span className="text-sm font-mono">SQLite (Local)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Status</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Auto-backup</span>
              <span className="text-sm font-mono">Disabled</span>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="border border-border rounded-xl bg-background/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Email Service</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Provider</span>
              <span className="text-sm font-mono">Resend</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Status</span>
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Daily Limit</span>
              <span className="text-sm font-mono">3,000 emails</span>
            </div>
          </div>
        </div>

        {/* Authentication Settings */}
        <div className="border border-border rounded-xl bg-background/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Authentication</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Provider</span>
              <span className="text-sm font-mono">NextAuth.js</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Session Duration</span>
              <span className="text-sm font-mono">30 days</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Password Min Length</span>
              <span className="text-sm font-mono">8 characters</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border border-border rounded-xl bg-background/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Web Push</span>
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">Email Notifications</span>
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-foreground-muted">SMS (Twilio)</span>
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Variables Status */}
      <div className="border border-border rounded-xl bg-background/50 p-6">
        <h3 className="text-lg font-bold mb-4">Environment Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EnvStatus label="DATABASE_URL" status="configured" />
          <EnvStatus label="NEXTAUTH_SECRET" status="configured" />
          <EnvStatus label="NEXTAUTH_URL" status="configured" />
          <EnvStatus label="STRIPE_SECRET_KEY" status="missing" />
          <EnvStatus label="OPENAI_API_KEY" status="missing" />
          <EnvStatus label="RESEND_API_KEY" status="missing" />
          <EnvStatus label="VAPID_PUBLIC_KEY" status="missing" />
          <EnvStatus label="VAPID_PRIVATE_KEY" status="missing" />
          <EnvStatus label="TWILIO_ACCOUNT_SID" status="missing" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
          Save Settings (Coming Soon)
        </button>
        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
          Run Database Backup
        </button>
        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
          Test Email Service
        </button>
      </div>
    </div>
  );
}

function EnvStatus({ label, status }: { label: string; status: 'configured' | 'missing' }) {
  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
      <span className="text-sm font-mono">{label}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded ${
        status === 'configured'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    </div>
  );
}
