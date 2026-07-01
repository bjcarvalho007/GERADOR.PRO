import { type FC } from "react";
import { X, Trash2, Calendar, Phone, DollarSign, Folder } from "lucide-react";
import { Quote } from "../types";
import { CATEGORIES } from "../data/categories";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: Quote[];
  onDeleteQuote: (id: number) => void;
  onSelectQuote: (quote: Quote) => void;
  onStatusChange?: (id: number, status: "aprovado" | "pendente" | "cancelado") => void;
}

export const HistoryDrawer: FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  quotes,
  onDeleteQuote,
  onSelectQuote,
  onStatusChange,
}) => {
  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
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
            <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">
              Histórico de Orçamentos
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Salvos neste aparelho
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 active:scale-95 transition-all hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quotes List */}
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
                  const quoteCat = CATEGORIES.find(c => c.id === q.category) || CATEGORIES[0];
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
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">STATUS</span>
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

        <div className="p-4 safe-pb bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
            Utilize o local storage para reter dados. <br />
            Limpar os dados de navegação removerá os registros.
          </p>
        </div>
      </div>
    </>
  );
};
