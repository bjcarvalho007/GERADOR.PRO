import { type FC } from "react";
import { QuoteItem } from "../types";

interface QuotePDFProps {
  businessName: string;
  businessCnpj: string;
  clientName: string;
  clientPhone: string;
  clientPhoneAlt?: string;
  clientDoc?: string;
  clientAddress?: string;
  items: QuoteItem[];
  total: string;
  isPremium: boolean;
}

export const QuotePDF: FC<QuotePDFProps> = ({
  businessName,
  businessCnpj,
  clientName,
  clientPhone,
  clientPhoneAlt,
  clientDoc,
  clientAddress,
  items,
  total,
  isPremium,
}) => {
  const currentDate = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div
      id="pdf-template-ref"
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "white",
        color: "#1e293b",
        fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
        padding: "20mm",
        boxSizing: "border-box",
      }}
    >
      {/* Header section with blue border line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "25px",
          paddingBottom: "15px",
          borderBottom: "4px solid #0ea5e9",
        }}
      >
        <div style={{ width: "65%" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
            }}
          >
            {businessName || "TÉCNICO PROFISSIONAL"}
          </h1>
          {businessCnpj && (
            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
                fontWeight: 700,
                marginTop: "6px",
                letterSpacing: "0.5px",
              }}
            >
              CPF/CNPJ: {businessCnpj}
            </div>
          )}
          <p
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              margin: "6px 0 0 0",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: 700,
            }}
          >
            Especialista em Climatização & Refrigeração
          </p>
        </div>
        <div style={{ textAlign: "right", width: "35%" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#0ea5e9",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            ORÇAMENTO
          </h2>
          <p
            style={{
              fontSize: "10px",
              color: "#64748b",
              margin: "6px 0 0 0",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            DATA: {currentDate}
          </p>
        </div>
      </div>

      {/* Client information box */}
      <div
        style={{
          marginBottom: "25px",
          background: "#f8fafc",
          padding: "15px 20px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <table style={{ width: "100%", fontSize: "12px", color: "#334155" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", width: "90px", fontWeight: "bold" }}>
                CLIENTE:
              </td>
              <td style={{ color: "#0f172a", fontWeight: 700, textTransform: "uppercase" }}>
                {clientName || "NÃO INFORMADO"}
              </td>
            </tr>
            {clientDoc && (
              <tr>
                <td style={{ padding: "4px 0", fontWeight: "bold" }}>CPF/CNPJ:</td>
                <td style={{ color: "#0f172a", fontWeight: 600 }}>
                  {clientDoc}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ padding: "4px 0", fontWeight: "bold" }}>CONTATO:</td>
              <td style={{ color: "#0f172a", fontWeight: 600 }}>
                {clientPhone} {clientPhoneAlt ? ` / ${clientPhoneAlt}` : ""}
              </td>
            </tr>
            {clientAddress && (
              <tr>
                <td style={{ padding: "4px 0", fontWeight: "bold" }}>ENDEREÇO:</td>
                <td style={{ color: "#0f172a", fontWeight: 600, textTransform: "uppercase" }}>
                  {clientAddress}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Services and equipment table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0f172a", color: "white" }}>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                borderRadius: "8px 0 0 0",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
              }}
            >
              DESCRIÇÃO DO SERVIÇO
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
              }}
            >
              EQUIPAMENTO / CAPACIDADE
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "right",
                borderRadius: "0 8px 0 0",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
              }}
            >
              VALOR
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                Nenhum serviço e potência cadastrado.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id || index}>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {item.desc || "Serviço Adicional"}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {item.model} • {item.power}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "#0ea5e9",
                    fontFamily: "monospace",
                  }}
                >
                  R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Total section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 24px",
          borderTop: "3px solid #0ea5e9",
          backgroundColor: "#f1f5f9",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: "13px",
              color: "#475569",
              textTransform: "uppercase",
              marginRight: "20px",
              letterSpacing: "1px",
            }}
          >
            VALOR TOTAL GERAL
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: "24px",
              color: "#0ea5e9",
              fontFamily: "monospace",
            }}
          >
            R$ {total}
          </span>
        </div>
      </div>

      {/* Custom Terms & Disclaimers */}
      <div style={{ marginTop: "40px", fontSize: "10px", color: "#64748b", lineHeight: "1.6" }}>
        <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>CONDIÇÕES DO ORÇAMENTO:</p>
        <ul style={{ margin: 0, paddingLeft: "15px", listStyleType: "circle" }}>
          <li>Este orçamento possui validade de 10 dias a partir da data de emissão.</li>
          <li>Garantia dos serviços executados: 90 dias a partir da data de conclusão do serviço.</li>
          <li>Os pagamentos podem ser realizados via Pix, Dinheiro ou Cartão de Crédito.</li>
        </ul>
      </div>

      {/* Footer watermark & Premium disclaimer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "60px",
          borderTop: "1.5px solid #f1f5f9",
          paddingTop: "20px",
          color: isPremium ? "#64748b" : "#cbd5e1",
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {isPremium
          ? `GERADO POR: ${businessName.toUpperCase() || "GERADORPRO PREMIUM"}`
          : "GERADO POR GERADORPRO FREE • ADQUIRA A VERSÃO PREMIUM"}
      </div>
    </div>
  );
};
