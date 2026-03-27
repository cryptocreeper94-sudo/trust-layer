import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  Lock,
  CheckCircle2,
  ArrowLeft,
  Fingerprint,
  FileText,
  Shield
, Shield , Shield } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import shieldImage from "/shield-reference.jpg";

const DOCUMENT_HASH = "0x7a3f8c2e1b9d4a6f5c8e3b2a1d9f7e6c4b3a2d1e";
const RATIFICATION_BLOCK = "Genesis";

const immutablePrinciples = [
  {
    number: "I",
    title: "We Belong to Each Other",
    declaration: "This community belongs to everyone who participates. No single entity — including founders, developers, or early adopters — can claim exclusive ownership. We exist for each other."
  },
  {
    number: "II",
    title: "Trust is Earned, Privacy is Protected",
    declaration: "Every member's identity is verified to ensure accountability. Personal information remains private and secure. We build trust through verification, not surveillance."
  },
  {
    number: "III",
    title: "We Operate in Daylight",
    declaration: "All governance decisions, treasury movements, and major changes are publicly visible. Hidden agendas have no place here. What we do, we do openly."
  },
  {
    number: "IV",
    title: "Our Word is Our Bond",
    declaration: "We do not overpromise or create artificial hype. Progress is shared honestly. Timelines are realistic. Setbacks are acknowledged openly. We say what we mean and mean what we say."
  },
  {
    number: "V",
    title: "Every Voice Matters",
    declaration: "Members have a voice in the direction of this community. Governance mechanisms ensure that the community shapes its own future. No voice is too small to be heard."
  },
  {
    number: "VI",
    title: "What is Ours Stays Ours",
    declaration: "Community funds are protected by multi-signature requirements. No single person can unilaterally access or move shared assets. The treasury belongs to all of us."
  },
  {
    number: "VII",
    title: "People Over Profit",
    declaration: "Decisions prioritize long-term community health over short-term gains. We exist to help, not to exploit. Integrity cannot be bought or sold."
  },
  {
    number: "VIII",
    title: "These Stones Do Not Move",
    declaration: "These principles are permanent. They cannot be voted away, amended, or circumvented by anyone — including founders. If these principles are violated, the Signal ceases to be legitimate."
  }
];

