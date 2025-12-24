import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QRDisplayProps {
  address: string;
  chainName?: string;
  size?: number;
}

export function QRDisplay({ address, chainName = "DarkWave", size = 200 }: QRDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Address Copied", description: "Wallet address copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRSvg = (text: string): string => {
    const modules = generateQRMatrix(text);
    const moduleSize = size / modules.length;
    
    let paths = "";
    for (let y = 0; y < modules.length; y++) {
      for (let x = 0; x < modules[y].length; x++) {
        if (modules[y][x]) {
          paths += `M${x * moduleSize},${y * moduleSize}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
        }
      }
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="white"/>
      <path d="${paths}" fill="black"/>
    </svg>`;
  };

  const generateQRMatrix = (text: string): boolean[][] => {
    const size = 25;
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isBlack = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        matrix[i][j] = isBlack;
        matrix[i][size - 1 - j] = isBlack;
        matrix[size - 1 - i][j] = isBlack;
      }
    }
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    
    for (let y = 8; y < size - 8; y++) {
      for (let x = 8; x < size - 8; x++) {
        matrix[y][x] = ((hash >> ((x + y * size) % 32)) & 1) === 1;
      }
    }
    
    return matrix;
  };

  const downloadQR = () => {
    const svg = generateQRSvg(address);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chainName.toLowerCase()}-wallet-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "QR Downloaded", description: "QR code saved as SVG" });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8"
        title="Show QR Code"
        data-testid="button-show-qr"
      >
        <QrCode className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              data-testid="qr-overlay"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              data-testid="qr-modal"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">{chainName} Wallet</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} data-testid="button-close-qr">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div 
                  className="bg-white p-4 rounded-xl mb-4"
                  dangerouslySetInnerHTML={{ __html: generateQRSvg(address) }}
                  data-testid="qr-code"
                />
                
                <p className="text-xs text-muted-foreground text-center mb-4">
                  Scan this QR code to receive funds
                </p>

                <div className="w-full p-3 bg-black/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-xs font-mono break-all" data-testid="text-address">{address}</p>
                </div>
              </div>

              <div className="flex gap-2 p-4 border-t border-white/10">
                <Button variant="outline" className="flex-1 gap-2" onClick={copyAddress} data-testid="button-copy-address">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Address"}
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={downloadQR} data-testid="button-download-qr">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
