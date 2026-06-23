import { useState, useEffect } from "react";
import {
  Snowflake,
  History,
  Eye,
  Plus,
  Trash2,
  Download,
  Send,
  X,
  PlusCircle,
  HelpCircle,
  Info,
  Crown,
  Share2
} from "lucide-react";
import { Toast } from "./components/Toast";
import { PremiumModal } from "./components/PremiumModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { QuotePDF } from "./components/QuotePDF";
// @ts-ignore
import html2pdf from "html2pdf.js";
import {
  Quote,
  QuoteItem,
  ProfessionalInfo,
  AC_MODELS,
  AC_POWERS,
  QUICK_SERVICES
} from "./types";

export default function App() {
  // --- Device & License Information ---
  const [deviceId, setDeviceId] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumDaysRemaining, setPremiumDaysRemaining] = useState(0);

  // --- Professional Info (Auto-saves on typing) ---
  const [profInfo, setProfInfo] = useState<ProfessionalInfo>(() => {
    return {
      name: localStorage.getItem("bjc_business_name") || "",
      phone: localStorage.getItem("bjc_business_phone") || "",
      cnpj: localStorage.getItem("bjc_business_cnpj") || ""
    };
  });

  // --- Client Details ---
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientPhoneAlt, setClientPhoneAlt] = useState("");
  const [clientDoc, setClientDoc] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // --- Quote Items ---
  const [items, setItems] = useState<QuoteItem[]>([]);

  // --- Historic Quotes ---
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // --- Usage Counter for Free Limit ---
  const [usageCounter, setUsageCounter] = useState(0);

  // --- Layout State Management ---
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isBlockedByLimit, setIsBlockedByLimit] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  // --- Toast Trigger State ---
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false
  });

  // --- Initializing State and checking limits/licenses ---
  useEffect(() => {
    // 1. Uniquely Generate Device ID
    let currentId = localStorage.getItem("bjc_device_id");
    if (!currentId) {
      const platform = (navigator.platform || "WEB").substring(0, 3).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      currentId = `PRO-${platform}-${random}`;
      localStorage.setItem("bjc_device_id", currentId);
    }
    setDeviceId(currentId);

    // 2. Load Usage Counter
    const storedCounter = parseInt(localStorage.getItem("bjc_usage_counter") || "0");
    setUsageCounter(storedCounter);

    // 3. Check Premium Status & Expiration (30 Days check)
    let premiumStatus = localStorage.getItem("bjc_is_premium") === "true";
    const premiumOwner = localStorage.getItem("bjc_premium_owner_id");
    const activationTimeStr = localStorage.getItem("bjc_activation_date");

    if (premiumStatus) {
      // Validate device matching
      if (premiumOwner !== currentId) {
        premiumStatus = false;
        localStorage.removeItem("bjc_is_premium");
        localStorage.removeItem("bjc_premium_owner_id");
        localStorage.removeItem("bjc_activation_date");
      } else if (activationTimeStr) {
        const activationTime = parseInt(activationTimeStr);
        const diffInDays = (Date.now() - activationTime) / (1000 * 60 * 60 * 24);

        if (diffInDays > 30) {
          // 30 days have elapsed: Reset subscription
          premiumStatus = false;
          localStorage.removeItem("bjc_is_premium");
          localStorage.removeItem("bjc_premium_owner_id");
          localStorage.removeItem("bjc_activation_date");
          setToast({
            message: "Sua assinatura mensal de 30 dias expirou. Ative novamente!",
            type: "error",
            visible: true
          });
        } else {
          // Calculate remaining days
          const remaining = Math.max(0, Math.ceil(30 - diffInDays));
          setPremiumDaysRemaining(remaining);
        }
      } else {
        // Fallback setting timestamp
        localStorage.setItem("bjc_activation_date", Date.now().toString());
        setPremiumDaysRemaining(30);
      }
    }
    setIsPremium(premiumStatus);

    // 4. Load Quotes
    try {
      const savedQuotes = JSON.parse(localStorage.getItem("bjc_orcamentos") || "[]");
      setQuotes(savedQuotes);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // --- Syncing Professional Info to Storage ---
  useEffect(() => {
    localStorage.setItem("bjc_business_name", profInfo.name);
    localStorage.setItem("bjc_business_phone", profInfo.phone);
    localStorage.setItem("bjc_business_cnpj", profInfo.cnpj);
  }, [profInfo]);

  // --- Show Toast Helper ---
  const triggerToast = (msg: string, type: "success" | "error" = "error") => {
    setToast({
      message: msg,
      type: type,
      visible: true
    });
  };

  // --- Handling Activation Callback ---
  const handleActivation = (success: boolean, message: string) => {
    if (success) {
      setIsPremium(true);
      localStorage.setItem("bjc_is_premium", "true");
      localStorage.setItem("bjc_premium_owner_id", deviceId);
      localStorage.setItem("bjc_activation_date", Date.now().toString());
      setPremiumDaysRemaining(30);
      triggerToast(message, "success");

      // Notify support of automatic key usage
      const msgSuporte = encodeURIComponent(
        `✅ NOVA ATIVAÇÃO PREMIUM (MENSAL)!\n\n👤 Profissional: ${profInfo.name || "Técnico"}\n📱 WhatsApp: ${profInfo.phone || "Não informado"}\n💻 ID: ${deviceId}\n\nStatus: ATIVO por 30 Dias.`
      );
      setTimeout(() => {
        window.open(`https://wa.me/5563992092699?text=${msgSuporte}`, "_blank");
      }, 1500);
    } else {
      triggerToast(message, "error");
    }
  };

  // --- Add empty service row ---
  const handleAddNewItem = () => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substring(2, 9),
      desc: "",
      model: "Split Hi-Wall",
      power: "9.000 MBTU",
      price: 0
    };
    setItems([...items, newItem]);
  };

  // --- Add fast chip pre-filled service ---
  const handleAddQuickService = (serviceName: string, defaultPrice: number) => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substring(2, 9),
      desc: serviceName,
      model: "Split Hi-Wall",
      power: "12.000 MBTU",
      price: defaultPrice
    };
    setItems([...items, newItem]);
    triggerToast(`Adicionou item: ${serviceName.substring(0, 15)}...`, "success");
  };

  // --- Handle row removal ---
  const handleRemoveRow = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // --- Handle row change ---
  const handleItemFieldChange = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          return { ...it, [field]: value };
        }
        return it;
      })
    );
  };

  // --- Calculate Totals ---
  const calculateTotal = (): number => {
    return items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  };

  const getFormattedTotal = (): string => {
    return calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  // --- Preview PDF ---
  const handleOpenPreview = () => {
    // 1. Validate Form Rules
    if (!clientName.trim()) {
      triggerToast("O nome do cliente é obrigatório para o orçamento.", "error");
      return;
    }
    if (items.length === 0) {
      triggerToast("Adicione pelo menos um item/serviço no orçamento.", "error");
      return;
    }

    // 2. Validate Free Usage Limit (Block after 1 if not Premium)
    if (!isPremium && usageCounter >= 1) {
      setIsBlockedByLimit(true);
      setIsPremiumModalOpen(true);
      return;
    }

    setIsPreviewOpen(true);
  };

  // --- Finalize Process (Save and optionally redirect to WhatsApp) ---
  const handleFinalizeAndSave = async (sendToWhatsapp: boolean) => {
    setIsPreviewOpen(false);

    const formattedTotal = getFormattedTotal();
    const currentDateStr = new Date().toLocaleString("pt-BR", { dateStyle: "short" });

    // Generate accurate PDF File via custom html2pdf lib
    const element = document.getElementById("pdf-template-ref");
    if (element) {
      try {
        const opt = {
          margin: 0,
          filename: `ORC_${clientName.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
          image: { type: "jpeg", quality: 1.0 },
          html2canvas: { scale: 3, useCORS: true, letterRendering: true, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        // Trigger download directly inside browser using HTML2PDF object
        const html2pdfLib = html2pdf || (window as any).html2pdf;
        if (html2pdfLib) {
          await html2pdfLib().set(opt).from(element).save();
        } else {
          triggerToast("Não foi possível carregar o exportador de PDF. Tente novamente.", "error");
          return;
        }
      } catch (e) {
        console.error("PDF generation failed:", e);
      }
    }

    // Prepare new Quote payload
    const newQuote: Quote = {
      id: Date.now(),
      cliente: clientName,
      telefone: clientPhone,
      contatoAlt: clientPhoneAlt,
      clientDoc: clientDoc,
      clientAddress: clientAddress,
      data: currentDateStr,
      items: [...items],
      total: formattedTotal
    };

    // Append to locally saved list
    const updatedHistory = [newQuote, ...quotes];
    setQuotes(updatedHistory);
    localStorage.setItem("bjc_orcamentos", JSON.stringify(updatedHistory));

    // Increase globally tracked uses counter
    const nextCounter = usageCounter + 1;
    setUsageCounter(nextCounter);
    localStorage.setItem("bjc_usage_counter", nextCounter.toString());

    triggerToast("Orçamento gerado e salvo com sucesso!", "success");

    // Optional WhatsApp share link launch
    if (sendToWhatsapp) {
      const cleanedPhone = clientPhone.replace(/\D/g, "");
      if (cleanedPhone.length >= 8) {
        const welcomeMsg = encodeURIComponent(
          `Olá ${clientName}, segue em anexo o arquivo oficial de orçamento para climatização:\n\n*VALOR TOTAL:* R$ ${formattedTotal}\n\nProfissional: ${profInfo.name || "Técnico"}`
        );
        window.location.href = `whatsapp://send?phone=55${cleanedPhone}&text=${welcomeMsg}`;
      } else {
        triggerToast("WhatsApp do cliente está inválido ou incompleto.", "error");
      }
    }

    // Reset client inputs and reset items
    setClientName("");
    setClientPhone("");
    setClientPhoneAlt("");
    setClientDoc("");
    setClientAddress("");
    setItems([]);
  };

  // --- Deletion Dialog helper ---
  const handleTriggerDelete = (id: number) => {
    setDeleteCandidateId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidateId !== null) {
      const restQuotes = quotes.filter((q) => q.id !== deleteCandidateId);
      setQuotes(restQuotes);
      localStorage.setItem("bjc_orcamentos", JSON.stringify(restQuotes));
      triggerToast("Orçamento excluído do histórico com sucesso.", "success");
    }
    setIsDeleteConfirmOpen(false);
    setDeleteCandidateId(null);
  };

  // --- Load and populate an old Quote to active workspace ---
  const handleSelectQuoteAsWorkspace = (quote: Quote) => {
    setClientName(quote.cliente);
    setClientPhone(quote.telefone);
    setClientPhoneAlt(quote.contatoAlt || "");
    setClientDoc(quote.clientDoc || "");
    setClientAddress(quote.clientAddress || "");
    setItems(quote.items);
    setIsHistoryOpen(false);
    triggerToast("Orçamento carregado na tela de edição!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 relative">
      
      {/* Container principal sem bordas de telefone, adaptado para todo o site */}
      <div className="w-full flex-grow flex flex-col relative">

        {/* FIXED CABEÇALHO (Sticky no topo, largo e profissional) */}
        <div className="sticky top-0 z-50 flex flex-col bg-white border-b border-slate-100 shadow-xs">
          {/* HEADER NAVIGATION */}
          <nav className="px-4 py-3.5 safe-pt">
            <div className="max-w-md md:max-w-4xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2.5 font-sans">
                <div className="w-9 h-9 hero-gradient rounded-xl flex items-center justify-center shadow-md">
                  <Snowflake className="text-white w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block leading-none mb-1">
                    GERADORPRO
                  </span>
                  {isPremium ? (
                    <span className="inline-flex items-center gap-1 text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs">
                      PRO • FALTAM {premiumDaysRemaining} DIAS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] bg-slate-400 text-white px-2 py-0.5 rounded-full font-black uppercase">
                      FREE ({1 - Math.min(1, usageCounter)} grátis rest.)
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 border border-slate-100 hover:border-sky-100 hover:bg-sky-50/50 rounded-2xl text-slate-500 hover:text-sky-600 transition-all flex items-center gap-1.5 active:scale-90 font-sans"
              >
                <span className="text-[10px] font-bold uppercase block tracking-wider text-slate-500">
                  Histórico
                </span>
                <History className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>

        {/* Conteúdo do aplicativo com rolagem nativa e fluida no corpo do site */}
        <div className="flex-grow flex flex-col bg-slate-50 relative pb-16 md:pb-6">

          {/* BOTÃO FLUTUANTE PREMIUM */}
          {!isPremium && (
            <button
              id="floatingPremiumBtn"
              onClick={() => {
                setIsBlockedByLimit(false);
                setIsPremiumModalOpen(true);
              }}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[45] bg-gradient-to-br from-amber-500 to-yellow-500 text-white px-5 py-3 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.4)] flex items-center gap-2 font-extrabold text-[11px] uppercase tracking-wider border-2 border-white/30 transition-all hover:scale-105 active:scale-95 btn-floating-premium outline-none cursor-pointer"
            >
              <Crown className="w-4 h-4 text-white" />
              <span>Seja Premium</span>
            </button>
          )}

      {/* TOP HERO COVER */}
      <div className="hero-gradient w-full pt-8 pb-20 px-6 text-white text-center relative overflow-hidden">
        <div className="max-w-md md:max-w-4xl mx-auto relative z-10 space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-none uppercase">
            GERADOR DE <span className="text-sky-200">ORÇAMENTO</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">
            Sistemas de ar-condicionado e Climatização
          </p>
        </div>
        {/* Subtle decorative mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)] opacity-70 pointer-events-none" />
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-md md:max-w-4xl mx-auto w-full px-4 -mt-12 relative z-20 flex-grow">
        <div className="glass-form rounded-[2.5rem] p-6 shadow-xl border border-white">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            {/* 1. SEÇÃO DE INFORMACÕES DO TÉCNICO / EMPRESA */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                  Dados do Profissional
                </h3>
                <span className="text-[8px] font-extrabold text-slate-300 uppercase">
                  Salva Automático
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Seu Nome ou Nome da Empresa"
                  value={profInfo.name}
                  onChange={(e) => setProfInfo({ ...profInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-center placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Seu WhatsApp"
                    value={profInfo.phone}
                    onChange={(e) => setProfInfo({ ...profInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-[11px] font-bold text-center placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Seu CPF ou CNPJ"
                    value={profInfo.cnpj}
                    onChange={(e) => setProfInfo({ ...profInfo, cnpj: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-[11px] font-bold text-center placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* 2. SEÇÃO DE INFORMAÇÕES DO CLIENTE */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Dados do Cliente
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Nome Completo / Razão Social"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-center placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-all duration-200 shadow-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp do Cliente"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-all duration-200 shadow-xs"
                  />
                  <input
                    type="text"
                    placeholder="CPF / CNPJ do Cliente"
                    value={clientDoc}
                    onChange={(e) => setClientDoc(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-all duration-200 shadow-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Contato Alt. (Opcional)"
                    value={clientPhoneAlt}
                    onChange={(e) => setClientPhoneAlt(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-all duration-200 opacity-85 shadow-xs"
                  />
                  <input
                    type="text"
                    placeholder="Local / Cidade / UF"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-all duration-200 opacity-85 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. SEÇÃO SELETOR DE TEMAS RÁPIDOS */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Serviços Rápidos
                </h3>
                <button
                  type="button"
                  onClick={handleAddNewItem}
                  className="text-sky-600 hover:text-sky-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 outline-none transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Novo Item
                </button>
              </div>

              {/* Quick selectors chips */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pb-1 pr-1">
                {QUICK_SERVICES.map((qs, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAddQuickService(qs.name, qs.price)}
                    className="bg-sky-50 hover:bg-sky-100 border border-sky-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-sky-800 shadow-2xs active:scale-95 transition-all text-center"
                  >
                    {qs.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Added Services row list */}
              <div className="space-y-3 pt-2">
                {items.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wide border border-dashed border-slate-200">
                    Toque em um serviço rápido ou insira novos itens para orçar
                  </div>
                ) : (
                  items.map((row) => (
                    <div
                      key={row.id}
                      className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-sky-100 p-4 rounded-[1.8rem] flex flex-col gap-3.5 shadow-sm transition-all relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 text-slate-300 hover:text-red-500 rounded-lg active:scale-90 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-6 space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-0.5">
                          Descrição do serviço ou material:
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Instalação, Higienização Completa"
                          value={row.desc}
                          onChange={(e) => handleItemFieldChange(row.id, "desc", e.target.value)}
                          className="w-full text-xs font-black text-sky-800 bg-transparent outline-none focus:border-b focus:border-sky-300 pb-0.5 placeholder-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                            Modelo:
                          </label>
                          <select
                            value={row.model}
                            onChange={(e) =>
                              handleItemFieldChange(row.id, "model", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 font-bold py-2 rounded-xl text-[10px] px-2 focus:outline-none focus:border-sky-200"
                          >
                            {AC_MODELS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                            Capacidade:
                          </label>
                          <select
                            value={row.power}
                            onChange={(e) =>
                              handleItemFieldChange(row.id, "power", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 font-bold py-2 rounded-xl text-[10px] px-2 focus:outline-none focus:border-sky-200"
                          >
                            {AC_POWERS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                          Valor Cobrado:
                        </label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={row.price || ""}
                            onChange={(e) =>
                              handleItemFieldChange(
                                row.id,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full bg-transparent text-xs font-black text-right focus:outline-none text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TOTAL WRAPPER CARDS */}
            <div className="bg-slate-950 rounded-[2.2rem] p-5 text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-sky-400">
                    Soma Estimulada:
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">
                    {items.length} itens inclusos
                  </p>
                </div>
                <div className="text-2xl font-black tracking-tight flex items-baseline gap-1">
                  <span className="text-sky-400 text-xs">R$</span>
                  <span className="font-mono text-3xl font-extrabold text-white">
                    {getFormattedTotal()}
                  </span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <Snowflake className="w-24 h-24" />
              </div>
            </div>

            {/* PREVIEW SUBMIT BUTTON */}
            <button
              type="button"
              onClick={handleOpenPreview}
              className="w-full py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-500 hover:text-sky-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4" /> PRÉ-VISUALIZAR DOCUMENTO
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="max-w-md md:max-w-4xl mx-auto w-full py-10 text-center space-y-4 safe-pb px-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Todos os direitos reservados • GERADORPRO
          </p>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            DEV • B.J.C
          </p>
        </div>
        <a
          href="https://wa.me/5563992092699?text=Ol%C3%A1!%20Sou%20um%20t%C3%A9cnico%20profissional%20e%20usu%C3%A1rio%20do%20GERADORPRO.%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20e%20fortalecer%20nossa%20parceria!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/15 text-[#128C7E] px-6 py-2.5 rounded-full transition-all border border-green-500/10 active:scale-95"
        >
          <span className="w-2 h-2 bg-[#25D366] rounded-full animate-ping" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#128C7E]">
            Suporte Técnico Desenvolvedor
          </span>
        </a>
      </footer>

        </div> {/* Real App scroll container inside mock device */}
      </div> {/* Virtual Device Frame Wrapper */}

      {/* --- HIDDEN PDF WRAPPER ENGINE FOR EXPORT (REMAINED IN ACCURATE DIMENSIONS) --- */}
      <div className="absolute left-[-9999px] top-[-9999px] overflow-hidden">
        <QuotePDF
          businessName={profInfo.name}
          businessCnpj={profInfo.cnpj}
          clientName={clientName}
          clientPhone={clientPhone}
          clientPhoneAlt={clientPhoneAlt}
          clientDoc={clientDoc}
          clientAddress={clientAddress}
          items={items}
          total={getFormattedTotal()}
          isPremium={isPremium}
        />
      </div>

      {/* --- PREVIEW AND DOWNLOAD ACTION DIALOG --- */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[450] flex items-start justify-center p-4 overflow-y-auto safe-pt safe-pb">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto">
            
            {/* Nav top preview */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Prévia Documentada Oficial
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors active:scale-90"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Notification reminder */}
            <div className="bg-sky-50 px-6 py-3 border-b border-sky-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-[9px] font-bold text-sky-800 leading-tight uppercase">
                Verifique os dados de segurança antes de baixar. Toque em SALVAR para consolidar o relatório no seu histórico.
              </p>
            </div>

            {/* Document Sandbox Showcase (Simulating actual print view scrollably) */}
            <div className="flex-grow overflow-y-auto bg-slate-400/90 p-4 scrollbar-thin">
              <div className="bg-white w-[210mm] border shadow-2xl p-[15mm] mx-auto origin-top scale-[0.45] origin-top-left md:scale-[0.6] min-h-[297mm]">
                <QuotePDF
                  businessName={profInfo.name}
                  businessCnpj={profInfo.cnpj}
                  clientName={clientName}
                  clientPhone={clientPhone}
                  clientPhoneAlt={clientPhoneAlt}
                  clientDoc={clientDoc}
                  clientAddress={clientAddress}
                  items={items}
                  total={getFormattedTotal()}
                  isPremium={isPremium}
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className="p-5 bg-white border-t space-y-3.5 safe-pb">
              <button
                onClick={() => handleFinalizeAndSave(false)}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <Download className="w-4 h-4" /> 1. SALVAR NO CELULAR (.PDF)
              </button>
              <button
                onClick={() => handleFinalizeAndSave(true)}
                className="w-full py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-all outline-none shadow-lg shadow-green-100 cursor-pointer animate-pulse"
              >
                <Send className="w-4 h-4" /> 2. SALVAR & ENVIAR WHATSAPP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION FOR DELETION POPUP --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[550] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-7 w-full max-w-xs text-center space-y-6 shadow-2xl border border-slate-100 my-auto">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="text-rose-500 w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Limpar Registro?
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">
                Esta ação é definitiva. Deseja realmente excluir este orçamento salvo?
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-all outline-none cursor-pointer"
              >
                Sim, Excluir Agora
              </button>
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteCandidateId(null);
                }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all outline-none cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DRAWERS & SIDE PANEL ASYNC --- */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        quotes={quotes}
        onDeleteQuote={handleTriggerDelete}
        onSelectQuote={handleSelectQuoteAsWorkspace}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        deviceId={deviceId}
        isBlockedByLimit={isBlockedByLimit}
        onActivate={handleActivation}
      />

      {/* --- SYSTEM TOAST FEEDBACK --- */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
