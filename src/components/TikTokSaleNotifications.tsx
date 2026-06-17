import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface SaleNotification {
  id: number;
  name: string;
  product: string;
  time: string;
  position: "left-top" | "right-top" | "right-bottom";
}

const salesData: SaleNotification[] = [
  { id: 1, name: "Ana Clara M.", product: "Ganhei uma comissão de R$47,90 no TikTok Shop", time: "agora", position: "left-top" },
  { id: 2, name: "Pedro L.", product: "Acabei de vender no TikTok Shop — R$89,90", time: "2m", position: "right-top" },
  { id: 3, name: "Juliana S.", product: "Comissão de R$32,50 confirmada no Shop", time: "1m", position: "right-bottom" },
  { id: 4, name: "Marcos R.", product: "Venda feita no TikTok Shop: R$67,00", time: "agora", position: "left-top" },
  { id: 5, name: "Fernanda O.", product: "Ganhei R$54,90 de comissão agora no Shop", time: "3m", position: "right-top" },
  { id: 6, name: "Lucas G.", product: "Nova venda no TikTok Shop — R$128,00", time: "agora", position: "right-bottom" },
  { id: 7, name: "Camila T.", product: "Comissão de R$41,20 no TikTok Shop", time: "1m", position: "left-top" },
  { id: 8, name: "Rafael P.", product: "Vendido no Shop: R$93,50 de comissão", time: "agora", position: "right-top" },
  { id: 9, name: "Beatriz N.", product: "Ganhei R$76,00 no TikTok Shop agora", time: "2m", position: "right-bottom" },
];

function getPositionClasses(pos: SaleNotification["position"]) {
  switch (pos) {
    case "left-top":
      return "top-[12%] left-[2%] sm:top-[15%] sm:left-[5%]";
    case "right-top":
      return "top-[10%] right-[2%] sm:top-[12%] sm:right-[5%]";
    case "right-bottom":
      return "bottom-[28%] right-[2%] sm:bottom-[25%] sm:right-[5%]";
  }
}

export default function TikTokSaleNotifications() {
  const [visible, setVisible] = useState<SaleNotification[]>([]);

  useEffect(() => {
    let currentIndex = 0;

    const showNext = () => {
      const sale = salesData[currentIndex % salesData.length];
      currentIndex++;

      setVisible((prev) => {
        const filtered = prev.filter((p) => p.position !== sale.position);
        return [...filtered, sale];
      });

      setTimeout(() => {
        setVisible((prev) => prev.filter((p) => p.id !== sale.id));
      }, 4200);
    };

    showNext();
    const interval = setInterval(showNext, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {visible.map((sale) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, x: sale.position.startsWith("left") ? -60 : 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: sale.position.startsWith("left") ? -40 : 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`absolute ${getPositionClasses(sale.position)} max-w-[220px] sm:max-w-[260px]`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fe2c55] flex items-center justify-center shadow-[0_0_12px_rgba(254,44,85,0.5)]">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-[12px] font-semibold text-white leading-tight truncate">
                  {sale.name}
                </p>
                <p className="text-[10px] sm:text-[11px] text-white/70 leading-snug mt-0.5 line-clamp-2">
                  {sale.product}
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/35 mt-1">TikTok Shop • {sale.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
