import React, { useState } from "react";
import { X, Mail, Lock, LogIn, UserPlus, KeyRound, LogOut, CheckCircle, AlertCircle, Database, ShieldCheck } from "lucide-react";
import { type User } from "firebase/auth";
import { signInWithEmail, signUpWithEmail, resetPassword, logoutUser } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess: (message: string) => void;
}

type AuthTab = "login" | "register" | "forgot";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  if (!isOpen) return null;

  const getFriendlyError = (err: any): string => {
    const code = err?.code || "";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
      return "E-mail ou senha incorretos. Verifique e tente novamente.";
    }
    if (code.includes("email-already-in-use")) {
      return "Este e-mail já está cadastrado. Faça login ou recupere sua senha.";
    }
    if (code.includes("weak-password")) {
      return "A senha deve conter no mínimo 6 caracteres.";
    }
    if (code.includes("invalid-email")) {
      return "Por favor, insira um e-mail válido.";
    }
    if (code.includes("network-request-failed")) {
      return "Falha de conexão com os servidores do Firebase. Verifique sua internet.";
    }
    return err?.message || "Ocorreu um erro ao processar. Tente novamente.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      onSuccess("Login efetuado com sucesso! Orçamentos sincronizados.");
      onClose();
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Preencha o e-mail e a senha.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
      onSuccess("Conta criada com sucesso! Seus orçamentos agora são salvos na nuvem.");
      onClose();
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim()) {
      setErrorMessage("Digite o e-mail cadastrado para enviarmos as instruções.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setInfoMessage("Link de redefinição de senha enviado para seu e-mail! Verifique sua caixa de entrada e spam.");
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      onSuccess("Você saiu da sua conta Firebase. Os dados continuam salvos neste dispositivo.");
      onClose();
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all active:scale-95"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-sky-400">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-1.5">
              Conta Firebase Firestore
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Servidor Seguro em São Paulo (southamerica-east1)
            </p>
          </div>
        </div>

        {/* Logged in state */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                Conectado com Sucesso
              </div>
              <p className="text-sm font-semibold text-white break-all">{currentUser.email}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Seus orçamentos e perfil profissional estão sincronizados em tempo real na nuvem do Google Firebase.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  tab === "login"
                    ? "bg-sky-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  tab === "register"
                    ? "bg-sky-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Error & Info Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {infoMessage && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTab("forgot");
                        setErrorMessage("");
                        setInfoMessage("");
                      }}
                      className="text-[10px] text-sky-400 hover:underline font-semibold"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Entrar na Conta
                    </>
                  )}
                </button>
              </form>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Seu Melhor E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Crie uma Senha (mínimo 6 dígitos)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Confirme a Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Criando conta...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Criar Conta Firebase
                    </>
                  )}
                </button>
              </form>
            )}

            {tab === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">
                  Informe o seu e-mail cadastrado para receber um link seguro de recuperação de acesso.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Enviar Link de Redefinição
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErrorMessage("");
                      setInfoMessage("");
                    }}
                    className="text-xs text-slate-400 hover:text-white font-bold"
                  >
                    Voltar para o Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
