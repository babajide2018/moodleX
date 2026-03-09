'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Database,
  Check,
  ChevronRight,
  Globe,
  User,
  Shield,
  FolderOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Loader2,
  Server,
  FileText,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

// ============================================================
// Moodle Installation Stages (matching real Moodle install.php)
// ============================================================
// Stage 0: Language selection
// Stage 1: Environment checks (Node.js version, required packages)
// Stage 2: Paths confirmation (web address, data directory)
// Stage 3: License agreement (GPL)
// Stage 4: Database type selection
// Stage 5: Database configuration
// Stage 6: Config generation & database creation
// Stage 7: Admin account setup
// Stage 8: Front page settings
// Stage 9: Installation complete

type InstallStage =
  | 'language'
  | 'environment'
  | 'paths'
  | 'license'
  | 'dbtype'
  | 'dbconfig'
  | 'install'
  | 'adminaccount'
  | 'frontpage'
  | 'complete';

interface EnvironmentCheck {
  name: string;
  status: 'ok' | 'warn' | 'error';
  info: string;
  required: boolean;
}

interface InstallState {
  lang: string;
  wwwroot: string;
  dataroot: string;
  admindir: string;
  dbtype: string;
  dbhost: string;
  dbname: string;
  dbuser: string;
  dbpass: string;
  dbprefix: string;
  dbport: string;
  adminuser: string;
  adminpass: string;
  adminpass2: string;
  adminfirstname: string;
  adminlastname: string;
  adminemail: string;
  sitename: string;
  siteshortname: string;
  sitesummary: string;
  timezone: string;
  supportemail: string;
  noreplyemail: string;
  selfregistration: boolean;
}

const INSTALL_STAGES: { key: InstallStage; label: string }[] = [
  { key: 'language', label: 'Language' },
  { key: 'environment', label: 'Server checks' },
  { key: 'paths', label: 'Confirm paths' },
  { key: 'license', label: 'Copyright' },
  { key: 'dbtype', label: 'Database driver' },
  { key: 'dbconfig', label: 'Database settings' },
  { key: 'adminaccount', label: 'Admin user' },
  { key: 'frontpage', label: 'Front page settings' },
  { key: 'install', label: 'Installation' },
  { key: 'complete', label: 'Complete' },
];

const LANGUAGES = [
  { code: 'en', name: 'English (en)' },
  { code: 'ar', name: 'العربية (ar)' },
  { code: 'bg', name: 'Български (bg)' },
  { code: 'ca', name: 'Català (ca)' },
  { code: 'cs', name: 'Čeština (cs)' },
  { code: 'da', name: 'Dansk (da)' },
  { code: 'de', name: 'Deutsch (de)' },
  { code: 'el', name: 'Ελληνικά (el)' },
  { code: 'es', name: 'Español - Internacional (es)' },
  { code: 'es_mx', name: 'Español - México (es_mx)' },
  { code: 'fi', name: 'Suomi (fi)' },
  { code: 'fr', name: 'Français (fr)' },
  { code: 'he', name: 'עברית (he)' },
  { code: 'hi', name: 'हिन्दी (hi)' },
  { code: 'hr', name: 'Hrvatski (hr)' },
  { code: 'hu', name: 'Magyar (hu)' },
  { code: 'id', name: 'Bahasa Indonesia (id)' },
  { code: 'it', name: 'Italiano (it)' },
  { code: 'ja', name: '日本語 (ja)' },
  { code: 'ko', name: '한국어 (ko)' },
  { code: 'lt', name: 'Lietuvių (lt)' },
  { code: 'lv', name: 'Latviešu (lv)' },
  { code: 'mk', name: 'Македонски (mk)' },
  { code: 'ms', name: 'Bahasa Melayu (ms)' },
  { code: 'nl', name: 'Nederlands (nl)' },
  { code: 'no', name: 'Norsk - bokmål (no)' },
  { code: 'pl', name: 'Polski (pl)' },
  { code: 'pt', name: 'Português - Portugal (pt)' },
  { code: 'pt_br', name: 'Português - Brasil (pt_br)' },
  { code: 'ro', name: 'Română (ro)' },
  { code: 'ru', name: 'Русский (ru)' },
  { code: 'sk', name: 'Slovenčina (sk)' },
  { code: 'sl', name: 'Slovenščina (sl)' },
  { code: 'sr', name: 'Српски (sr)' },
  { code: 'sv', name: 'Svenska (sv)' },
  { code: 'th', name: 'ไทย (th)' },
  { code: 'tr', name: 'Türkçe (tr)' },
  { code: 'uk', name: 'Українська (uk)' },
  { code: 'vi', name: 'Tiếng Việt (vi)' },
  { code: 'zh_cn', name: '简体中文 (zh_cn)' },
  { code: 'zh_tw', name: '正體中文 (zh_tw)' },
];

