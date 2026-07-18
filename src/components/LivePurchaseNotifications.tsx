import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

type Buyer = { name: string; city: string; when: string };

const BUYERS: Buyer[] = [
  { name: "Ana Clara M.", city: "São Paulo - SP", when: "agora mesmo" },
  { name: "Pedro L.", city: "Rio de Janeiro - RJ", when: "há 1 min" },
  { name: "Juliana S.", city: "Belo Horizonte - MG", when: "há 2 min" },
  { name: "Marcos R.", city: "Curitiba - PR", when: "agora mesmo" },
  { name: "Fernanda O.", city: "Fortaleza - CE", when: "há 3 min" },
  { name: "Lucas G.", city: "Porto Alegre - RS", when: "há 1 min" },
  { name: "Camila T.", city: "Recife - PE", when: "agora mesmo" },
  { name: "Rafael P.", city: "Salvador - BA", when: "há 2 min" },
  { name: "Beatriz N.", city: "Brasília - DF", when: "há 4 min" },
  { name: "Gabriel A.", city: "Manaus - AM", when: "agora mesmo" },
  { name: "Larissa D.", city: "Goiânia - GO", when: "há 2 min" },
  { name: "Thiago F.", city: "Florianópolis - SC", when: "há 1 min" },
  { name: "Isabela V.", city: "Vitória - ES", when: "agora mesmo" },
  { name: "Vinícius C.", city: "Natal - RN", when: "há 3 min" },
  { name: "Mariana Q.", city: "Campinas - SP", when: "há 1 min" },
  { name: "Gustavo B.", city: "João Pessoa - PB", when: "agora mesmo" },
];

export default function LivePurchaseNotifications() {
  const [current, setCurrent] = useState<(Buyer & { id: number }) | null>(null);

  useEffect(() => {
    let i = Math.floor(Math.random() * BUYERS.length);
    let mounted = true;
    let timeoutHide: ReturnType<typeof setTimeout>;
    let timeoutNext: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (!mounted) return;
      const buyer = BUYERS[i % BUYERS.length];
      i++;
      setCurrent({ ...buyer, id: Date.now() });
      timeoutHide = setTimeout(() => {
        if (!mounted) return;
        setCurrent(null);
        timeoutNext = setTimeout(showNext, 3500 + Math.random() * 2500);
      }, 5000);
    };

    const kickoff = setTimeout(showNext, 4000);

    return () => {
      mounted = false;
      clearTimeout(kickoff);
      clearTimeout(timeoutHide);
      clearTimeout(timeoutNext);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-3 z-[70] pointer-events-none sm:bottom-5 sm:left-5">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="max-w-[290px] sm:max-w-[320px]"
          >
            <div className="flex items-start gap-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 px-3 py-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F6DFF] to-[#8A2BE2] grid place-items-center">
                  <ShoppingBag className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-bold text-white truncate">{current.name}</p>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                  acabou de garantir os prompts por{" "}
                  <span className="text-emerald-400 font-bold">R$ 67,90</span>
                </p>
                <p className="text-[10px] text-white/45 mt-1 truncate">
                  {current.city} · {current.when}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
