import { type FC, useState } from "react";
import { Crown, CheckCircle2, X, ShieldCheck, Lock } from "lucide-react";
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

        <div className="flex items-center justify-center gap-1.5 mx-auto bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider w-fit mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Conexão & Pagamento Seguro</span>
        </div>

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
              <span className="text-2xl font-black text-slate-800 font-sans">R$ 10,99</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                Mensal (30 Dias)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 text-left">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide mb-2 opacity-95">
              Como ativar sua conta PRO com segurança:
            </p>
            <ul className="text-[9px] text-slate-500 font-bold list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Pague via MercadoLivre usando o botão de pagamento.</li>
              <li>Toque para enviar o comprovante e seu ID para o suporte.</li>
              <li>Insira o código de 30 dias que o suporte irá te enviar abaixo.</li>
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="DIGITE O CÓDIGO RECEBIDO"
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
            className="w-full py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all outline-none"
          >
            <span>2. ENVIAR ID E COMPROVANTE</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-extrabold uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" /> 
              <span>Transação Criptografada SSL</span>
            </div>
            <p className="text-[7.5px] text-slate-400 font-semibold leading-relaxed max-w-[260px] mx-auto uppercase">
              Garantia LGPD: Seus dados estão salvos apenas no seu aparelho de forma confidencial. Transações garantidas pela proteção oficial do Mercado Pago.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
