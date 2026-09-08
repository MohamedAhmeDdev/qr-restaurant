import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, RotateCcw, CheckCircle2, AlertCircle, 
  Loader2, ArrowLeft, ShieldAlert, ArrowRight, Sparkles 
} from 'lucide-react';
import api from '../../services/api'; 

export default function RestoreOrganizations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Replaced `status` string state with standard status flags
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [restoredOrg, setRestoredOrg] = useState(null);

  useEffect(() => {
    if (token && email) {
      handleRestore();
    }
  }, [token, email]);

  const handleRestore = async () => {
    if (!token || !email) {
      setErrorMessage('Missing required restoration token or email parameters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setIsSuccess(false);

    try {
      const response = await api.post('/organization/restore', { token, email });
      setSuccessMessage(response.data?.message);
      if (response.data?.organization) {
        setRestoredOrg(response.data.organization);
      }
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMissingParams = !token || !email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6">
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Decorative Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Icon & Title */}
          <div className="text-center space-y-4">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 text-orange-500 shadow-sm">
              <RotateCcw className="w-7 h-7" strokeWidth={1.5} />
              {isSuccess && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Restore Workspace
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Recover your deleted organization and restore access to all associated restaurants, menus, and historical data.
              </p>
            </div>
          </div>

          {/* ── State: Missing Params ── */}
          {hasMissingParams && !isLoading && !isSuccess && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Invalid Restoration Link
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                    No restoration token was found. Please ensure you are using the complete, unmodified link sent to your email.
                  </p>
                </div>
              </div>
              
              <Link
                to="/login"
                className="group w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Login
              </Link>
            </div>
          )}

          {/* ── State: Loading ── */}
          {isLoading && (
            <div className="py-6 text-center space-y-4 animate-in fade-in duration-300">
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-orange-200 dark:border-orange-900/50 animate-ping opacity-20" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Validating and Restoring...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Please wait while we securely reactivate your organization's resources.
                </p>
              </div>
            </div>
          )}

          {/* ── State: Success ── */}
          {isSuccess && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                    Restoration Complete <Sparkles className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                    {successMessage}
                    {restoredOrg?.name && (
                      <span className="block mt-1 font-bold text-emerald-900 dark:text-emerald-200">
                        Workspace: "{restoredOrg.name}"
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="group w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]"
              >
                <Building2 className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* ── State: Error ── */}
          {errorMessage && !isLoading && !isSuccess && !hasMissingParams && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1">Restoration Failed</p>
                  <p className="text-xs text-rose-700 dark:text-rose-400/80 leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRestore}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Login
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}