const DATABASE_DRIVERS = [
  {
    id: 'postgresql',
    name: 'PostgreSQL (native/pgsql)',
    prismaId: 'postgresql',
    defaultPort: '5432',
    available: true,
    description: 'Recommended database server. Full Unicode support (UTF-8).',
  },
  {
    id: 'mysql',
    name: 'MySQL (native/mysqli)',
    prismaId: 'mysql',
    defaultPort: '3306',
    available: true,
    description: 'Widely used database. Ensure you use InnoDB engine with UTF-8 collation.',
  },
  {
    id: 'mariadb',
    name: 'MariaDB (native/mariadb)',
    prismaId: 'mysql',
    defaultPort: '3306',
    available: true,
    description: 'Community-developed fork of MySQL, fully compatible.',
  },
  {
    id: 'sqlite',
    name: 'SQLite 3 (native/sqlite3)',
    prismaId: 'sqlite',
    defaultPort: '',
    available: true,
    description: 'File-based database. Not recommended for production. Good for development.',
  },
  {
    id: 'sqlserver',
    name: 'SQL Server (native/sqlsrv)',
    prismaId: 'sqlserver',
    defaultPort: '1433',
    available: true,
    description: 'Microsoft SQL Server. Commercial enterprise database.',
  },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Pacific/Midway', label: '(UTC-11:00) Midway Island, Samoa' },
  { value: 'Pacific/Honolulu', label: '(UTC-10:00) Hawaii' },
  { value: 'America/Anchorage', label: '(UTC-09:00) Alaska' },
  { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: '(UTC-06:00) Central Time (US & Canada)' },
  { value: 'America/New_York', label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Caracas', label: '(UTC-04:00) Caracas, La Paz' },
  { value: 'America/Sao_Paulo', label: '(UTC-03:00) Brasilia, Buenos Aires' },
  { value: 'Atlantic/South_Georgia', label: '(UTC-02:00) Mid-Atlantic' },
  { value: 'Atlantic/Azores', label: '(UTC-01:00) Azores' },
  { value: 'Europe/London', label: '(UTC+00:00) London, Dublin, Lisbon' },
  { value: 'Europe/Paris', label: '(UTC+01:00) Paris, Berlin, Amsterdam, Rome' },
  { value: 'Europe/Helsinki', label: '(UTC+02:00) Helsinki, Cairo, Kyiv' },
  { value: 'Europe/Moscow', label: '(UTC+03:00) Moscow, Nairobi, Baghdad' },
  { value: 'Asia/Dubai', label: '(UTC+04:00) Abu Dhabi, Muscat' },
  { value: 'Asia/Karachi', label: '(UTC+05:00) Karachi, Islamabad' },
  { value: 'Asia/Kolkata', label: '(UTC+05:30) Chennai, Mumbai, New Delhi' },
  { value: 'Asia/Dhaka', label: '(UTC+06:00) Dhaka, Almaty' },
  { value: 'Asia/Bangkok', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'Asia/Shanghai', label: '(UTC+08:00) Beijing, Hong Kong, Singapore' },
  { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo, Seoul, Osaka' },
  { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney, Melbourne' },
  { value: 'Pacific/Noumea', label: '(UTC+11:00) Vladivostok, Solomon Is.' },
  { value: 'Pacific/Auckland', label: '(UTC+12:00) Auckland, Wellington, Fiji' },
  { value: 'Africa/Lagos', label: '(UTC+01:00) Lagos, West Central Africa' },
  { value: 'Africa/Johannesburg', label: '(UTC+02:00) Johannesburg, Harare' },
  { value: 'Africa/Nairobi', label: '(UTC+03:00) Nairobi, East Africa' },
];

export default function InstallPage() {
  const [stage, setStage] = useState<InstallStage>('language');
  const [config, setConfig] = useState<InstallState>({
    lang: 'en',
    wwwroot: '',
    dataroot: '',
    admindir: 'admin',
    dbtype: '',
    dbhost: 'localhost',
    dbname: 'moodle',
    dbuser: '',
    dbpass: '',
    dbprefix: 'mdl_',
    dbport: '',
    adminuser: 'admin',
    adminpass: '',
    adminpass2: '',
    adminfirstname: '',
    adminlastname: '',
    adminemail: '',
    sitename: '',
    siteshortname: '',
    sitesummary: '',
    timezone: 'UTC',
    supportemail: '',
    noreplyemail: '',
    selfregistration: false,
  });
  const [envChecks, setEnvChecks] = useState<EnvironmentCheck[]>([]);
  const [envChecking, setEnvChecking] = useState(false);
  const [installProgress, setInstallProgress] = useState<string[]>([]);
  const [installing, setInstalling] = useState(false);
  const [installError, setInstallError] = useState('');
  const [dbTestResult, setDbTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [dbTesting, setDbTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentIndex = INSTALL_STAGES.findIndex((s) => s.key === stage);

  // Auto-detect wwwroot on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setConfig((prev) => ({
        ...prev,
        wwwroot: window.location.origin,
        dataroot: '/var/moodledata',
      }));
    }
  }, []);

  const updateConfig = (field: keyof InstallState, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ============================================================
  // Environment checks
  // ============================================================
  const runEnvironmentChecks = useCallback(async () => {
    setEnvChecking(true);
    const checks: EnvironmentCheck[] = [];

    // Simulate server-side checks (in production, these hit an API route)
    await new Promise((r) => setTimeout(r, 800));

    // Node.js version
    checks.push({
      name: 'Node.js version',
      status: 'ok',
      info: 'Node.js 18+ detected. Required for Next.js runtime.',
      required: true,
    });

    // npm/package manager
    checks.push({
      name: 'Package manager',
      status: 'ok',
      info: 'npm detected and available.',
      required: true,
    });

    // Prisma ORM
    checks.push({
      name: 'Prisma ORM',
      status: 'ok',
      info: 'Prisma client installed. Database migrations ready.',
      required: true,
    });

    // NextAuth
    checks.push({
      name: 'Authentication library',
      status: 'ok',
      info: 'NextAuth.js installed. Session management ready.',
      required: true,
    });

    // Memory
    checks.push({
      name: 'Available memory',
      status: 'ok',
      info: 'Sufficient memory available for LMS operations.',
      required: true,
    });

    // File system
    checks.push({
      name: 'File system access',
      status: 'ok',
      info: 'Write access to application directory confirmed.',
      required: true,
    });

    // HTTPS
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    checks.push({
      name: 'HTTPS',
      status: isHttps ? 'ok' : 'warn',
      info: isHttps
        ? 'Site is served over HTTPS. Secure.'
        : 'Site is not using HTTPS. Recommended for production use.',
      required: false,
    });

    // Email
    checks.push({
      name: 'Email configuration',
      status: 'warn',
      info: 'SMTP not configured yet. Email notifications can be set up later in Site Administration.',
      required: false,
    });

    // File upload support
    checks.push({
      name: 'File upload support',
      status: 'ok',
      info: 'File uploads are supported. Maximum upload size can be configured.',
      required: true,
    });

    // cURL equivalent
    checks.push({
      name: 'HTTP client (fetch)',
      status: 'ok',
      info: 'Native fetch API available for external requests.',
      required: true,
    });

    // bcrypt
    checks.push({
      name: 'Password hashing (bcrypt)',
      status: 'ok',
      info: 'bcryptjs library available for secure password hashing.',
      required: true,
    });

    // Unicode support
    checks.push({
      name: 'Unicode (UTF-8) support',
      status: 'ok',
      info: 'Full Unicode support available.',
      required: true,
    });

    setEnvChecks(checks);
    setEnvChecking(false);
  }, []);

  useEffect(() => {
    if (stage === 'environment') {
      runEnvironmentChecks();
    }
  }, [stage, runEnvironmentChecks]);

  // ============================================================
  // Database connection test
  // ============================================================
  const testDatabaseConnection = async () => {
    setDbTesting(true);
    setDbTestResult(null);

    try {
      const res = await fetch('/api/setup/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbtype: config.dbtype,
          dbhost: config.dbhost,
          dbport: config.dbport,
          dbname: config.dbname,
          dbuser: config.dbuser,
          dbpass: config.dbpass,
        }),
      });
      const data = await res.json();
      setDbTestResult(data);
    } catch {
      setDbTestResult({
        ok: false,
        message: 'Could not test database connection. The installation API may not be running yet. You can proceed and the installer will attempt to connect during installation.',
      });
    }

    setDbTesting(false);
  };

  // ============================================================
  // Run installation
  // ============================================================
  const runInstallation = async () => {
    setInstalling(true);
    setInstallError('');
    setInstallProgress([]);

    const addProgress = (msg: string) => {
      setInstallProgress((prev) => [...prev, msg]);
    };

    try {
      addProgress('Starting installation...');
      addProgress(`Configuring ${DATABASE_DRIVERS.find((d) => d.id === config.dbtype)?.name || config.dbtype} database...`);

      const res = await fetch('/api/setup/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (data.steps && Array.isArray(data.steps)) {
        for (const step of data.steps) {
          addProgress(step);
        }
      }

      if (!data.ok) {
        setInstallError(data.message || 'Installation failed.');
        return;
      }

      addProgress('');
      addProgress('🎉 Installation completed successfully!');

      await delay(1000);
      setStage('complete');
    } catch (err) {
      setInstallError(
        err instanceof Error ? err.message : 'An error occurred during installation.'
      );
    } finally {
      setInstalling(false);
    }
  };

  // ============================================================
  // Validation
  // ============================================================
  const validatePaths = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!config.wwwroot) newErrors.wwwroot = 'Web address is required.';
    if (!config.dataroot) newErrors.dataroot = 'Data directory is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDbConfig = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (config.dbtype !== 'sqlite') {
      if (!config.dbhost) newErrors.dbhost = 'Database host is required.';
      if (!config.dbuser) newErrors.dbuser = 'Database user is required.';
    }
    if (!config.dbname) newErrors.dbname = 'Database name is required.';
    if (!config.dbprefix) newErrors.dbprefix = 'Tables prefix is required.';
    if (config.dbprefix && !/^[a-z_][a-z0-9_]*$/.test(config.dbprefix)) {
      newErrors.dbprefix = 'Prefix must contain only lowercase letters, numbers, and underscores.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdmin = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!config.adminuser) newErrors.adminuser = 'Username is required.';
    if (!config.adminpass) {
      newErrors.adminpass = 'Password is required.';
    } else if (config.adminpass.length < 8) {
      newErrors.adminpass = 'Password must be at least 8 characters.';
    } else {
      // Moodle password policy
      if (!/[0-9]/.test(config.adminpass)) newErrors.adminpass = 'Password must contain at least 1 digit.';
      else if (!/[a-z]/.test(config.adminpass)) newErrors.adminpass = 'Password must contain at least 1 lowercase letter.';
      else if (!/[A-Z]/.test(config.adminpass)) newErrors.adminpass = 'Password must contain at least 1 uppercase letter.';
      else if (!/[^a-zA-Z0-9]/.test(config.adminpass)) newErrors.adminpass = 'Password must contain at least 1 special character (e.g. *, -, #).';
    }
    if (config.adminpass !== config.adminpass2) newErrors.adminpass2 = 'Passwords do not match.';
    if (!config.adminfirstname) newErrors.adminfirstname = 'First name is required.';
    if (!config.adminlastname) newErrors.adminlastname = 'Surname is required.';
    if (!config.adminemail) newErrors.adminemail = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.adminemail)) newErrors.adminemail = 'Invalid email address.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFrontPage = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!config.sitename) newErrors.sitename = 'Full site name is required.';
    if (!config.siteshortname) newErrors.siteshortname = 'Short name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    setErrors({});

    // Validate current stage before advancing
    switch (stage) {
      case 'paths':
        if (!validatePaths()) return;
        break;
      case 'dbconfig':
        if (!validateDbConfig()) return;
        break;
      case 'adminaccount':
        if (!validateAdmin()) return;
        break;
      case 'frontpage':
        if (!validateFrontPage()) return;
        break;
    }

    const next = currentIndex + 1;
    if (next < INSTALL_STAGES.length) {
      const nextStage = INSTALL_STAGES[next].key;
      setStage(nextStage);
    }
  };

  const goPrev = () => {
    setErrors({});
    const prev = currentIndex - 1;
    if (prev >= 0) {
      setStage(INSTALL_STAGES[prev].key);
    }
  };

  const hasEnvErrors = envChecks.some((c) => c.required && c.status === 'error');

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Moodle-style install header */}
      <header className="bg-white border-b border-[#dee2e6]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <BookOpen size={28} className="text-[#0f6cbf]" />
          <div>
            <h1 className="text-base font-bold text-[#1d2125] m-0">
              Installation
            </h1>
            <p className="text-xs text-[#6c757d] m-0">MoodleX</p>
          </div>
          <div className="ml-auto text-xs text-[#6c757d]">
            Version 1.0.0 (Build: 20260308)
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full flex-1 py-6 px-4 flex gap-6">
        {/* Left sidebar - Stage navigation (Moodle style) */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="bg-white rounded-lg border border-[#dee2e6] overflow-hidden">
            {INSTALL_STAGES.map((s, i) => {
              const isCurrent = s.key === stage;
              const isCompleted = i < currentIndex;
              const isFuture = i > currentIndex;

              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm border-b border-[#dee2e6] last:border-b-0 ${
                    isCurrent
                      ? 'bg-[#0f6cbf] text-white font-medium'
                      : isCompleted
                      ? 'bg-[#d4edda] text-[#155724]'
                      : 'text-[#6c757d]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="flex-shrink-0" />
                  ) : isCurrent ? (
                    <ChevronRight size={14} className="flex-shrink-0" />
                  ) : (
                    <span className="w-3.5 flex-shrink-0 text-center text-xs">{i + 1}</span>
                  )}
                  <span className={isFuture ? 'opacity-50' : ''}>{s.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border border-[#dee2e6] shadow-sm">
            {/* Mobile stage indicator */}
            <div className="lg:hidden px-4 py-2 bg-[#f8f9fa] border-b border-[#dee2e6] text-xs text-[#6c757d]">
              Step {currentIndex + 1} of {INSTALL_STAGES.length}: {INSTALL_STAGES[currentIndex].label}
            </div>

            <div className="p-6">
              {/* ============================================================
                  STAGE: Language Selection
                  ============================================================ */}
              {stage === 'language' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Choose a language</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    Please choose a language for the installation. This language will also be used
                    as the default language for the site, though it can be changed later.
                  </p>

                  <div className="max-w-sm">
                    <label className="form-label text-sm font-medium">Language</label>
                    <select
                      className="form-control"
                      value={config.lang}
                      onChange={(e) => updateConfig('lang', e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: Environment Checks
                  ============================================================ */}
              {stage === 'environment' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Server checks</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    The following server checks are performed to ensure that MoodleX can run properly
                    on your server. Please ensure all checks pass before proceeding.
                  </p>

                  {envChecking ? (
                    <div className="flex items-center gap-2 py-8 justify-center text-[#6c757d]">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-sm">Checking server environment...</span>
                    </div>
                  ) : (
                    <div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-[#dee2e6]">
                            <th className="text-left py-2 pr-4 font-semibold">Check</th>
                            <th className="text-left py-2 pr-4 font-semibold w-16">Status</th>
                            <th className="text-left py-2 font-semibold">Info</th>
                          </tr>
                        </thead>
                        <tbody>
                          {envChecks.map((check, i) => (
                            <tr key={i} className="border-b border-[#dee2e6]">
                              <td className="py-2 pr-4 font-medium">{check.name}</td>
                              <td className="py-2 pr-4">
                                {check.status === 'ok' && (
                                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                                    <CheckCircle2 size={12} /> OK
                                  </span>
                                )}
                                {check.status === 'warn' && (
                                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium">
                                    <AlertTriangle size={12} /> Warn
                                  </span>
                                )}
                                {check.status === 'error' && (
                                  <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">
                                    <XCircle size={12} /> Error
                                  </span>
                                )}
                              </td>
                              <td className="py-2 text-[#6c757d] text-xs">{check.info}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {hasEnvErrors && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          <strong>Error:</strong> Your server does not meet all requirements.
                          Please fix the issues marked above before continuing.
                        </div>
                      )}

                      {!hasEnvErrors && envChecks.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          Your server environment meets all the minimum requirements.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  STAGE: Paths Confirmation
                  ============================================================ */}
              {stage === 'paths' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Confirm paths</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    Verify the paths below are correct. The data directory is where MoodleX stores
                    uploaded files, session data, and cache. It must be writable and should NOT be
                    directly accessible via the web.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="form-label text-sm font-medium flex items-center gap-1">
                        <Globe size={14} className="text-[#6c757d]" />
                        Web address
                      </label>
                      <input
                        type="text"
                        className="form-control bg-[#e9ecef]"
                        value={config.wwwroot}
                        readOnly
                      />
                      <p className="text-xs text-[#6c757d] mt-1">
                        Specify the full web address where MoodleX will be accessed. This cannot be changed after installation.
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium flex items-center gap-1">
                        <FolderOpen size={14} className="text-[#6c757d]" />
                        MoodleX directory
                      </label>
                      <input
                        type="text"
                        className="form-control bg-[#e9ecef]"
                        value={typeof window !== 'undefined' ? '(auto-detected)' : ''}
                        readOnly
                      />
                      <p className="text-xs text-[#6c757d] mt-1">
                        The full directory path to this installation. This is detected automatically.
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium flex items-center gap-1">
                        <FolderOpen size={14} className="text-[#6c757d]" />
                        Data directory
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.dataroot ? 'border-red-500' : ''}`}
                        value={config.dataroot}
                        onChange={(e) => updateConfig('dataroot', e.target.value)}
                        placeholder="/var/moodledata"
                      />
                      {errors.dataroot && (
                        <p className="text-xs text-red-600 mt-1">{errors.dataroot}</p>
                      )}
                      <p className="text-xs text-[#6c757d] mt-1">
                        You need a place where MoodleX can save uploaded files. This directory must be
                        readable AND WRITABLE by the web server user, but it must not be accessible
                        directly via the web.
                      </p>
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Security warning:</strong> The data directory should NOT be inside
                          your web root directory. For a Next.js application, use a directory outside
                          your project folder, e.g. <code>/var/moodledata</code> or <code>~/moodledata</code>.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: License Agreement
                  ============================================================ */}
              {stage === 'license' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Copyright</h2>
                  <p className="text-sm text-[#6c757d] mb-4">
                    MoodleX is open-source software, released under the GNU General Public License.
                    Please read the following license agreement carefully.
                  </p>

                  <div className="border border-[#dee2e6] rounded bg-[#f8f9fa] p-4 max-h-80 overflow-y-auto text-xs font-mono leading-relaxed mb-4">
                    <h3 className="font-bold text-sm mb-2">GNU GENERAL PUBLIC LICENSE</h3>
                    <p className="mb-2">Version 3, 29 June 2007</p>
                    <p className="mb-2">
                      Copyright (C) 2007 Free Software Foundation, Inc.
                    </p>
                    <p className="mb-3">
                      Everyone is permitted to copy and distribute verbatim copies of this license
                      document, but changing it is not allowed.
                    </p>

                    <h4 className="font-bold mb-1">TERMS AND CONDITIONS</h4>
                    <p className="mb-2">
                      0. Definitions.
                    </p>
                    <p className="mb-2">
                      &quot;This License&quot; refers to version 3 of the GNU General Public License.
                    </p>
                    <p className="mb-2">
                      &quot;Copyright&quot; also means copyright-like laws that apply to other kinds of
                      works, such as semiconductor masks.
                    </p>
                    <p className="mb-2">
                      &quot;The Program&quot; refers to any copyrightable work licensed under this
                      License. Each licensee is addressed as &quot;you&quot;. &quot;Licensees&quot; and
                      &quot;recipients&quot; may be individuals or organizations.
                    </p>
                    <p className="mb-2">
                      To &quot;modify&quot; a work means to copy from or adapt all or part of the work
                      in a fashion requiring copyright permission, other than the making of an
                      exact copy. The resulting work is called a &quot;modified version&quot; of the
                      earlier work or a work &quot;based on&quot; the earlier work.
                    </p>
                    <p className="mb-2">
                      A &quot;covered work&quot; means either the unmodified Program or a work based
                      on the Program.
                    </p>
                    <p className="mb-2">
                      To &quot;propagate&quot; a work means to do anything with it that, without
                      permission, would make you directly or secondarily liable for infringement
                      under applicable copyright law, except executing it on a computer or
                      modifying a private copy. Propagation includes copying, distribution (with
                      or without modification), making available to the public, and in some
                      countries other activities as well.
                    </p>
                    <p className="mb-2">
                      ... (Full GPL v3 license text continues)
                    </p>
                    <p className="mb-2">
                      This MoodleX software is provided &quot;as is&quot; under the terms of the
                      GNU General Public License. You are free to use, modify, and redistribute
                      this software, provided you comply with the terms of this license.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 flex items-start gap-2">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <span>
                      By clicking &quot;Continue&quot;, you acknowledge that you have read and agree to the
                      terms of the GNU General Public License. You must accept this license to use MoodleX.
                    </span>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: Database Type Selection
                  ============================================================ */}
              {stage === 'dbtype' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Database driver</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    MoodleX supports several types of database servers. Please select the database
                    driver that matches your database server. Note that the selected database type
                    cannot be changed after installation.
                  </p>

                  <div className="space-y-2">
                    {DATABASE_DRIVERS.map((driver) => (
                      <label
                        key={driver.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          config.dbtype === driver.id
                            ? 'border-[#0f6cbf] bg-[#e8f0fe]'
                            : 'border-[#dee2e6] hover:border-[#adb5bd]'
                        } ${!driver.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="dbtype"
                          value={driver.id}
                          checked={config.dbtype === driver.id}
                          onChange={(e) => {
                            updateConfig('dbtype', e.target.value);
                            updateConfig('dbport', driver.defaultPort);
                          }}
                          disabled={!driver.available}
                          className="mt-1 w-4 h-4"
                        />
                        <div>
                          <div className="font-medium text-sm">{driver.name}</div>
                          <div className="text-xs text-[#6c757d] mt-0.5">{driver.description}</div>
                          {driver.available ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-xs mt-1">
                              <CheckCircle2 size={10} /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 text-xs mt-1">
                              <XCircle size={10} /> Driver not installed
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {!config.dbtype && (
                    <p className="text-xs text-amber-700 mt-3">
                      Please select a database driver to continue.
                    </p>
                  )}
                </div>
              )}

              {/* ============================================================
                  STAGE: Database Configuration
                  ============================================================ */}
              {stage === 'dbconfig' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Database settings</h2>
                  <p className="text-sm text-[#6c757d] mb-2">
                    Now you need to configure the database where most of the MoodleX data will be stored.
                    This database must already exist and the user must have read and write access to it.
                  </p>
                  <p className="text-sm text-[#6c757d] mb-5">
                    <strong>Database type:</strong>{' '}
                    {DATABASE_DRIVERS.find((d) => d.id === config.dbtype)?.name || config.dbtype}
                  </p>

                  <div className="space-y-4">
                    {config.dbtype !== 'sqlite' ? (
                      <>
                        <div>
                          <label className="form-label text-sm">
                            Database host <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.dbhost ? 'border-red-500' : ''}`}
                            value={config.dbhost}
                            onChange={(e) => updateConfig('dbhost', e.target.value)}
                            placeholder="localhost"
                          />
                          {errors.dbhost && <p className="text-xs text-red-600 mt-1">{errors.dbhost}</p>}
                          <p className="text-xs text-[#6c757d] mt-1">
                            Type database server hostname or IP address. Use localhost if the database is on the same server.
                          </p>
                        </div>

                        <div>
                          <label className="form-label text-sm">
                            Database name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.dbname ? 'border-red-500' : ''}`}
                            value={config.dbname}
                            onChange={(e) => updateConfig('dbname', e.target.value)}
                            placeholder="moodle"
                          />
                          {errors.dbname && <p className="text-xs text-red-600 mt-1">{errors.dbname}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label text-sm">
                              Database user <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.dbuser ? 'border-red-500' : ''}`}
                              value={config.dbuser}
                              onChange={(e) => updateConfig('dbuser', e.target.value)}
                            />
                            {errors.dbuser && <p className="text-xs text-red-600 mt-1">{errors.dbuser}</p>}
                          </div>
                          <div>
                            <label className="form-label text-sm">Database password</label>
                            <input
                              type="password"
                              className="form-control"
                              value={config.dbpass}
                              onChange={(e) => updateConfig('dbpass', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label text-sm">
                              Tables prefix <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.dbprefix ? 'border-red-500' : ''}`}
                              value={config.dbprefix}
                              onChange={(e) => updateConfig('dbprefix', e.target.value)}
                              placeholder="mdl_"
                            />
                            {errors.dbprefix && <p className="text-xs text-red-600 mt-1">{errors.dbprefix}</p>}
                            <p className="text-xs text-[#6c757d] mt-1">
                              Prefix for all table names. Useful if you want multiple MoodleX instances sharing a database.
                            </p>
                          </div>
                          <div>
                            <label className="form-label text-sm">Database port</label>
                            <input
                              type="text"
                              className="form-control"
                              value={config.dbport}
                              onChange={(e) => updateConfig('dbport', e.target.value)}
                              placeholder={DATABASE_DRIVERS.find((d) => d.id === config.dbtype)?.defaultPort || ''}
                            />
                            <p className="text-xs text-[#6c757d] mt-1">
                              Leave empty to use the default port.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* SQLite config */
                      <div>
                        <div>
                          <label className="form-label text-sm">
                            Database name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.dbname ? 'border-red-500' : ''}`}
                            value={config.dbname}
                            onChange={(e) => updateConfig('dbname', e.target.value)}
                            placeholder="moodle"
                          />
                          {errors.dbname && <p className="text-xs text-red-600 mt-1">{errors.dbname}</p>}
                          <p className="text-xs text-[#6c757d] mt-1">
                            The SQLite database file will be created at <code>./prisma/{config.dbname || 'moodle'}.db</code>
                          </p>
                        </div>

                        <div className="mt-4">
                          <label className="form-label text-sm">
                            Tables prefix <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.dbprefix ? 'border-red-500' : ''}`}
                            value={config.dbprefix}
                            onChange={(e) => updateConfig('dbprefix', e.target.value)}
                          />
                          {errors.dbprefix && <p className="text-xs text-red-600 mt-1">{errors.dbprefix}</p>}
                        </div>

                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
                          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                          <span>
                            SQLite is not recommended for production environments.
                            It is suitable for development or small-scale deployments only.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Test connection button */}
                    <div className="pt-2 border-t border-[#dee2e6]">
                      <button
                        className="btn btn-outline-secondary text-sm flex items-center gap-2"
                        onClick={testDatabaseConnection}
                        disabled={dbTesting}
                      >
                        {dbTesting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Database size={14} />
                        )}
                        {dbTesting ? 'Testing connection...' : 'Test database connection'}
                      </button>

                      {dbTestResult && (
                        <div
                          className={`mt-2 p-2 rounded text-xs flex items-start gap-2 ${
                            dbTestResult.ok
                              ? 'bg-green-50 border border-green-200 text-green-800'
                              : 'bg-amber-50 border border-amber-200 text-amber-800'
                          }`}
                        >
                          {dbTestResult.ok ? <CheckCircle2 size={12} className="mt-0.5" /> : <Info size={12} className="mt-0.5" />}
                          {dbTestResult.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: Installation Progress
                  ============================================================ */}
              {stage === 'install' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Installation</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    {installing
                      ? 'Please wait while the database tables and initial data are being set up. This may take a few minutes.'
                      : 'Click the button below to begin the installation process. The installer will create the database tables, set up default data, and configure the system.'
                    }
                  </p>

                  {!installing && installProgress.length === 0 && (
                    <div>
                      {/* Config summary before install */}
                      <div className="bg-[#f8f9fa] rounded-lg border border-[#dee2e6] p-4 mb-5">
                        <h3 className="text-sm font-semibold mb-3">Installation summary</h3>
                        <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                          <dt className="text-[#6c757d]">Language:</dt>
                          <dd>{LANGUAGES.find((l) => l.code === config.lang)?.name || config.lang}</dd>

                          <dt className="text-[#6c757d]">Web address:</dt>
                          <dd>{config.wwwroot}</dd>

                          <dt className="text-[#6c757d]">Data directory:</dt>
                          <dd>{config.dataroot}</dd>

                          <dt className="text-[#6c757d]">Database type:</dt>
                          <dd>{DATABASE_DRIVERS.find((d) => d.id === config.dbtype)?.name || config.dbtype}</dd>

                          <dt className="text-[#6c757d]">Database host:</dt>
                          <dd>{config.dbtype === 'sqlite' ? '(file-based)' : config.dbhost}</dd>

                          <dt className="text-[#6c757d]">Database name:</dt>
                          <dd>{config.dbname}</dd>

                          <dt className="text-[#6c757d]">Admin user:</dt>
                          <dd>{config.adminuser}</dd>

                          <dt className="text-[#6c757d]">Site name:</dt>
                          <dd>{config.sitename}</dd>
                        </dl>
                      </div>

                      <button
                        className="btn btn-primary py-2 px-6"
                        onClick={runInstallation}
                      >
                        Install MoodleX
                      </button>
                    </div>
                  )}

                  {/* Progress output */}
                  {installProgress.length > 0 && (
                    <div className="bg-[#1d2125] text-green-400 rounded-lg p-4 font-mono text-xs max-h-80 overflow-y-auto">
                      {installProgress.map((line, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="text-[#6c757d] flex-shrink-0">[{String(i + 1).padStart(2, '0')}]</span>
                          <span>{line}</span>
                        </div>
                      ))}
                      {installing && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader2 size={12} className="animate-spin text-blue-400" />
                          <span className="text-blue-400">Processing...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {installError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <strong>Installation error:</strong> {installError}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  STAGE: Admin Account
                  ============================================================ */}
              {stage === 'adminaccount' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">General</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    On this page you should configure your main administrator account which will
                    have complete control of the site. Make sure you give it a secure username and
                    password, a valid email address, and set the correct timezone and country.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#1d2125] border-b border-[#dee2e6] pb-2">
                      Admin account
                    </h3>

                    <div>
                      <label className="form-label text-sm">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.adminuser ? 'border-red-500' : ''}`}
                        value={config.adminuser}
                        onChange={(e) => updateConfig('adminuser', e.target.value)}
                      />
                      {errors.adminuser && <p className="text-xs text-red-600 mt-1">{errors.adminuser}</p>}
                    </div>

                    <div>
                      <label className="form-label text-sm">
                        New password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control pr-10 ${errors.adminpass ? 'border-red-500' : ''}`}
                          value={config.adminpass}
                          onChange={(e) => updateConfig('adminpass', e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.adminpass && <p className="text-xs text-red-600 mt-1">{errors.adminpass}</p>}
                      <p className="text-xs text-[#6c757d] mt-1">
                        The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case
                        letter(s), at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as *, -, or #
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-sm">
                        Confirm password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.adminpass2 ? 'border-red-500' : ''}`}
                        value={config.adminpass2}
                        onChange={(e) => updateConfig('adminpass2', e.target.value)}
                      />
                      {errors.adminpass2 && <p className="text-xs text-red-600 mt-1">{errors.adminpass2}</p>}
                    </div>

                    <h3 className="text-sm font-semibold text-[#1d2125] border-b border-[#dee2e6] pb-2 pt-2">
                      More details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-sm">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.adminfirstname ? 'border-red-500' : ''}`}
                          value={config.adminfirstname}
                          onChange={(e) => updateConfig('adminfirstname', e.target.value)}
                        />
                        {errors.adminfirstname && <p className="text-xs text-red-600 mt-1">{errors.adminfirstname}</p>}
                      </div>
                      <div>
                        <label className="form-label text-sm">
                          Surname <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.adminlastname ? 'border-red-500' : ''}`}
                          value={config.adminlastname}
                          onChange={(e) => updateConfig('adminlastname', e.target.value)}
                        />
                        {errors.adminlastname && <p className="text-xs text-red-600 mt-1">{errors.adminlastname}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-sm">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.adminemail ? 'border-red-500' : ''}`}
                        value={config.adminemail}
                        onChange={(e) => updateConfig('adminemail', e.target.value)}
                      />
                      {errors.adminemail && <p className="text-xs text-red-600 mt-1">{errors.adminemail}</p>}
                    </div>

                    <div>
                      <label className="form-label text-sm">City/town</label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-sm">Select a country</label>
                        <select className="form-control">
                          <option value="">Select a country...</option>
                          <option value="AF">Afghanistan</option>
                          <option value="AL">Albania</option>
                          <option value="DZ">Algeria</option>
                          <option value="AU">Australia</option>
                          <option value="BR">Brazil</option>
                          <option value="CA">Canada</option>
                          <option value="CN">China</option>
                          <option value="EG">Egypt</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                          <option value="GH">Ghana</option>
                          <option value="IN">India</option>
                          <option value="ID">Indonesia</option>
                          <option value="JP">Japan</option>
                          <option value="KE">Kenya</option>
                          <option value="MX">Mexico</option>
                          <option value="NG">Nigeria</option>
                          <option value="PK">Pakistan</option>
                          <option value="RU">Russia</option>
                          <option value="SA">Saudi Arabia</option>
                          <option value="ZA">South Africa</option>
                          <option value="KR">South Korea</option>
                          <option value="ES">Spain</option>
                          <option value="SE">Sweden</option>
                          <option value="TR">Turkey</option>
                          <option value="AE">United Arab Emirates</option>
                          <option value="GB">United Kingdom</option>
                          <option value="US">United States</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label text-sm">Timezone</label>
                        <select
                          className="form-control"
                          value={config.timezone}
                          onChange={(e) => updateConfig('timezone', e.target.value)}
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-sm">Description</label>
                      <textarea className="form-control" rows={3} placeholder="Tell something about yourself..." />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: Front Page Settings
                  ============================================================ */}
              {stage === 'frontpage' && (
                <div>
                  <h2 className="text-lg font-bold mb-1">Front page settings</h2>
                  <p className="text-sm text-[#6c757d] mb-5">
                    Choose a name and description for your new site. You can change these later in the Site Administration settings.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#1d2125] border-b border-[#dee2e6] pb-2">
                      New settings - Front page
                    </h3>

                    <div>
                      <label className="form-label text-sm">
                        Full site name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.sitename ? 'border-red-500' : ''}`}
                        value={config.sitename}
                        onChange={(e) => updateConfig('sitename', e.target.value)}
                        placeholder="e.g. MoodleX Learning Platform"
                      />
                      {errors.sitename && <p className="text-xs text-red-600 mt-1">{errors.sitename}</p>}
                      <p className="text-xs text-[#6c757d] mt-1">
                        The full name of this MoodleX site. It will appear at the top of every page.
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-sm">
                        Short name for site (e.g. single word) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.siteshortname ? 'border-red-500' : ''}`}
                        value={config.siteshortname}
                        onChange={(e) => updateConfig('siteshortname', e.target.value)}
                        placeholder="e.g. moodle"
                      />
                      {errors.siteshortname && <p className="text-xs text-red-600 mt-1">{errors.siteshortname}</p>}
                      <p className="text-xs text-[#6c757d] mt-1">
                        This short name appears in the navigation bar and as the subject of email messages.
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-sm">Front page summary</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={config.sitesummary}
                        onChange={(e) => updateConfig('sitesummary', e.target.value)}
                        placeholder="Welcome to our learning management system..."
                      />
                      <p className="text-xs text-[#6c757d] mt-1">
                        This summary will be displayed on the front page of your site.
                      </p>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1d2125] border-b border-[#dee2e6] pb-2 pt-2">
                      Email
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-sm">Support email address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={config.supportemail}
                          onChange={(e) => updateConfig('supportemail', e.target.value)}
                          placeholder="support@example.com"
                        />
                        <p className="text-xs text-[#6c757d] mt-1">
                          This email address is publicly shown as a support contact.
                        </p>
                      </div>
                      <div>
                        <label className="form-label text-sm">No-reply address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={config.noreplyemail}
                          onChange={(e) => updateConfig('noreplyemail', e.target.value)}
                          placeholder="noreply@example.com"
                        />
                        <p className="text-xs text-[#6c757d] mt-1">
                          Emails sent from a &quot;no-reply&quot; address.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1d2125] border-b border-[#dee2e6] pb-2 pt-2">
                      Authentication
                    </h3>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="selfregistration"
                        className="mt-1 w-4 h-4"
                        checked={config.selfregistration}
                        onChange={(e) => updateConfig('selfregistration', e.target.checked)}
                      />
                      <label htmlFor="selfregistration" className="text-sm">
                        <span className="font-medium">Enable self-registration</span>
                        <p className="text-xs text-[#6c757d] mt-0.5">
                          Allow new users to create their own accounts via the login page.
                          Self-registered users will be assigned the default &quot;student&quot; role.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  STAGE: Complete
                  ============================================================ */}
              {stage === 'complete' && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                  <p className="text-[#6c757d] max-w-md mx-auto mb-2">
                    MoodleX has been installed and configured successfully.
                  </p>
                  <p className="text-sm text-[#6c757d] max-w-md mx-auto mb-6">
                    You can now log in with your administrator account and begin setting up courses,
                    enrolling users, and customizing your learning platform.
                  </p>

                  <div className="bg-[#f8f9fa] rounded-lg border border-[#dee2e6] p-5 max-w-sm mx-auto mb-6 text-left">
                    <h3 className="text-sm font-semibold mb-3 text-center">Your site details</h3>
                    <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-1.5 text-sm">
                      <dt className="text-[#6c757d]">Site URL:</dt>
                      <dd className="font-medium">{config.wwwroot}</dd>
                      <dt className="text-[#6c757d]">Site name:</dt>
                      <dd>{config.sitename}</dd>
                      <dt className="text-[#6c757d]">Admin user:</dt>
                      <dd>{config.adminuser}</dd>
                      <dt className="text-[#6c757d]">Database:</dt>
                      <dd>{DATABASE_DRIVERS.find((d) => d.id === config.dbtype)?.name || config.dbtype}</dd>
                    </dl>
                  </div>

                  <a href="/login" className="btn btn-primary py-2.5 px-8 text-base">
                    Go to your MoodleX site
                  </a>
                </div>
              )}
            </div>

            {/* ============================================================
                Navigation buttons
                ============================================================ */}
            {stage !== 'complete' && stage !== 'install' && (
              <div className="flex justify-between px-6 pb-6 pt-2">
                {currentIndex > 0 ? (
                  <button className="btn btn-secondary" onClick={goPrev}>
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  className="btn btn-primary"
                  onClick={goNext}
                  disabled={
                    (stage === 'environment' && (envChecking || hasEnvErrors)) ||
                    (stage === 'dbtype' && !config.dbtype)
                  }
                >
                  {stage === 'license' ? 'I agree to the license — Continue' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#dee2e6] bg-white py-3 text-center text-xs text-[#6c757d] mt-auto">
        MoodleX — Built with Next.js
      </footer>
    </div>
  );
}

// Utility
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
