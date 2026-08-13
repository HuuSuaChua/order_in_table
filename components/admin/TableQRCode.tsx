"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";

interface Props {
  tableName: string;
  tableCode: string;
  qrToken: string;
}

export default function TableQRCode({
  tableName,
  tableCode,
  qrToken,
}: Props) {
  const [copied, setCopied] = useState(false);

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/table/${qrToken}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">
            {tableName}
          </h3>

          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {tableCode}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sẵn sàng
        </span>
      </div>

      <div className="relative group/qr flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800/80 shadow-inner">
        <div className="p-3 bg-white rounded-lg shadow-lg relative">
          <QRCodeSVG
            value={qrUrl}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        <p className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          Quét mã để xem menu
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-2 text-[11px] font-mono text-slate-400">
        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />

        <span className="truncate">
          {qrUrl}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className={`mt-3 flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer border ${
          copied
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-slate-800/60 border-slate-700/50 text-slate-200 hover:bg-slate-800 hover:text-white"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Đã Copy Link
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Sao chép Link QR
          </>
        )}
      </button>
    </div>
  );
}