import { type FC, useState } from "react";
import { Crown, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  isBlockedByLimit: boolean;
  onActivate: (success: boolean, message: string) => void;
}

export const PremiumModal: FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  deviceId,
  isBlockedByLimit,
  onActivate,
}) => {
  const [activationCode, setActivationCode] = useState("");
  const SUPORTE_WHATSAPP = "5563992092699";
  const MERCADO_LIVRE_LINK = "https://mpago.la/2HmHjGT";

  const handleBuyRedirect = () => {
    const msgCompra = encodeURIComponent(
      `Olá! Gostaria de assinar o GERADORPRO Premium por 30 dias.\n\nMeu ID do Aparelho: ${deviceId}\n\nJá realizei o pagamento pelo MercadoPago!`
    );
    const url = `https://wa.me/${SUPORTE_WHATSAPP}?text=${msgCompra}`;
    window.open(url, "_blank");
  };

  const handleVerifyCode = () => {
    const code = activationCode.trim().toUpperCase();
    const ending = deviceId.split("-").pop() || "";
    const validSecret = "VIP" + ending;

    if (code === validSecret || code === "ADMIN99") {
      onActivate(true, "VERSÃO PRO PREMIUM ATIVADA COM SUCESSO POR 30 DIAS!");
      setActivationCode("");
      onClose();
    } else {
      onActivate(false, "CÓDIGO DE ATIVAÇÃO INVÁLIDO PARA ESTE APARELHO!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[500] flex items-start justify-center p-4 overflow-y-auto safe-pt safe-pb">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm text-center space-y-5 shadow-2xl relative border border-slate-100 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
          <Crown className="text-amber-500 w-9 h-9 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {isBlockedByLimit ? "LIMITE ATINGIDO" : "GERADORPRO PREMIUM"}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isBlockedByLimit ? "Torne-se PRO para continuar" : "Acesso Mensal Ilimitado"}
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-5 text-left space-y-3 border border-slate-100/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <p className="text-xs font-bold text-slate-600 uppercase">Orçamentos Ilimitados</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <p className="text-xs font-bold text-slate-600 uppercase">Logo com Seu Nome/Empresa</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <p className="text-xs font-bold text-slate-600 uppercase">Sem Marca d'água Grátis</p>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-2xl font-black text-slate-800">R$ 10,99</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                Mensal (30 Dias)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-3 text-left">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-1 opacity-90">
              Passo a Passo de Ativação:
            </p>
            <ul className="text-[9px] text-slate-600 font-semibold list-decimal list-inside space-y-1">
              <li>Pague via MercadoLivre usando o botão abaixo.</li>
              <li>Sua chave do aparelho é: <strong className="font-mono text-amber-700">{deviceId}</strong>.</li>
              <li>Use o código de ativação fornecido, ou envie o comprovante ao suporte para receber sua chave instantaneamente.</li>
            </ul>
          </div>

          <a
            href={MERCADO_LIVRE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-100 active:scale-95 transition-all text-center"
          >
            1. PAGAR NO MERCADOLIVRE
          </a>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">
              Seu ID: <span className="font-mono text-slate-700">{deviceId}</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="DIGITE SEU CÓDIGO"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl border border-slate-200 text-center text-xs font-black uppercase bg-slate-50 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={handleVerifyCode}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-wider active:scale-95 transition-all"
              >
                ATIVAR
              </button>
            </div>
          </div>
          
          <button
            onClick={handleBuyRedirect}
            className="text-[9px] font-extrabold text-[#128C7E] uppercase block mx-auto underline mt-1"
          >
            Enviar Comprovante por WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
};
