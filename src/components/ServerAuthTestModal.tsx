import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Play,
  RefreshCw,
  Key,
  Lock,
  UserCheck,
  Database,
  Clock,
  Terminal,
} from 'lucide-react';
import { authService, ServerAuthReport } from '../services/authService';

interface ServerAuthTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ServerAuthTestModal: React.FC<ServerAuthTestModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ServerAuthReport | null>(null);
  const [activeTab, setActiveTab] = useState<'suite' | 'interactive'>('suite');

  // Interactive tester states
  const [testEmail, setTestEmail] = useState('sara.ahmed@example.com');
  const [testPassword, setTestPassword] = useState('Password123!');
  const [interactiveResult, setInteractiveResult] = useState<{
    endpoint: string;
    status: number;
    data: any;
    durationMs: number;
  } | null>(null);
  const [interactiveLoading, setInteractiveLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const data = await authService.runServerAuthTests();
      setReport(data);
      if (data.allPassed) {
        onNotify('All 5 Server-Side Auth Tests Passed Successfully!');
      } else {
        onNotify('Some Server-Side Auth Tests Failed. Check report.');
      }
    } catch (e: any) {
      onNotify(`Test execution failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestLogin = async (isCorrectPassword = true) => {
    setInteractiveLoading(true);
    const start = performance.now();
    try {
      const pwd = isCorrectPassword ? testPassword : 'WrongPassword999!';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: pwd }),
      });
      const data = await res.json();
      setInteractiveResult({
        endpoint: 'POST /api/auth/login',
        status: res.status,
        data,
        durationMs: Math.round(performance.now() - start),
      });
    } catch (err: any) {
      setInteractiveResult({
        endpoint: 'POST /api/auth/login',
        status: 500,
        data: { error: err.message },
        durationMs: Math.round(performance.now() - start),
      });
    } finally {
      setInteractiveLoading(false);
    }
  };

  const handleTestSessionMe = async () => {
    setInteractiveLoading(true);
    const start = performance.now();
    try {
      const token = authService.getToken();
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || 'invalid_token_sample'}`,
        },
      });
      const data = await res.json();
      setInteractiveResult({
        endpoint: 'GET /api/auth/me',
        status: res.status,
        data,
        durationMs: Math.round(performance.now() - start),
      });
    } catch (err: any) {
      setInteractiveResult({
        endpoint: 'GET /api/auth/me',
        status: 500,
        data: { error: err.message },
        durationMs: Math.round(performance.now() - start),
      });
    } finally {
      setInteractiveLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-950 text-white">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                Server-Side Authentication Test &amp; Diagnostics
              </h2>
              <p className="text-[11px] text-neutral-400">
                Express Backend • PBKDF2-SHA256 • Bearer Sessions • /api/auth/*
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('suite')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'suite'
                ? 'border-neutral-900 bg-white text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Automated Test Suite (5 Tests)
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'interactive'
                ? 'border-neutral-900 bg-white text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Interactive Endpoint Testing
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'suite' ? (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      report?.allPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {report?.allPassed ? '✓' : '!'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Status:{' '}
                      <span
                        className={
                          report?.allPassed ? 'text-emerald-700 font-extrabold' : 'text-red-600'
                        }
                      >
                        {report?.allPassed ? 'All Server Tests Passed' : 'Tests Pending / Failed'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {report?.testsPassed || 0} of {report?.testsRun || 0} checks successful •{' '}
                      {report?.totalDurationMs || 0}ms total
                    </div>
                  </div>
                </div>

                <button
                  onClick={runTests}
                  disabled={loading}
                  className="px-4 py-2 bg-neutral-900 text-white hover:bg-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Running Tests...' : 'Re-Run Test Suite'}</span>
                </button>
              </div>

              {/* Individual Test Cards */}
              <div className="space-y-2.5">
                {report?.tests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border border-neutral-200 rounded-xs bg-white hover:border-neutral-400 transition-colors flex items-start gap-3"
                  >
                    <div className="pt-0.5">
                      {t.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">
                          {idx + 1}. {t.testName}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                          {t.durationMs}ms
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                        {t.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Server Diagnostics Metadata */}
              {report?.diagnostics && (
                <div className="p-3 bg-neutral-900 text-neutral-300 rounded-xs text-[11px] font-mono space-y-1">
                  <div className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Live Server Metrics:
                  </div>
                  <div>• Server Port: {report.diagnostics.serverPort} (0.0.0.0)</div>
                  <div>• Active Bearer Sessions: {report.diagnostics.activeSessions}</div>
                  <div>• Registered Users in Store: {report.diagnostics.registeredUsers}</div>
                  <div>• Auth Method: {report.diagnostics.authMethod}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-neutral-600">
                Execute live HTTP calls against the backend server-side authentication routes and inspect the returned status codes and payload.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-xs focus:outline-hidden focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-neutral-700 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-xs focus:outline-hidden focus:border-neutral-900 font-mono"
                  />
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleTestLogin(true)}
                  disabled={interactiveLoading}
                  className="px-3 py-2 bg-neutral-900 text-white hover:bg-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>Test Valid Login (POST /api/auth/login)</span>
                </button>

                <button
                  onClick={() => handleTestLogin(false)}
                  disabled={interactiveLoading}
                  className="px-3 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Test Invalid Password (Expect 401)</span>
                </button>

                <button
                  onClick={handleTestSessionMe}
                  disabled={interactiveLoading}
                  className="px-3 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Key className="w-3 h-3 text-blue-500" />
                  <span>Test Session Check (GET /api/auth/me)</span>
                </button>
              </div>

              {/* Interactive Response Terminal */}
              {interactiveResult && (
                <div className="mt-3 border border-neutral-800 rounded-xs overflow-hidden bg-neutral-950 text-neutral-200">
                  <div className="p-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400">
                      {interactiveResult.endpoint}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded-xs font-bold text-[10px] ${
                          interactiveResult.status >= 200 && interactiveResult.status < 300
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                            : 'bg-red-950 text-red-400 border border-red-700'
                        }`}
                      >
                        HTTP {interactiveResult.status}
                      </span>
                      <span className="text-neutral-400 text-[10px]">
                        {interactiveResult.durationMs}ms
                      </span>
                    </div>
                  </div>
                  <pre className="p-3 text-[11px] font-mono overflow-x-auto text-emerald-300 max-h-52">
                    {JSON.stringify(interactiveResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Server Auth is securely integrated with AI Studio runtime</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
