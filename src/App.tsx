import React, { useState, useEffect } from "react";
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
  Share2,
  Zap,
  Droplet,
  Sprout,
  Paintbrush,
  Hammer,
  Sparkles,
  Waves,
  Sun,
  Shield,
  Car,
  Laptop,
  Wrench,
  Maximize,
  Bug,
  Truck,
  Calendar,
  Search,
  ArrowLeft,
  Star,
  TrendingUp,
  FileText,
  Filter,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  Moon,
  SunDim,
  DollarSign,
  Briefcase,
  Copy,
  FolderOpen,
  Save,
  LayoutGrid,
  Layers
} from "lucide-react";
import { Toast } from "./components/Toast";
import { PremiumModal } from "./components/PremiumModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { QuotePDF } from "./components/QuotePDF";
import { CATEGORIES, Category } from "./data/categories";
import { Quote, QuoteItem, ProfessionalInfo } from "./types";
// @ts-ignore
import html2pdf from "html2pdf.js";

// Helper component to render standard category icons
const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Snowflake": return <Snowflake className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Droplet": return <Droplet className={className} />;
    case "Sprout": return <Sprout className={className} />;
    case "Paintbrush": return <Paintbrush className={className} />;
    case "Hammer": return <Hammer className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Waves": return <Waves className={className} />;
    case "Sun": return <Sun className={className} />;
    case "Shield": return <Shield className={className} />;
    case "Car": return <Car className={className} />;
    case "Laptop": return <Laptop className={className} />;
    case "Wrench": return <Wrench className={className} />;
    case "Maximize": return <Maximize className={className} />;
    case "Bug": return <Bug className={className} />;
    case "Truck": return <Truck className={className} />;
    case "Calendar": return <Calendar className={className} />;
    default: return <Briefcase className={className} />;
  }
};

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

  // --- Warranty Configuration ---
  const [warranty, setWarranty] = useState(() => {
    return localStorage.getItem("bjc_default_warranty") || "90 dias";
  });

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

  // --- Multi-Service State ---
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("bjc_favorites");
    return saved ? JSON.parse(saved) : ["climatizacao", "eletrica"];
  });
  const [recentCategories, setRecentCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("bjc_recents");
    return saved ? JSON.parse(saved) : ["climatizacao"];
  });
  const theme = "dark";

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

  // --- Syncing Warranty to Storage ---
  useEffect(() => {
    localStorage.setItem("bjc_default_warranty", warranty);
  }, [warranty]);

  // --- Show Toast Helper ---
  const triggerToast = (msg: string, type: "success" | "error" = "error") => {
    setToast({
      message: msg,
      type: type,
      visible: true
    });
  };

  // --- Toggle Favorites ---
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("bjc_favorites", JSON.stringify(updated));
    triggerToast(favorites.includes(id) ? "Removido dos favoritos" : "Adicionado aos favoritos", "success");
  };

  // --- Handle Category Entry ---
  const handleEnterCategory = (cat: Category) => {
    // Premium restrictions check for multiple categories
    if (!isPremium && usageCounter >= 1) {
      setIsBlockedByLimit(true);
      setIsPremiumModalOpen(true);
      return;
    }

    setActiveCategory(cat);

    // Update Recents
    const updatedRecents = [cat.id, ...recentCategories.filter((id) => id !== cat.id)].slice(0, 4);
    setRecentCategories(updatedRecents);
    localStorage.setItem("bjc_recents", JSON.stringify(updatedRecents));
  };

  // --- Load and Save Draft per Category ---
  useEffect(() => {
    if (activeCategory) {
      const draftStr = localStorage.getItem(`bjc_draft_${activeCategory.id}`);
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          setClientName(draft.clientName || "");
          setClientPhone(draft.clientPhone || "");
          setClientPhoneAlt(draft.clientPhoneAlt || "");
          setClientDoc(draft.clientDoc || "");
          setClientAddress(draft.clientAddress || "");
          setItems(draft.items || []);
          if (draft.warranty) {
            setWarranty(draft.warranty);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Clear workspace
        setClientName("");
        setClientPhone("");
        setClientPhoneAlt("");
        setClientDoc("");
        setClientAddress("");
        setItems([]);
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory) {
      const draft = { clientName, clientPhone, clientPhoneAlt, clientDoc, clientAddress, items, warranty };
      localStorage.setItem(`bjc_draft_${activeCategory.id}`, JSON.stringify(draft));
    }
  }, [clientName, clientPhone, clientPhoneAlt, clientDoc, clientAddress, items, warranty, activeCategory]);

  // --- Status Change directly from HistoryDrawer ---
  const handleStatusChange = (id: number, status: "aprovado" | "pendente" | "cancelado") => {
    const updated = quotes.map((q) => {
      if (q.id === id) {
        return { ...q, status };
      }
      return q;
    });
    setQuotes(updated);
    localStorage.setItem("bjc_orcamentos", JSON.stringify(updated));
    triggerToast(`Status do orçamento atualizado para ${status}!`, "success");
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
    if (!activeCategory) return;
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substring(2, 9),
      desc: "",
      model: activeCategory.models[0] || "Padrão",
      power: activeCategory.powers[0] || "Sob Medida",
      price: 0
    };
    setItems([...items, newItem]);
  };

  // --- Add fast chip pre-filled service ---
  const handleAddQuickService = (serviceName: string, defaultPrice: number) => {
    if (!activeCategory) return;
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substring(2, 9),
      desc: serviceName,
      model: activeCategory.models[0] || "Padrão",
      power: activeCategory.powers[0] || "Unidade",
      price: defaultPrice
    };
    setItems([...items, newItem]);
    triggerToast(`Item adicionado: ${serviceName.substring(0, 15)}...`, "success");
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

  // --- Parsing values for charts helper ---
  const parseQuoteTotal = (totalStr: string): number => {
    const cleaned = totalStr.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  // --- Metrics Aggregator ---
  const totalOrcamentos = quotes.length;
  const quotesApproved = quotes.filter((q) => q.status === "aprovado" || !q.status);
  const quotesPending = quotes.filter((q) => q.status === "pendente");
  const quotesCancelled = quotes.filter((q) => q.status === "cancelado");

  const valorFaturado = quotesApproved.reduce((acc, q) => acc + parseQuoteTotal(q.total), 0);
  const valorPrevisto = quotesPending.reduce((acc, q) => acc + parseQuoteTotal(q.total), 0);
  const ticketMedio = totalOrcamentos > 0 
    ? quotes.reduce((acc, q) => acc + parseQuoteTotal(q.total), 0) / totalOrcamentos 
    : 0;

  // Most used category
  const categoryCounts: { [key: string]: number } = {};
  quotes.forEach((q) => {
    const catId = q.category || "climatizacao";
    categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
  });
  let mostUsedCatId = "climatizacao";
  let maxCatCount = 0;
  Object.keys(categoryCounts).forEach((key) => {
    if (categoryCounts[key] > maxCatCount) {
      maxCatCount = categoryCounts[key];
      mostUsedCatId = key;
    }
  });
  const mostUsedCatTitle = CATEGORIES.find((c) => c.id === mostUsedCatId)?.title || "Climatização";

  // Most sold service
  const serviceCounts: { [key: string]: number } = {};
  quotes.forEach((q) => {
    q.items.forEach((it) => {
      const desc = it.desc?.trim();
      if (desc) {
        serviceCounts[desc] = (serviceCounts[desc] || 0) + 1;
      }
    });
  });
  let mostSoldService = "Nenhum cadastrado";
  let maxServiceCount = 0;
  Object.keys(serviceCounts).forEach((key) => {
    if (serviceCounts[key] > maxServiceCount) {
      maxServiceCount = serviceCounts[key];
      mostSoldService = key;
    }
  });

  // Recurring clients
  const clientCounts: { [key: string]: number } = {};
  quotes.forEach((q) => {
    const name = q.cliente?.trim().toUpperCase();
    if (name) {
      clientCounts[name] = (clientCounts[name] || 0) + 1;
    }
  });
  const recurringClientsCount = Object.values(clientCounts).filter((cnt) => cnt >= 2).length;

  // --- Preview PDF ---
  const handleOpenPreview = () => {
    if (!clientName.trim()) {
      triggerToast("O nome do cliente é obrigatório para o orçamento.", "error");
      return;
    }
    if (items.length === 0) {
      triggerToast("Adicione pelo menos um item/serviço no orçamento.", "error");
      return;
    }

    // Validate Free Usage Limit (Block after 1 if not Premium)
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
      total: formattedTotal,
      category: activeCategory?.id || "climatizacao",
      status: "aprovado",
      warranty: warranty
    };

    // Append to locally saved list
    const updatedHistory = [newQuote, ...quotes];
    setQuotes(updatedHistory);
    localStorage.setItem("bjc_orcamentos", JSON.stringify(updatedHistory));

    // Increase globally tracked uses counter
    const nextCounter = usageCounter + 1;
    setUsageCounter(nextCounter);
    localStorage.setItem("bjc_usage_counter", nextCounter.toString());

    // Clear Draft
    if (activeCategory) {
      localStorage.removeItem(`bjc_draft_${activeCategory.id}`);
    }

    triggerToast("Orçamento gerado e salvo com sucesso!", "success");

    // Optional WhatsApp share link launch
    if (sendToWhatsapp) {
      const cleanedPhone = clientPhone.replace(/\D/g, "");
      if (cleanedPhone.length >= 8) {
        const welcomeMsg = encodeURIComponent(
          `Olá ${clientName}, segue em anexo o arquivo oficial de orçamento para ${activeCategory?.title || "Climatização"}:\n\n*VALOR TOTAL:* R$ ${formattedTotal}\n\nProfissional: ${profInfo.name || "Técnico"}`
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
    if (quote.warranty) {
      setWarranty(quote.warranty);
    }
    
    // Find matching category to switch views
    const matched = CATEGORIES.find((c) => c.id === quote.category) || CATEGORIES[0];
    setActiveCategory(matched);
    
    setIsHistoryOpen(false);
    triggerToast(`Orçamento de ${matched.title} carregado na tela de edição!`, "success");
  };

  // --- Intelligent Search Algorithm ---
  const filteredCategories = CATEGORIES.filter((cat) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Match category details
    const matchTitle = cat.title.toLowerCase().includes(query);
    const matchSubtitle = cat.subtitle.toLowerCase().includes(query);
    
    // Match quick services
    const matchServices = cat.quickServices.some(
      (qs) => qs.name.toLowerCase().includes(query) || qs.label.toLowerCase().includes(query)
    );
    
    // Match custom models
    const matchModels = cat.models.some((m) => m.toLowerCase().includes(query));

    return matchTitle || matchSubtitle || matchServices || matchModels;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased relative transition-all duration-300 ${
      theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Container principal */}
      <div className="w-full flex-grow flex flex-col relative">

        {/* FIXED CABEÇALHO */}
        <div className={`sticky top-0 z-50 flex flex-col border-b transition-all duration-300 ${
          theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-100 shadow-xs"
        }`}>
          {/* HEADER NAVIGATION */}
          <nav className="px-4 py-3.5 safe-pt">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2.5 font-sans">
                <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer" onClick={() => setActiveCategory(null)}>
                  <LayoutGrid className="text-white w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block leading-none mb-1">
                    GERADORPRO MULTISSERVIÇOS
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
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className={`p-2 border rounded-xl transition-all flex items-center gap-1.5 active:scale-90 font-sans ${
                    theme === "dark"
                      ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300"
                      : "border-slate-200 hover:border-sky-100 hover:bg-sky-50/50 text-slate-500 hover:text-sky-600"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block tracking-wider hidden sm:block">
                    Histórico
                  </span>
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Content Section */}
        <div className="flex-grow flex flex-col relative pb-16">

          {/* BOTÃO FLUTUANTE PREMIUM */}
          {!isPremium && (
            <button
              id="floatingPremiumBtn"
              onClick={() => {
                setIsBlockedByLimit(false);
                setIsPremiumModalOpen(true);
              }}
              className="fixed bottom-6 right-6 z-[45] bg-gradient-to-br from-amber-500 to-yellow-500 text-white px-5 py-3 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.4)] flex items-center gap-2 font-extrabold text-[11px] uppercase tracking-wider border-2 border-white/30 transition-all hover:scale-105 active:scale-95 btn-floating-premium outline-none cursor-pointer"
            >
              <Crown className="w-4 h-4 text-white" />
              <span>Seja Premium</span>
            </button>
          )}

          {/* VIEW 1: HUB PRINCIPAL (Default) */}
          {!activeCategory ? (
            <div className="space-y-6">
              
              {/* HUB TOP BANNER */}
              <div className="relative pt-12 pb-14 px-6 text-white text-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-950">
                <div className="max-w-4xl mx-auto relative z-10 space-y-4">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
                    PLATA-FORMA <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">MULTISSERVIÇOS</span>
                  </h1>
                  <p className="max-w-xl mx-auto text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-300 leading-relaxed">
                    Selecione seu segmento profissional ou pesquise o serviço para gerar orçamentos instantâneos de alto padrão.
                  </p>

                  {/* INTELLIGENT SEARCH BAR */}
                  <div className="max-w-lg mx-auto pt-4 relative">
                    <div className="relative flex items-center">
                      <Search className="w-5 h-5 text-slate-400 absolute left-4.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Pesquise por: Pintura, Vazamento, Ar, Caixa d'água, Fiação..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-sm font-bold text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-xl transition-all"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Visual decorative grids */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_85%)] pointer-events-none" />
              </div>

              {/* SECTION: FAVORITES */}
              {favorites.length > 0 && searchQuery === "" && (
                <div className="max-w-4xl mx-auto w-full px-4 space-y-3">
                  <div className="flex items-center gap-1.5 px-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Segmentos Favoritos
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {CATEGORIES.filter((cat) => favorites.includes(cat.id)).map((cat) => {
                      const count = quotes.filter((q) => q.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleEnterCategory(cat)}
                          className={`p-4 rounded-3xl border cursor-pointer transition-all hover:shadow-lg active:scale-95 flex flex-col items-start gap-3 relative group overflow-hidden ${
                            theme === "dark" 
                              ? "bg-slate-900/40 border-slate-800 hover:border-slate-700" 
                              : "bg-white border-slate-100 hover:border-sky-100"
                          }`}
                        >
                          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent name={cat.iconName} className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-black text-[13px] uppercase tracking-tight">{cat.title}</h4>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                              {count} {count === 1 ? "orçamento" : "orçamentos"}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleToggleFavorite(cat.id, e)}
                            className="absolute top-3 right-3 text-amber-500 hover:text-amber-600 transition-colors"
                          >
                            <Star className="w-4 h-4 fill-amber-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: ALL PROFESSIONAL SEGMENTS */}
              <div className="max-w-4xl mx-auto w-full px-4 space-y-3 pt-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {searchQuery ? `Resultados da Pesquisa (${filteredCategories.length})` : "Todos os Segmentos Profissionais"}
                  </h3>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sky-600 hover:text-sky-700 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Limpar Filtro
                    </button>
                  )}
                </div>

                {filteredCategories.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <h4 className="font-black uppercase tracking-tight text-slate-700 dark:text-slate-300">Nenhum serviço profissional encontrado</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto uppercase font-bold tracking-wider leading-relaxed">
                      Não encontramos nenhuma profissão ou serviço com o termo "{searchQuery}". Tente usar palavras-chave como "Pintura", "Vazamento", "Elétrica" ou "Limpeza".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-12">
                    {filteredCategories.map((cat) => {
                      const count = quotes.filter((q) => q.category === cat.id).length;
                      const isFav = favorites.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleEnterCategory(cat)}
                          className={`p-5 rounded-[2rem] border cursor-pointer transition-all hover:shadow-xl active:scale-[0.98] flex items-center gap-4 relative group overflow-hidden ${
                            theme === "dark"
                              ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                              : "bg-white border-slate-100 hover:border-indigo-100"
                          }`}
                        >
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300`}>
                            <IconComponent name={cat.iconName} className="w-5 h-5" />
                          </div>
                          <div className="flex-grow pr-6">
                            <h4 className="font-black text-[14px] uppercase tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
                              {cat.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5 truncate max-w-[180px]">
                              {cat.subtitle}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                              {count} orc.
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleToggleFavorite(cat.id, e)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-amber-500 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            
            // VIEW 2: WORKSPACE GENERATOR DEDICADO
            <div className="space-y-6">
              
              {/* BACK BAR NAVIGATION */}
              <div className="max-w-4xl mx-auto w-full px-4 pt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                    theme === "dark"
                      ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                      : "border-slate-200 hover:bg-slate-100 text-slate-500"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar ao Hub
                </button>

                <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>Módulo Ativo:</span>
                  <span className="text-sky-500 dark:text-sky-400">{activeCategory.title}</span>
                </div>
              </div>

              {/* DYNAMIC TOP HERO COVER */}
              <div className={`w-full pt-8 pb-20 px-6 text-white text-center relative overflow-hidden bg-gradient-to-br ${activeCategory.gradient}`}>
                <div className="max-w-4xl mx-auto relative z-10 space-y-1">
                  <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-2">
                    <IconComponent name={activeCategory.iconName} className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase">
                    GERADOR DE ORÇAMENTOS
                  </h1>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-90">
                    {activeCategory.subtitle}
                  </p>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_80%)] opacity-70 pointer-events-none" />
              </div>

              {/* MAIN GENERATOR FORM WORKSPACE */}
              <main className="max-w-4xl mx-auto w-full px-4 -mt-12 relative z-20 flex-grow">
                <div className={`rounded-[2.5rem] p-6 shadow-xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-slate-900 border-slate-800/80" : "bg-white border-slate-200/80"
                }`}>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    
                    {/* COLUMNS GRID FOR METADATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* 1. SEÇÃO DE INFORMAÇÕES DO TÉCNICO / EMPRESA */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <h3 className="text-[10px] font-black text-sky-500 dark:text-sky-400 uppercase tracking-widest">
                            Dados do Profissional
                          </h3>
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase">
                            Salva Automático
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Seu Nome ou Nome da Empresa"
                            value={profInfo.name}
                            onChange={(e) => setProfInfo({ ...profInfo, name: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-2xl text-xs font-bold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                              theme === "dark"
                                ? "bg-slate-800/50 border-slate-700 text-white focus:border-sky-500"
                                : "bg-slate-50/80 border-slate-200 text-slate-800 focus:border-sky-400 focus:bg-white"
                            }`}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="tel"
                              placeholder="Seu WhatsApp"
                              value={profInfo.phone}
                              onChange={(e) => setProfInfo({ ...profInfo, phone: e.target.value })}
                              className={`w-full px-4 py-3 border rounded-2xl text-[11px] font-bold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                                theme === "dark"
                                  ? "bg-slate-800/50 border-slate-700 text-white focus:border-sky-500"
                                  : "bg-slate-50/80 border-slate-200 text-slate-800 focus:border-sky-400 focus:bg-white"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Seu CPF ou CNPJ"
                              value={profInfo.cnpj}
                              onChange={(e) => setProfInfo({ ...profInfo, cnpj: e.target.value })}
                              className={`w-full px-4 py-3 border rounded-2xl text-[11px] font-bold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                                theme === "dark"
                                  ? "bg-slate-800/50 border-slate-700 text-white focus:border-sky-500"
                                  : "bg-slate-50/80 border-slate-200 text-slate-800 focus:border-sky-400 focus:bg-white"
                              }`}
                            />
                          </div>
                          <div className="mt-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 pl-1">
                              Garantia do Serviço:
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: 90 dias"
                              value={warranty}
                              onChange={(e) => setWarranty(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-2xl text-[11px] font-bold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                                theme === "dark"
                                  ? "bg-slate-800/50 border-slate-700 text-white focus:border-sky-500"
                                  : "bg-slate-50/80 border-slate-200 text-slate-800 focus:border-sky-400 focus:bg-white"
                              }`}
                            />
                            <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                              {["Sem garantia", "30 dias", "90 dias", "180 dias", "1 ano"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setWarranty(opt)}
                                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                                    warranty === opt
                                      ? "bg-sky-500 text-white"
                                      : theme === "dark"
                                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. SEÇÃO DE INFORMAÇÕES DO CLIENTE */}
                      <div className="space-y-3">
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
                            className={`w-full px-4 py-3 border rounded-2xl text-sm font-semibold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-xs ${
                              theme === "dark"
                                ? "bg-slate-800/80 border-slate-700 text-white focus:border-sky-500"
                                : "bg-white border-slate-200 text-slate-800 focus:border-sky-400"
                            }`}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="tel"
                              required
                              placeholder="WhatsApp do Cliente"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-xs ${
                                theme === "dark"
                                  ? "bg-slate-800/80 border-slate-700 text-white focus:border-sky-500"
                                  : "bg-white border-slate-200 text-slate-800 focus:border-sky-400"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="CPF / CNPJ do Cliente"
                              value={clientDoc}
                              onChange={(e) => setClientDoc(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-xs ${
                                theme === "dark"
                                  ? "bg-slate-800/80 border-slate-700 text-white focus:border-sky-500"
                                  : "bg-white border-slate-200 text-slate-800 focus:border-sky-400"
                              }`}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Contato Alt. (Opcional)"
                              value={clientPhoneAlt}
                              onChange={(e) => setClientPhoneAlt(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-xs ${
                                theme === "dark"
                                  ? "bg-slate-800/80 border-slate-700 text-white focus:border-sky-500 opacity-80"
                                  : "bg-white border-slate-200 text-slate-800 focus:border-sky-400 opacity-85"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Local / Cidade / UF"
                              value={clientAddress}
                              onChange={(e) => setClientAddress(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold text-center placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-xs ${
                                theme === "dark"
                                  ? "bg-slate-800/80 border-slate-700 text-white focus:border-sky-500 opacity-80"
                                  : "bg-white border-slate-200 text-slate-800 focus:border-sky-400 opacity-85"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* 3. SEÇÃO ADICIONAR ITENS E SERVIÇOS DO SEGMENTO */}
                    <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Serviços Rápidos ({activeCategory.title})
                        </h3>
                        <button
                          type="button"
                          onClick={handleAddNewItem}
                          className="text-sky-500 dark:text-sky-400 hover:text-sky-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 outline-none transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> + Novo Item
                        </button>
                      </div>

                      {/* Predefined Quick selectors chips */}
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pb-1 pr-1">
                        {activeCategory.quickServices.map((qs, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddQuickService(qs.name, qs.price)}
                            className={`border px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-2xs active:scale-95 transition-all text-center ${
                              theme === "dark"
                                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                                : "bg-sky-50 border-sky-100 text-sky-800 hover:bg-sky-100"
                            }`}
                          >
                            {qs.label}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Added Services row list */}
                      <div className="space-y-4 pt-3">
                        {items.length === 0 ? (
                          <div className={`rounded-2xl p-6 text-center text-[11px] font-bold uppercase tracking-wide border border-dashed ${
                            theme === "dark"
                              ? "bg-slate-800/30 border-slate-700 text-slate-500"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}>
                            Toque em um serviço rápido ou insira novos itens para orçar
                          </div>
                        ) : (
                          items.map((row) => (
                            <div
                              key={row.id}
                              className={`p-5 rounded-[1.8rem] border flex flex-col gap-4 shadow-sm transition-all relative ${
                                theme === "dark"
                                  ? "bg-slate-900/80 border-slate-800 hover:border-sky-500/20"
                                  : "bg-white border-slate-100 hover:border-sky-100"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-red-500 rounded-lg active:scale-90 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="pr-8 space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-0.5">
                                  Descrição do serviço ou material:
                                </label>
                                <input
                                  type="text"
                                  placeholder="Ex: Instalação, Higienização Completa, Manutenção"
                                  value={row.desc}
                                  onChange={(e) => handleItemFieldChange(row.id, "desc", e.target.value)}
                                  className={`w-full text-xs font-black bg-transparent outline-none focus:border-b focus:border-sky-300 pb-0.5 ${
                                    theme === "dark" ? "text-sky-300 placeholder-slate-700" : "text-sky-800 placeholder-slate-300"
                                  }`}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                                    {activeCategory.modelLabel}:
                                  </label>
                                  <select
                                    value={row.model}
                                    onChange={(e) =>
                                      handleItemFieldChange(row.id, "model", e.target.value)
                                    }
                                    className={`w-full font-bold py-2 rounded-xl text-[10px] px-2 focus:outline-none focus:border-sky-400 border ${
                                      theme === "dark"
                                        ? "bg-slate-850 border-slate-700 text-slate-300 focus:bg-slate-800"
                                        : "bg-slate-50 border-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {activeCategory.models.map((m) => (
                                      <option key={m} value={m}>
                                        {m}
                                      </option>
                                    ))}
                                    <option value="Personalizado">Outro / Especial</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                                    {activeCategory.powerLabel}:
                                  </label>
                                  <select
                                    value={row.power}
                                    onChange={(e) =>
                                      handleItemFieldChange(row.id, "power", e.target.value)
                                    }
                                    className={`w-full font-bold py-2 rounded-xl text-[10px] px-2 focus:outline-none focus:border-sky-400 border ${
                                      theme === "dark"
                                        ? "bg-slate-850 border-slate-700 text-slate-300 focus:bg-slate-800"
                                        : "bg-slate-50 border-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {activeCategory.powers.map((p) => (
                                      <option key={p} value={p}>
                                        {p}
                                      </option>
                                    ))}
                                    <option value="Personalizado">Outro / Especial</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-0.5 mb-1">
                                  Valor Cobrado:
                                </label>
                                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                                  theme === "dark" ? "bg-slate-850 border-slate-700" : "bg-slate-50 border-slate-100"
                                }`}>
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
                                    className={`w-full bg-transparent text-xs font-black text-right focus:outline-none ${
                                      theme === "dark" ? "text-white" : "text-slate-700"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* TOTAL WRAPPER CARD */}
                    <div className="bg-slate-950 rounded-[2.2rem] p-5 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                      <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-sky-400">
                            Soma Estimulada:
                          </span>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            {items.length} itens inclusos ({activeCategory.title})
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
                        <IconComponent name={activeCategory.iconName} className="w-24 h-24 text-white" />
                      </div>
                    </div>

                    {/* PREVIEW SUBMIT BUTTON */}
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className={`w-full py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-sky-400 hover:border-sky-500 hover:text-white"
                          : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-400"
                      }`}
                    >
                      <Eye className="w-4 h-4" /> PRÉ-VISUALIZAR DOCUMENTO
                    </button>
                  </form>
                </div>
              </main>

            </div>
          )}

          {/* FOOTER CONTROLS */}
          <footer className="max-w-4xl mx-auto w-full py-10 text-center space-y-4 safe-pb px-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Todos os direitos reservados • GERADORPRO MULTISSERVIÇOS
              </p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                DEV • B.J.C
              </p>
            </div>
            <a
              href="https://wa.me/5563992092699?text=Ol%C3%A1!%20Sou%20um%20t%C3%A9cnico%20profissional%20e%20usu%C3%A1rio%20do%20GERADORPRO.%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20e%20fortalecer%20nossa%20parceria!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/15 text-[#128C7E] px-6 py-2.5 rounded-full transition-all border border-green-500/10 active:scale-95 shadow-xs"
            >
              <span className="w-2 h-2 bg-[#25D366] rounded-full animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#128C7E]">
                Suporte Técnico Desenvolvedor
              </span>
            </a>
          </footer>

        </div>
      </div>

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
          category={activeCategory?.id || "climatizacao"}
          warranty={warranty}
        />
      </div>

      {/* --- PREVIEW AND DOWNLOAD ACTION DIALOG --- */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[450] flex items-start justify-center p-4 overflow-y-auto safe-pt safe-pb">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto">
            
            {/* Nav top preview */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Prévia Documentada Oficial ({activeCategory?.title || "Climatização"})
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
            <div className="bg-sky-50 px-6 py-3 border-b border-sky-100 flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-[9px] font-bold text-sky-800 leading-tight uppercase">
                Verifique os dados antes de baixar. Toque em SALVAR para consolidar o orçamento no seu histórico.
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
                  category={activeCategory?.id || "climatizacao"}
                  warranty={warranty}
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className="p-5 bg-white border-t space-y-3.5 safe-pb">
              <button
                onClick={() => handleFinalizeAndSave(false)}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-all outline-none cursor-pointer border-none"
              >
                <Download className="w-4 h-4" /> 1. SALVAR NO CELULAR (.PDF)
              </button>
              <button
                onClick={() => handleFinalizeAndSave(true)}
                className="w-full py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-all outline-none shadow-lg shadow-green-100 cursor-pointer border-none"
              >
                <Send className="w-4 h-4" /> 2. SALVAR & ENVIAR WHATSAPP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION FOR DELETION POPUP --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[550] flex items-start justify-center p-4 overflow-y-auto text-slate-800">
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
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-all outline-none cursor-pointer border-none"
              >
                Sim, Excluir Agora
              </button>
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteCandidateId(null);
                }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all outline-none cursor-pointer border-none"
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
        onStatusChange={handleStatusChange}
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
