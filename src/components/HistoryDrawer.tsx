import { type FC } from "react";
import {
  X,
  Trash2,
  Calendar,
  Phone,
  DollarSign,
  Folder,
  Cloud,
  Lock,
  LogIn,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { Quote } from "../types";
import { CATEGORIES } from "../data/categories";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: Quote[];
  onDeleteQuote: (id: number) => void;
  onSelectQuote: (quote: Quote) => void;
  onStatusChange?: (id: number, status: "aprovado" | "pendente" | "cancelado") => void;
  isCloudConnected?: boolean;
  userEmail?: string;
  isUserRegistered?: boolean;
  onOpenAuth?: () => void;
}

export const HistoryDrawer: FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  quotes,
  onDeleteQuote,
  onSelectQuote,
  onStatusChange,
  isCloudConnected,
  userEmail,
  isUserRegistered,
  onOpenAuth,
}) => {
  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out border-l border-slate-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/80 safe-pt">
          <div>
            <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight flex items-center gap-1.5">
              Histórico de Orçamentos
              {!isUserRegistered && <Lock className="w-3.5 h-3.5 text-amber-500" />}
            </h2>
            {isUserRegistered ? (
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Cloud className="w-3 h-3 text-emerald-600" />
                Conta Ativa ({userEmail?.split("@")[0]})
              </p>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5 text-left transition-colors"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                Requer Conta Cadastrada
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 active:scale-95 transition-all hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONDICIONAL: SE O USUÁRIO NÃO ESTIVER CADASTRADO / LOGADO */}
        {!isUserRegistered ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-5 bg-gradient-to-b from-slate-50 to-white">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm animate-bounce duration-1000">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xs">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                ACESSO RESTRITO
              </span>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                Crie ou Acesse sua Conta
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                O acesso ao histórico de orçamentos é exclusivo para usuários cadastrados. Crie sua conta gratuita em menos de 1 minuto para salvar e gerenciar todos os seus orçamentos na nuvem.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3 pt-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Criar Conta ou Entrar
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                100% Gratuito e Seguro
              </div>
            </div>
          </div>
        ) : (
          /* Quotes List Quando Autenticado */
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {quotes.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Nenhum orçamento salvo
                </p>
              </div>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3 relative group transition-all hover:border-sky-100 hover:shadow-md"
                >
                  <button
                    onClick={() => onDeleteQuote(q.id)}
                    className="absolute top-3 right-3 p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-full active:scale-90 transition-all"
                    title="Excluir Orçamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {(() => {
                    const quoteCat = CATEGORIES.find((c) => c.id === q.category) || CATEGORIES[0];
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            <Folder className="w-2.5 h-2.5 text-slate-500" />
                            {quoteCat.title}
                          </span>
                        </div>

                        <div className="space-y-1 pr-6" onClick={() => onSelectQuote(q)}>
                          <span className="text-[9px] font-bold text-sky-600 uppercase tracking-widest block">
                            {q.data}
                          </span>
                          <h4 className="font-black text-slate-800 text-sm uppercase leading-tight cursor-pointer hover:text-sky-600 transition-colors">
                            {q.cliente}
                          </h4>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-semibold border-t border-slate-50 pt-2">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {q.telefone}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-700">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      R$ {q.total}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2 text-[10px] space-y-1 font-semibold text-slate-600">
                    {q.items.map((item, index) => (
                      <div key={item.id || index} className="flex justify-between items-center">
                        <span className="truncate max-w-[150px]">{item.desc}</span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {item.model} • {item.power}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Status Selector */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      STATUS
                    </span>
                    <select
                      value={q.status || "aprovado"}
                      onChange={(e) => onStatusChange?.(q.id, e.target.value as any)}
                      className={`text-[9px] font-extrabold uppercase tracking-wider rounded-lg px-2 py-1 focus:outline-none border cursor-pointer transition-all ${
                        (q.status || "aprovado") === "aprovado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : (q.status || "aprovado") === "pendente"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <option value="aprovado">Aprovado</option>
                      <option value="pendente">Pendente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="p-4 safe-pb bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
            {isUserRegistered
              ? "Orçamentos sincronizados de forma segura no Firebase Firestore."
              : "Crie sua conta para manter seus orçamentos permanentemente salvos."}
          </p>
        </div>
      </div>
    </>
  );
};