export default function SignalCoreOfficial() {
  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="print:hidden bg-slate-900/50 border-b border-white/10 py-4 px-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/signal-core">
            <Button variant="ghost" className="text-gray-400 hover:text-white" data-testid="button-back-signal-core">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Signal Core
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              data-testid="button-print-document"
            >
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              data-testid="button-download-document"
            >
              <Download className="w-4 h-4 mr-2" /> Save as PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 print:py-0 print:px-0">
        <div 
          ref={documentRef}
          className="max-w-4xl mx-auto bg-slate-900/80 print:bg-white border border-white/10 print:border-gray-300 rounded-lg print:rounded-none shadow-2xl"
        >
          <div className="p-8 sm:p-12 print:p-16">
            <div className="text-center mb-10 print:mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block mb-6"
              >
                <div className="w-36 h-40 mx-auto flex items-center justify-center">
                  <img 
                    src={shieldImage} 
                    alt="Trust Layer Shield" 
                    className="w-full h-full object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))'
                    }}
                  />
                </div>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white print:text-black mb-4 tracking-tight">
                SIGNAL CORE
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mx-auto mb-4 print:bg-gray-800" />
              <p className="text-lg text-slate-400 print:text-gray-600 font-serif italic">
                The Immutable Foundation of the Trust Layer
              </p>
            </div>

            <div className="mb-10 p-6 bg-slate-800/50 print:bg-gray-100 rounded-lg border border-white/10 print:border-gray-300">
              <h2 className="text-lg font-semibold text-white print:text-black mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400 print:text-gray-700" />
                A Note on Origin
              </h2>
              <p className="text-slate-300 print:text-gray-700 leading-relaxed text-sm">
                These principles were not invented — they were recognized. They represent universal values of trust, 
                integrity, and mutual respect that exist independently of any individual or organization. The founder 
                of this community serves as a <strong className="text-white print:text-black">steward</strong> of these 
                principles, not their creator or owner. <strong className="text-white print:text-black">No one can change 
                these principles</strong> — not the community, not the governance council, not the founder. They exist 
                above all of us, as the foundation upon which everything else is built.
              </p>
            </div>

            <div className="mb-10 p-6 bg-slate-800/50 print:bg-gray-100 rounded-lg border border-white/10 print:border-gray-300">
              <h2 className="text-lg font-semibold text-white print:text-black mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400 print:text-gray-700" />
                What This Community Is
              </h2>
              <p className="text-slate-300 print:text-gray-700 leading-relaxed text-sm mb-3">
                Think of this as a global trust network — similar to joining your local Rotary Club, Chamber of Commerce, 
                or professional association, but worldwide and verified. There is no charismatic leader to worship, no 
                mandatory beliefs to adopt, no secrets kept from members.
              </p>
              <p className="text-slate-300 print:text-gray-700 leading-relaxed text-sm">
                We are simply people who have agreed to conduct business and build relationships with integrity. 
                Your participation is voluntary. Your identity is verified but private. Your voice matters. 
                <strong className="text-white print:text-black"> This is not a movement or a cult — it's a network of 
                trusted partners.</strong>
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold text-center text-white print:text-black mb-8">
                The Eight Immutable Principles
              </h2>

              <div className="space-y-6">
                {immutablePrinciples.map((principle, index) => (
                  <motion.div
                    key={principle.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 print:bg-gray-200 border border-cyan-500/30 print:border-gray-400 flex items-center justify-center">
                      <span className="text-cyan-400 print:text-gray-800 font-serif font-bold text-lg">
                        {principle.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white print:text-black mb-1">
                        {principle.title}
                      </h3>
                      <p className="text-slate-300 print:text-gray-700 leading-relaxed text-sm">
                        {principle.declaration}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-10 p-6 bg-gradient-to-r from-red-500/10 to-cyan-500/10 print:bg-gray-100 rounded-lg border border-red-500/30 print:border-gray-400">
              <h2 className="text-lg font-semibold text-white print:text-black mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400 print:text-gray-700" />
                Enforcement
              </h2>
              <p className="text-slate-300 print:text-gray-700 leading-relaxed text-sm">
                If any member, including founders or governance council members, violates these principles, the community 
                has every right to consider the Signal compromised. These principles are the contract we make with each 
                other. Break the Core, and the trust dies with it.
              </p>
            </div>

            <div className="border-t border-white/10 print:border-gray-300 pt-8 mt-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400 print:text-gray-600 mb-1">Ratified at Block</p>
                  <p className="text-lg font-mono text-cyan-400 print:text-gray-800">{RATIFICATION_BLOCK}</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 print:bg-gray-100 border-2 border-cyan-500/50 print:border-gray-400 flex items-center justify-center mb-2">
                    <Fingerprint className="w-10 h-10 text-cyan-400 print:text-gray-700" />
                  </div>
                  <p className="text-xs text-slate-500 print:text-gray-600">Guardian Verified</p>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-sm text-slate-400 print:text-gray-600 mb-1">Document Hash</p>
                  <p className="text-sm font-mono text-purple-400 print:text-gray-800 break-all">{DOCUMENT_HASH}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 print:bg-gray-200 print:text-gray-800 border-green-500/30 print:border-gray-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Blockchain Verified
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 print:bg-gray-200 print:text-gray-800 border-purple-500/30 print:border-gray-400">
                  <Lock className="w-3 h-3 mr-1" />
                  Immutable
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="print:hidden max-w-4xl mx-auto mt-6 text-center">
          <p className="text-sm text-slate-500">
            Verify this document at{" "}
            <Link href="/verify" className="text-cyan-400 hover:underline">
              dwsc.io/verify
            </Link>
            {" "}using hash: <code className="text-purple-400">{DOCUMENT_HASH.slice(0, 16)}...</code>
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
