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
  { id: 1, name: "Ana Clara M.", product: "Comissão de R$47,90 no TikTok Shop", time: "agora", position: "left-top" },
  { id: 2, name: "Pedro L.", product: "Venda no TikTok Shop — R$89,90", time: "2m", position: "right-top" },
  { id: 3, name: "Juliana S.", product: "R$32,50 confirmada no Shop", time: "1m", position: "right-bottom" },
  { id: 4, name: "Marcos R.", product: "Venda feita: R$67,00 no Shop", time: "agora", position: "left-top" },
  { id: 5, name: "Fernanda O.", product: "R$54,90 de comissão no Shop", time: "3m", position: "right-top" },
  { id: 6, name: "Lucas G.", product: "Nova venda — R$128,00", time: "agora", position: "right-bottom" },
  { id: 7, name: "Camila T.", product: "R$41,20 no TikTok Shop", time: "1m", position: "left-top" },
  { id: 8, name: "Rafael P.", product: "R$93,50 de comissão", time: "agora", position: "right-top" },
  { id: 9, name: "Beatriz N.", product: "R$76,00 no TikTok Shop", time: "2m", position: "right-bottom" },
];

function getPositionClasses(pos: SaleNotification["position"]) {
  switch (pos) {
    case "left-top":
      return "top-[4%] -left-[2%] sm:top-[6%] sm:-left-[1%]";
    case "right-top":
      return "top-[4%] -right-[2%] sm:top-[6%] sm:-right-[1%]";
    case "right-bottom":
      return "bottom-[8%] -right-[2%] sm:bottom-[10%] sm:-right-[1%]";
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
            initial={{ opacity: 0, x: sale.position.startsWith("left") ? -40 : 40, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: sale.position.startsWith("left") ? -30 : 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`absolute ${getPositionClasses(sale.position)} max-w-[170px] sm:max-w-[200px]`}
          >
            <div className="flex items-start gap-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.07] px-2.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
              <div className="relative shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fe2c55] flex items-center justify-center shadow-[0_0_8px_rgba(254,44,85,0.4)]">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-black" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight truncate">
                  {sale.name}
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/70 leading-snug mt-0.5 line-clamp-2">
                  {sale.product}
                </p>
                <p className="text-[8px] sm:text-[9px] text-white/30 mt-0.5">TikTok Shop • {sale.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
