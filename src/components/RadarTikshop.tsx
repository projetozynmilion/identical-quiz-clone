import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  TrendingUp,
  Flame,
  Eye,
  Lock,
  Unlock,
  Crosshair,
  ChevronRight,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Search,
  ArrowUpRight,
  Sparkles,
  Users,
  ShoppingCart,
  Filter,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ====== Catálogo curado de produtos quentes do TikTok Shop ======
type Product = {
  id: string;
  position?: number;
  name: string;
  emoji: string;
  category: string;
  price: number;
  oldPrice?: number;
  sales24h: number;
  growth: number;
  views: number; // em milhões
  creators: number;
  conversionScore: number;
  competition: "BAIXA" | "MÉDIA" | "ALTA";
  hashtag: string;
  hook: string;
  trend: number[]; // sparkline 12 pts
  affiliateUrl?: string;
  imageUrl?: string;
};

const REAL_PRODUCT_IMAGES = [
  "/__l5e/assets-v1/59bd2b56-5def-49bd-ad57-81cf56188588/IMG_3225.jpeg",
  "/__l5e/assets-v1/87a41c76-715c-4275-8b61-e704542b8c94/IMG_3226.jpeg",
  "/__l5e/assets-v1/95447141-871f-492b-938e-0e6086820686/IMG_3227.jpeg",
  "/__l5e/assets-v1/7cad9364-1053-4cd0-b0da-1175bcb56f7f/IMG_3228.jpeg",
  "/__l5e/assets-v1/9f83ded8-a084-4562-a3d6-99114640d25d/IMG_3229.jpeg",
  "/__l5e/assets-v1/ebacc0c5-7880-4b4e-9d47-44c2cd688f5e/IMG_3230.jpeg",
  "/__l5e/assets-v1/dcfbbeb5-fd67-41f9-8ae1-a1cfeb183cc9/IMG_3231.jpeg",
  "/__l5e/assets-v1/09e43bcd-592c-4860-a945-031370ab3ee2/IMG_3232.jpeg",
  "/__l5e/assets-v1/e530f31b-ab5d-433a-b596-5e7285e511b3/IMG_3233.jpeg",
  "/__l5e/assets-v1/d7e25ce3-f26a-47d9-bedf-19693a22e764/IMG_3234.jpeg",
  "/__l5e/assets-v1/a44ae177-b5bd-4ba9-a6f0-adb562770e57/IMG_3236.jpeg",
  "/__l5e/assets-v1/1cf78407-8601-4322-8811-b18745e541c5/IMG_3237.jpeg",
  "/__l5e/assets-v1/028a9aea-a430-47cd-b78d-1b4935ebb687/IMG_3238.jpeg",
  "/__l5e/assets-v1/d7e0d2fd-de08-4959-b227-8f97ed6890f7/IMG_3239.jpeg",
  "/__l5e/assets-v1/57ef3817-5753-4a4e-93c7-a01df28b5221/IMG_3240.jpeg",
];

const REAL_RADAR_PRODUCTS: Product[] = [
  { id: "real-barbours", position: 1, name: "Body Splash My Sweet Delight Barbour's Beauty 200ml", emoji: "💜", category: "Beleza", price: 23.94, oldPrice: 57.00, sales24h: 32400, growth: 420, views: 15.6, creators: 1850, conversionScore: 96, competition: "ALTA", hashtag: "#bodysplash", hook: "Body Splash Barbour's com 667K vendidos – viral no TikTok Shop", trend: [30, 40, 50, 60, 70, 78, 85, 90, 94, 97, 99, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jmurTfSjLK-HNq0u/", imageUrl: "/__l5e/assets-v1/dffcabbf-a5d2-447f-8338-e9192b3f992b/produto-em-alta.jpeg" },
  { id: "real-1", position: 2, name: "Camiseta Brasil Joga Bonito 10 Oversized", emoji: "🇧🇷", category: "Moda", price: 15.98, sales24h: 4520, growth: 320, views: 8.2, creators: 840, conversionScore: 92, competition: "MÉDIA", hashtag: "#brasilcore", hook: "Camiseta Brasil oversized que está puxando venda em vídeo curto", trend: [20, 28, 36, 45, 53, 62, 71, 80, 88, 94, 98, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrMBFmLeY-3H106/", imageUrl: REAL_PRODUCT_IMAGES[0] },
  { id: "real-2", position: 3, name: "Tshirt Brasil 10 South America Oversized", emoji: "⚽", category: "Moda", price: 29.95, sales24h: 3210, growth: 280, views: 6.5, creators: 690, conversionScore: 90, competition: "MÉDIA", hashtag: "#camisetabrasil", hook: "Visual Copa 2026 com apelo forte para afiliado de moda", trend: [18, 24, 33, 41, 49, 58, 66, 75, 83, 91, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrf39wrM6-X9CP9/", imageUrl: REAL_PRODUCT_IMAGES[1] },
  { id: "real-3", position: 4, name: "Cropped Oversized Brasil Premium Copa 2026", emoji: "🔥", category: "Moda", price: 23.01, sales24h: 5800, growth: 223, views: 7.2, creators: 970, conversionScore: 94, competition: "ALTA", hashtag: "#lookbrasil", hook: "Cropped Brasil com visual viral para looks de jogo", trend: [22, 30, 40, 51, 60, 69, 77, 84, 90, 95, 98, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrf39wrM6-X9CP9/", imageUrl: REAL_PRODUCT_IMAGES[2] },
  { id: "real-4", position: 5, name: "Short Alfaiataria Feminino com Cinto", emoji: "✨", category: "Moda", price: 18.08, sales24h: 9200, growth: 187, views: 12.4, creators: 1280, conversionScore: 95, competition: "ALTA", hashtag: "#achadinhos", hook: "Short barato com cara premium para vídeos de provador", trend: [25, 34, 43, 52, 62, 71, 79, 86, 92, 96, 99, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrpCrPxka-OqpVj/", imageUrl: REAL_PRODUCT_IMAGES[3] },
  { id: "real-5", position: 6, name: "Macaquinho Jeans Tomara Que Caia", emoji: "👗", category: "Moda", price: 50.88, sales24h: 2080, growth: 154, views: 3.2, creators: 320, conversionScore: 86, competition: "MÉDIA", hashtag: "#macaquinho", hook: "Peça única com forte apelo visual para review rápido", trend: [15, 21, 28, 37, 46, 54, 63, 72, 81, 89, 95, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrWvMXmBA-9nIp8/", imageUrl: REAL_PRODUCT_IMAGES[4] },
  { id: "real-6", position: 7, name: "Conjunto Pantalona Brasil Cropped Blogueira", emoji: "🇧🇷", category: "Moda", price: 55.38, sales24h: 1850, growth: 142, views: 2.8, creators: 280, conversionScore: 84, competition: "MÉDIA", hashtag: "#lookblogueira", hook: "Conjunto Brasil pronto para conteúdo de look completo", trend: [12, 19, 27, 35, 44, 52, 61, 70, 80, 88, 95, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUrWvMXmBA-9nIp8/", imageUrl: REAL_PRODUCT_IMAGES[5] },
  { id: "real-7", position: 8, name: "Macacão Premium Decote Costas Nua Fitness", emoji: "💪", category: "Fitness", price: 22.32, sales24h: 1420, growth: 138, views: 2.1, creators: 210, conversionScore: 78, competition: "BAIXA", hashtag: "#fitnesslook", hook: "Macacão fitness com ângulo de costas que chama clique", trend: [10, 16, 24, 32, 42, 51, 60, 69, 78, 87, 94, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUhLHmcaS4-wB5HB/", imageUrl: REAL_PRODUCT_IMAGES[6] },
  { id: "real-8", position: 9, name: "Conjunto Alfaiataria Colete + Short Social", emoji: "🧥", category: "Moda", price: 40.0, sales24h: 2480, growth: 151, views: 3.4, creators: 340, conversionScore: 83, competition: "MÉDIA", hashtag: "#alfaiataria", hook: "Conjunto social que parece caro e vende bem no antes/depois", trend: [14, 20, 29, 38, 47, 57, 66, 75, 83, 90, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUhjQR9ocP-hVnAj/", imageUrl: REAL_PRODUCT_IMAGES[7] },
  { id: "real-9", position: 10, name: "Biquíni Brasil Verde e Branco Esportivo", emoji: "🏖️", category: "Moda", price: 41.84, sales24h: 1680, growth: 146, views: 2.4, creators: 240, conversionScore: 77, competition: "BAIXA", hashtag: "#modapraia", hook: "Biquíni Brasil para criativos de praia, verão e jogo", trend: [11, 17, 25, 34, 43, 52, 62, 71, 80, 88, 95, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUhBs1wbKV-O5XS8/", imageUrl: REAL_PRODUCT_IMAGES[8] },
  { id: "real-10", position: 11, name: "Conjunto Top Faixa Tomara Que Caia + Calça Pantalona Listra Lateral", emoji: "👚", category: "Moda", price: 64.30, oldPrice: 120.00, sales24h: 1895, growth: 168, views: 4.1, creators: 410, conversionScore: 88, competition: "MÉDIA", hashtag: "#conjuntofeminino", hook: "Conjunto tomara que caia listra lateral – oferta relâmpago -46%", trend: [18, 26, 34, 42, 50, 58, 67, 75, 83, 90, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUSqwL4WnK-zUV2w/", imageUrl: REAL_PRODUCT_IMAGES[9] },
  { id: "real-11", position: 12, name: "Blusa Regata Brasil Torcedora Listras", emoji: "🇧🇷", category: "Moda", price: 13.99, sales24h: 1583, growth: 195, views: 3.8, creators: 380, conversionScore: 85, competition: "MÉDIA", hashtag: "#brasiltorcedora", hook: "Regata Brasil torcedora por R$13,99 – preço viral pra Copa", trend: [14, 22, 30, 38, 46, 54, 63, 71, 79, 87, 94, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUSst1hoAn-OYR4u/", imageUrl: REAL_PRODUCT_IMAGES[10] },
  { id: "real-12", position: 13, name: "Jaqueta Teddy Cropped Pelo Sintético Sherpa", emoji: "🧥", category: "Moda", price: 49.40, oldPrice: 65.00, sales24h: 6478, growth: 215, views: 9.6, creators: 1020, conversionScore: 91, competition: "ALTA", hashtag: "#jaquetateddy", hook: "Jaqueta teddy cropped que viralizou em try-on de inverno", trend: [22, 30, 38, 46, 54, 62, 70, 78, 85, 91, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUS34wHXxw-YJ8TV/", imageUrl: REAL_PRODUCT_IMAGES[11] },
  { id: "real-13", position: 14, name: "BabyDoll Short e Blusa Renda Canelado Feminino", emoji: "🎀", category: "Moda", price: 19.92, oldPrice: 39.90, sales24h: 30900, growth: 240, views: 18.4, creators: 2150, conversionScore: 96, competition: "ALTA", hashtag: "#pijamafeminino", hook: "BabyDoll canelado com 30K+ vendidos – conteúdo de pijama bomba", trend: [28, 36, 44, 52, 60, 68, 76, 83, 89, 94, 98, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUAJWR8oQ2-UDNF8/", imageUrl: REAL_PRODUCT_IMAGES[12] },
  { id: "real-14", position: 15, name: "Camiseta Feminina Treino Academia Estampada Fitness", emoji: "💪", category: "Fitness", price: 18.32, oldPrice: 69.90, sales24h: 8806, growth: 274, views: 11.2, creators: 1340, conversionScore: 93, competition: "ALTA", hashtag: "#fitness", hook: "Camiseta fitness estampada com -74% – bomba pra antes/depois", trend: [20, 28, 36, 44, 52, 60, 69, 77, 84, 91, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUAUnJRTAe-KaxSz/", imageUrl: REAL_PRODUCT_IMAGES[13] },
  { id: "real-15", position: 16, name: "Vestido Macaquinho Estampa Luxo com Bojo e Short", emoji: "👗", category: "Moda", price: 39.00, oldPrice: 115.00, sales24h: 8758, growth: 232, views: 10.8, creators: 1190, conversionScore: 90, competition: "ALTA", hashtag: "#vestidoluxo", hook: "Vestido macaquinho estampa luxo -66% – conteúdo de look bomba", trend: [18, 26, 34, 42, 51, 60, 68, 76, 84, 91, 96, 100], affiliateUrl: "https://vt.tiktok.com/ZS9jUA6TVeA6P-2ECEx/", imageUrl: REAL_PRODUCT_IMAGES[14] },
];

// gradient por categoria (sensação de "thumbnail" sem precisar de imagem real)
const CAT_GRADIENT: Record<string, string> = {
  Beleza: "linear-gradient(135deg, #ff7eb6 0%, #c084fc 100%)",
  Moda: "linear-gradient(135deg, #fda4af 0%, #f97316 100%)",
  Maquiagem: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
  Casa: "linear-gradient(135deg, #60a5fa 0%, #34d399 100%)",
  Cozinha: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
  Fitness: "linear-gradient(135deg, #34d399 0%, #06b6d4 100%)",
  Gadgets: "linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)",
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sérum Vitamina C Coreano 30ml", emoji: "✨", category: "Beleza", price: 39.9, oldPrice: 89.9, sales24h: 12847, growth: 312, views: 48.2, creators: 2840, conversionScore: 94, competition: "MÉDIA", hashtag: "#skincareroutine", hook: "POV: descobri o sérum que clareou minha pele em 7 dias", trend: [12, 18, 22, 28, 35, 44, 58, 72, 81, 88, 92, 100] },
  { id: "p2", name: "Massageador Facial Lifting 3D", emoji: "💆‍♀️", category: "Beleza", price: 27.5, oldPrice: 79.9, sales24h: 9210, growth: 487, views: 31.7, creators: 1654, conversionScore: 91, competition: "BAIXA", hashtag: "#facialmassage", hook: "Antes e depois de 30 dias usando isso", trend: [8, 12, 15, 22, 30, 40, 55, 68, 78, 86, 94, 100] },
  { id: "p3", name: "Conjunto Cropped + Saia Plissada", emoji: "👗", category: "Moda", price: 59.9, oldPrice: 129.0, sales24h: 8432, growth: 278, views: 22.4, creators: 1289, conversionScore: 89, competition: "MÉDIA", hashtag: "#achadinhostiktok", hook: "Esse conjunto é tão 👄 e o preço é melhor ainda", trend: [20, 24, 30, 36, 44, 52, 60, 68, 76, 84, 92, 100] },
  { id: "p4", name: "Organizador Magnético Geladeira", emoji: "🧲", category: "Casa", price: 22.9, sales24h: 7890, growth: 521, views: 18.9, creators: 942, conversionScore: 88, competition: "BAIXA", hashtag: "#organizacao", hook: "Ninguém vai acreditar como minha geladeira ficou", trend: [5, 8, 12, 18, 26, 36, 48, 62, 76, 86, 94, 100] },
  { id: "p5", name: "Pó Compacto HD Matte 24h", emoji: "💄", category: "Maquiagem", price: 34.9, oldPrice: 69.9, sales24h: 7234, growth: 198, views: 27.1, creators: 2104, conversionScore: 87, competition: "ALTA", hashtag: "#maquiagemfacil", hook: "Testei o pó viral do TikTok por 7 dias", trend: [30, 36, 42, 48, 55, 62, 68, 74, 82, 88, 94, 100] },
  { id: "p6", name: "Mini Liquidificador Portátil USB", emoji: "🥤", category: "Cozinha", price: 49.9, oldPrice: 119.0, sales24h: 6541, growth: 342, views: 16.8, creators: 832, conversionScore: 86, competition: "BAIXA", hashtag: "#detox", hook: "Saí da CLT e agora levo meu suco pra todo lugar", trend: [12, 18, 24, 32, 40, 50, 60, 70, 80, 88, 95, 100] },
  { id: "p7", name: "Calça Wide Leg Alfaiataria", emoji: "👖", category: "Moda", price: 79.9, sales24h: 6122, growth: 256, views: 19.3, creators: 1542, conversionScore: 85, competition: "MÉDIA", hashtag: "#outfitdodia", hook: "A calça que veste tudo e disfarça tudo", trend: [25, 30, 36, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p8", name: "Cílios Postiços Magnéticos Kit", emoji: "👁️", category: "Maquiagem", price: 19.9, oldPrice: 59.9, sales24h: 5984, growth: 412, views: 21.7, creators: 1873, conversionScore: 84, competition: "ALTA", hashtag: "#cilios", hook: "Sem cola, sem trauma, em 10 segundos no olho", trend: [10, 15, 22, 30, 40, 52, 62, 72, 82, 90, 96, 100] },
  { id: "p9", name: "Tapete Antiderrapante Banheiro", emoji: "🛁", category: "Casa", price: 29.9, sales24h: 5421, growth: 367, views: 12.4, creators: 612, conversionScore: 83, competition: "BAIXA", hashtag: "#casanova", hook: "Esse achadinho salvou meu banheiro", trend: [8, 14, 22, 30, 40, 50, 60, 70, 80, 88, 94, 100] },
  { id: "p10", name: "Bolsa Tote Bag Couro PU", emoji: "👜", category: "Moda", price: 89.9, oldPrice: 199.0, sales24h: 5102, growth: 189, views: 14.8, creators: 1102, conversionScore: 82, competition: "MÉDIA", hashtag: "#bolsa", hook: "Achei a bolsa dos sonhos por menos de 100", trend: [40, 46, 52, 58, 64, 70, 76, 82, 88, 92, 96, 100] },
  { id: "p11", name: "Caneta Iluminadora Líquida", emoji: "💎", category: "Maquiagem", price: 17.9, sales24h: 4876, growth: 298, views: 15.2, creators: 1421, conversionScore: 81, competition: "MÉDIA", hashtag: "#glowup", hook: "O glow que todo mundo quer copiar", trend: [18, 24, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
  { id: "p12", name: "Suporte Celular Veicular Magnético", emoji: "📱", category: "Gadgets", price: 24.9, sales24h: 4321, growth: 234, views: 11.6, creators: 489, conversionScore: 80, competition: "BAIXA", hashtag: "#carros", hook: "Por que eu não comprei isso antes?", trend: [22, 28, 34, 40, 48, 56, 64, 72, 80, 86, 94, 100] },
  { id: "p13", name: "Vestido Midi Tubinho Canelado", emoji: "👗", category: "Moda", price: 69.9, oldPrice: 149.0, sales24h: 4198, growth: 312, views: 17.8, creators: 1287, conversionScore: 79, competition: "ALTA", hashtag: "#vestido", hook: "Sem acreditar que esse vestido perfeito está quase de graça", trend: [16, 22, 30, 38, 46, 54, 62, 72, 80, 88, 94, 100] },
  { id: "p14", name: "Escova Secadora Rotativa 3 em 1", emoji: "💇‍♀️", category: "Beleza", price: 129.9, oldPrice: 299.0, sales24h: 3987, growth: 421, views: 26.4, creators: 2010, conversionScore: 92, competition: "MÉDIA", hashtag: "#cabelo", hook: "Saí do salão sem sair de casa", trend: [10, 18, 26, 36, 46, 56, 66, 76, 84, 90, 96, 100] },
  { id: "p15", name: "Kit Pincéis Maquiagem 12 peças", emoji: "🖌️", category: "Maquiagem", price: 44.9, sales24h: 3756, growth: 178, views: 13.2, creators: 1654, conversionScore: 78, competition: "ALTA", hashtag: "#pinceis", hook: "Kit completo por menos que 1 pincel da MAC", trend: [50, 55, 60, 65, 70, 75, 80, 84, 88, 92, 96, 100] },
  { id: "p16", name: "Luminária LED Lua 3D Toque", emoji: "🌙", category: "Casa", price: 59.9, sales24h: 3421, growth: 389, views: 9.8, creators: 412, conversionScore: 77, competition: "BAIXA", hashtag: "#decor", hook: "A luminária que transforma qualquer quarto", trend: [12, 20, 28, 36, 46, 56, 66, 74, 82, 90, 96, 100] },
  { id: "p17", name: "Top Cropped Esportivo Acolchoado", emoji: "🩷", category: "Fitness", price: 39.9, sales24h: 3287, growth: 267, views: 10.4, creators: 921, conversionScore: 76, competition: "MÉDIA", hashtag: "#fitness", hook: "Treinei 30 dias com isso e mudou tudo", trend: [20, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p18", name: "Caixa Organizadora Empilhável Kit 6", emoji: "📦", category: "Casa", price: 18.9, sales24h: 2987, growth: 312, views: 8.6, creators: 387, conversionScore: 75, competition: "BAIXA", hashtag: "#organizar", hook: "Como organizei meu armário gastando quase nada", trend: [14, 22, 30, 38, 46, 54, 62, 72, 80, 88, 94, 100] },
  { id: "p19", name: "Batom Líquido Matte Longa Duração", emoji: "💋", category: "Maquiagem", price: 24.9, sales24h: 2854, growth: 198, views: 14.3, creators: 1789, conversionScore: 74, competition: "ALTA", hashtag: "#batom", hook: "Comi, bebi e o batom continuou intacto", trend: [40, 46, 52, 58, 64, 70, 76, 82, 88, 92, 96, 100] },
  { id: "p20", name: "Fone Bluetooth In-Ear Gamer", emoji: "🎧", category: "Gadgets", price: 79.9, oldPrice: 199.0, sales24h: 2654, growth: 243, views: 11.2, creators: 642, conversionScore: 73, competition: "MÉDIA", hashtag: "#fone", hook: "Fone de R$80 que entrega som de R$500", trend: [22, 30, 38, 46, 54, 60, 68, 74, 82, 88, 94, 100] },
  { id: "p21", name: "Bermuda Ciclista Modeladora", emoji: "🩳", category: "Fitness", price: 34.9, sales24h: 2521, growth: 287, views: 9.1, creators: 821, conversionScore: 72, competition: "MÉDIA", hashtag: "#bodybuilding", hook: "A bermuda que afina a cintura na hora", trend: [18, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p22", name: "Difusor Aromaterapia Ultrassônico", emoji: "🌿", category: "Casa", price: 89.9, sales24h: 2398, growth: 198, views: 7.4, creators: 312, conversionScore: 71, competition: "BAIXA", hashtag: "#aromaterapia", hook: "Meu quarto virou spa em 5 minutos", trend: [32, 38, 44, 50, 56, 62, 70, 76, 82, 88, 94, 100] },
  { id: "p23", name: "Tênis Chunky Plataforma Branco", emoji: "👟", category: "Moda", price: 119.9, oldPrice: 249.0, sales24h: 2241, growth: 312, views: 13.9, creators: 1421, conversionScore: 70, competition: "ALTA", hashtag: "#tenis", hook: "Esse tênis alonga a perna que é uma loucura", trend: [16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
  { id: "p24", name: "Máscara Cabelo Hidratação Profunda", emoji: "💆‍♀️", category: "Beleza", price: 32.9, sales24h: 2087, growth: 234, views: 11.7, creators: 1102, conversionScore: 69, competition: "MÉDIA", hashtag: "#cronograma", hook: "Reconstruí meu cabelo em 4 semanas", trend: [20, 26, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
];

const CATEGORIES = ["TODOS", "Beleza", "Moda", "Maquiagem", "Casa", "Cozinha", "Fitness", "Gadgets"];
type SortKey = "position" | "score" | "sales" | "growth" | "views";
const SORTS: { id: SortKey; label: string }[] = [
  { id: "position", label: "Ordem" },
  { id: "score", label: "Score" },
  { id: "growth", label: "Crescimento" },
  { id: "sales", label: "Vendas 24h" },
  { id: "views", label: "Views" },
];

// ───────────────────────────── helpers ─────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}
function timeNow() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function Sparkline({ data, color = "#10b981", width = 80, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / Math.max(1, max - min)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  const gradId = `g-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / Math.max(1, max - min)) * height} r="2" fill={color} />
    </svg>
  );
}

function ProductThumb({ p, size = 56 }: { p: Product; size?: number }) {
  if (p.imageUrl) {
    return (
      <div className="relative shrink-0 rounded-xl overflow-hidden bg-black" style={{ width: size, height: size }}>
        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  }
  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size, background: CAT_GRADIENT[p.category] || "#1f2937" }}
    >
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 60%)" }} />
      <span style={{ fontSize: size * 0.5, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>{p.emoji}</span>
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

// ───────────────────────────── Hero billboard ─────────────────────────────
function HeroCard({ p, onOpen }: { p: Product; onOpen: () => void }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-emerald-500/20 group"
      style={{ minHeight: 320 }}
    >
      {p.imageUrl ? (
        <div className="absolute inset-y-0 right-0 w-full md:w-[46%] bg-black flex items-center justify-center">
          <img src={p.imageUrl} alt={p.name} className="h-full w-auto max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: CAT_GRADIENT[p.category] || "linear-gradient(135deg,#10b981,#0f766e)" }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-emerald-400/70" style={{ animation: "scanline 4s linear infinite", boxShadow: "0 0 18px #10b981" }} />

      <div className="relative z-10 p-6 md:p-9 flex flex-col h-full justify-end" style={{ minHeight: 320 }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
            #1 EM ALTA
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200/60">{p.category}</span>
        </div>
        <h2 className="text-white text-2xl md:text-4xl font-black tracking-tight max-w-2xl leading-[1.05] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {p.name}
        </h2>
        <div className="flex items-baseline gap-3 mt-3">
          <span className="font-mono text-3xl md:text-4xl font-black text-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            R$ {p.price.toFixed(2).replace(".", ",")}
          </span>
          {p.oldPrice && <span className="font-mono text-base text-white/40 line-through">R$ {p.oldPrice.toFixed(0)}</span>}
        </div>
        <p className="text-emerald-50/80 text-sm md:text-base mt-3 max-w-xl italic">"{p.hook}"</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-emerald-400/30 font-mono text-[11px] text-emerald-300 font-bold">
            <TrendingUp className="w-3 h-3" /> +{p.growth}%
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-white/80">
            <ShoppingCart className="w-3 h-3" /> {p.sales24h.toLocaleString("pt-BR")}/24h
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-white/80">
            <Eye className="w-3 h-3" /> {p.views}M views
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-white/80">
            <Sparkles className="w-3 h-3" /> Score {p.conversionScore}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          {p.affiliateUrl && (
            <a
              href={p.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm transition active:scale-[0.97]"
              style={{ boxShadow: "0 0 30px rgba(16,185,129,0.55)" }}
            >
              <ExternalLink className="w-4 h-4" /> ME AFILIAR AGORA
            </a>
          )}
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-bold text-sm transition"
          >
            <Eye className="w-4 h-4" /> Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Netflix-style row ─────────────────────────────
function NetflixRow({ title, subtitle, items, onOpen }: {
  title: string; subtitle?: string; items: Product[]; onOpen: (p: Product) => void; accent?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  return (
    <div className="group/row">
      <div className="flex items-end justify-between mb-3 px-0.5">
        <div>
          <h3 className="text-white font-black text-lg md:text-xl tracking-tight flex items-center gap-2">{title}</h3>
          {subtitle && <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <button onClick={() => scrollBy(-600)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-white/70 hover:text-emerald-300 flex items-center justify-center transition">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button onClick={() => scrollBy(600)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-white/70 hover:text-emerald-300 flex items-center justify-center transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-[calc((100vw-260px)/2)] md:px-2 md:-mx-2"
          style={{ scrollbarWidth: "none", scrollPaddingInline: "calc((100vw - 260px) / 2)" }}
        >
          {items.map((p, idx) => (
            <NetflixCard key={p.id} p={p} rank={idx + 1} onOpen={() => onOpen(p)} />
          ))}
        </div>
        <div className="pointer-events-none hidden md:block absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none hidden md:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black to-transparent" />
      </div>

    </div>
  );
}

function NetflixCard({ p, rank, onOpen }: { p: Product; rank: number; onOpen: () => void }) {
  return (
    <div
      className="group/card relative shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/60 transition-all bg-gradient-to-b from-zinc-900 via-black to-black"
      style={{ width: 260, height: 480, boxShadow: "0 20px 50px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className="relative h-[310px] overflow-hidden bg-gradient-to-br from-zinc-950 to-black flex items-center justify-center">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="h-full w-auto max-w-full object-contain group-hover/card:scale-[1.05] transition-transform duration-700" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: CAT_GRADIENT[p.category] || "linear-gradient(135deg,#10b981,#0f766e)" }}>
            <span style={{ fontSize: 72, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>{p.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 h-6 rounded-md bg-black/80 border border-emerald-400/50 backdrop-blur-md" style={{ boxShadow: "0 0 12px rgba(16,185,129,0.35)" }}>
          <span className="font-mono text-[10px] font-black text-emerald-300 tracking-wider">#{rank.toString().padStart(2, "0")}</span>
        </div>
        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 h-6 rounded-md bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ boxShadow: "0 0 18px rgba(16,185,129,0.55)" }}>
          <TrendingUp className="w-3 h-3 text-black" />
          <span className="font-mono text-[10px] font-black text-black">+{p.growth}%</span>
        </div>
        <div className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 h-5 rounded font-mono text-[9px] font-bold backdrop-blur-md border ${
          p.competition === "BAIXA" ? "border-emerald-400/60 text-emerald-200 bg-emerald-500/30" :
          p.competition === "MÉDIA" ? "border-amber-400/60 text-amber-200 bg-amber-500/30" :
          "border-rose-400/60 text-rose-200 bg-rose-500/30"
        }`}>
          COMP {p.competition}
        </div>
      </div>


      <div className="p-3 flex flex-col gap-2 h-[160px]">
        <div className="font-bold text-white text-[13px] leading-tight line-clamp-2">{p.name}</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-emerald-300 font-black text-base">R$ {p.price.toFixed(2).replace(".", ",")}</span>
          {p.oldPrice && <span className="font-mono text-[10px] text-white/30 line-through">R$ {p.oldPrice.toFixed(0)}</span>}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
          <span className="inline-flex items-center gap-0.5"><ShoppingCart className="w-2.5 h-2.5" /> {p.sales24h > 999 ? `${(p.sales24h / 1000).toFixed(1)}k` : p.sales24h}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {p.views}M</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5 text-emerald-300/80"><Sparkles className="w-2.5 h-2.5" /> {p.conversionScore}</span>
        </div>
        <div className="flex gap-1.5 mt-auto">
          {p.affiliateUrl ? (
            <a
              href={p.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 inline-flex items-center justify-center gap-1 h-9 px-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-black text-[11px] tracking-wide transition active:scale-[0.97]"
              style={{ boxShadow: "0 0 16px rgba(16,185,129,0.35)" }}
            >
              <ExternalLink className="w-3 h-3" /> AFILIAR
            </a>
          ) : (
            <button
              onClick={onOpen}
              className="flex-1 inline-flex items-center justify-center gap-1 h-9 px-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-black text-[11px] tracking-wide transition active:scale-[0.97]"
            >
              <Eye className="w-3 h-3" /> VER
            </button>
          )}
          <button onClick={onOpen} title="Detalhes" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-emerald-300 flex items-center justify-center transition">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity" style={{ boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.4), 0 12px 40px -10px rgba(16,185,129,0.4)" }} />
    </div>
  );
}

// ───────────────────────── Live Radar Scope (SVG) ─────────────────────────
function RadarScope({ products }: { products: Product[] }) {
  const count = Math.min(products.length, 9);
  const seedIds = useMemo(() => products.slice(0, count).map((p) => p.id), [products, count]);

  const generate = () =>
    seedIds.map((id, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 70;
      return {
        id: `${id}-${i}`,
        x: 100 + Math.cos(angle) * radius,
        y: 100 + Math.sin(angle) * radius,
        delay: Math.random() * 2.4,
      };
    });

  const [blips, setBlips] = useState(generate);

  useEffect(() => {
    const timers = seedIds.map((_, i) =>
      setInterval(() => {
        setBlips((prev) => {
          const next = [...prev];
          const angle = Math.random() * Math.PI * 2;
          const radius = 18 + Math.random() * 70;
          if (!next[i]) return prev;
          next[i] = {
            ...next[i],
            x: 100 + Math.cos(angle) * radius,
            y: 100 + Math.sin(angle) * radius,
          };
          return next;
        });
      }, 2200 + Math.random() * 3800)
    );
    return () => timers.forEach(clearInterval);
  }, [seedIds]);

  return (
    <div className="relative mx-auto md:mx-0 w-[240px] h-[240px] md:w-[260px] md:h-[260px] shrink-0 flex items-center justify-center">
      <div
        className="pulse-radar"
        style={{ ['--pr-size' as any]: '100%', ['--pr-color' as any]: '#34d399' }}
      >
        {blips.map((b, i) => (
          <span
            key={b.id}
            className="pr-blip"
            style={{
              left: `${b.x / 2}%`,
              top: `${b.y / 2}%`,
              animationDelay: `${b.delay}s`,
              ['--pr-color' as any]: '#34d399',
            } as any}
          />
        ))}
      </div>
      <div className="absolute top-2 left-2 font-mono text-[9px] text-emerald-300/70 tracking-widest z-10">N · TRENDING</div>
      <div className="absolute top-2 right-2 font-mono text-[9px] text-emerald-300/70 tracking-widest z-10">LIVE</div>
      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-emerald-300/50 tracking-widest z-10">BR · TIKTOK</div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 font-mono text-[9px] text-emerald-300/70 tracking-widest z-10">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {blips.length} HITS
      </div>
    </div>
  );
}




// ───────────────────────────── component ─────────────────────────────
export default function RadarTikshop({ isDark = true }: { isDark?: boolean }) {
  const [phase, setPhase] = useState<"locked" | "scanning" | "ready">("locked");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [category, setCategory] = useState("TODOS");
  const [sort, setSort] = useState<SortKey>("position");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(timeNow());
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("radar_products")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });
      if (cancelled || !data) return;
      const baseTrend = [20, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100];
      const mapped: Product[] = (data as any[]).map((r) => ({
        id: r.id,
        position: r.position || 999,
        name: r.name,
        emoji: r.emoji || "🔥",
        category: r.category || "Moda",
        price: Number(r.price) || 0,
        oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
        sales24h: r.sales_24h || 0,
        growth: r.growth || 0,
        views: Number(r.views_millions) || 0,
        creators: r.creators || 0,
        conversionScore: r.conversion_score || 80,
        competition: (r.competition as Product["competition"]) || "MÉDIA",
        hashtag: r.hashtag || "#tiktokshop",
        hook: r.hook || "Confira esse produto que está bombando agora",
        trend: baseTrend,
        affiliateUrl: r.affiliate_url,
        imageUrl: r.image_url || undefined,
      }));
      setDbProducts(mapped);
    })();
    return () => { cancelled = true; };
  }, []);

  const startScan = () => {
    setPhase("scanning");
    setProgress(0);
    setLogs([]);
    const sequence = [
      "[INIT]  Conectando à API do TikTok Shop BR…",
      "[AUTH]  Autenticação aprovada · token v3.7",
      "[SCAN]  Indexando 2.847.391 produtos ativos",
      "[ML]    Modelo de tendência carregado",
      "[DATA]  Coletando métricas de criadores BR",
      "[FILTER] Removendo ruído (saturação > 85%)",
      "[RANK]  Calculando score de conversão",
      "[DONE]  Top 24 produtos prontos para replicar",
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < sequence.length) {
        setLogs((l) => [...l, sequence[i]]);
        setProgress(Math.round(((i + 1) / sequence.length) * 100));
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => {
          setPhase("ready");
          setUpdatedAt(timeNow());
        }, 400);
      }
    }, 320);
  };

  useEffect(() => {
    if (phase !== "ready") return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setUpdatedAt(timeNow());
    }, 3000);
    return () => clearInterval(id);
  }, [phase]);

  const products = useMemo(() => {
    const source = dbProducts.length > 0 ? dbProducts : REAL_RADAR_PRODUCTS;
    let list = category === "TODOS" ? source : source.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    // live drift
    list = list.map((p) => ({
      ...p,
      sales24h: p.sales24h + Math.floor(Math.sin(tick + p.id.length) * 14 + tick * 0.6),
      growth: Math.max(50, p.growth + Math.floor(Math.cos(tick * 0.7 + p.id.length) * 4)),
    }));
    list.sort((a, b) => {
      if (sort === "position") return (a.position || 999) - (b.position || 999);
      if (sort === "score") return b.conversionScore - a.conversionScore;
      if (sort === "sales") return b.sales24h - a.sales24h;
      if (sort === "growth") return b.growth - a.growth;
      return b.views - a.views;
    });
    return list;
  }, [category, sort, search, tick, dbProducts]);

  const totalSales = products.reduce((a, p) => a + p.sales24h, 0);
  const totalViews = products.reduce((a, p) => a + p.views, 0);
  const topGrowth = Math.max(...products.map((p) => p.growth), 0);
  const avgScore = Math.round(products.reduce((a, p) => a + p.conversionScore, 0) / Math.max(1, products.length));

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  // ╭───── LOCKED ─────╮
  if (phase === "locked") {
    return (
      <div className="relative min-h-[640px] rounded-3xl overflow-hidden border border-white/5" style={{ background: "radial-gradient(ellipse at top, #0f1e1a 0%, #050807 60%, #000 100%)" }}>
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent 60%)" }} />
        {/* scan line */}
        <div className="absolute inset-x-0 top-0 h-px bg-emerald-400/60" style={{ animation: "scanline 4s linear infinite", boxShadow: "0 0 20px #10b981" }} />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[640px] p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold mb-6 border border-emerald-400/30 bg-emerald-400/5 text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
            ACESSO RESTRITO · NÍVEL 3
          </div>
          <h1 className="font-mono text-4xl md:text-6xl font-black tracking-tighter mb-3 bg-gradient-to-b from-emerald-200 to-emerald-500 bg-clip-text text-transparent" style={{ filter: "drop-shadow(0 0 30px rgba(16,185,129,0.3))" }}>
            RADAR TIKSHOP
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-md mb-1 font-medium">
            Os produtos que estão bombando agora
          </p>
          <p className="text-emerald-100/40 text-xs md:text-sm max-w-md mb-10 font-mono">
            Vendas, score de conversão e hooks prontos pra copiar
          </p>
          <button
            onClick={startScan}
            className="group relative px-8 py-4 bg-emerald-500 text-black font-bold text-sm tracking-wide hover:bg-emerald-400 transition-all rounded-xl"
            style={{ boxShadow: "0 0 40px rgba(16,185,129,0.5), 0 20px 60px -10px rgba(16,185,129,0.4)" }}
          >
            <span className="flex items-center gap-2">
              <Unlock className="w-4 h-4" /> ABRIR O RADAR
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md w-full">
            {[
              { v: "2.8M+", l: "Produtos rastreados" },
              { v: "AO VIVO", l: "Atualização" },
              { v: "BR", l: "Mercado foco" },
            ].map((s) => (
              <div key={s.l} className="border border-emerald-400/20 rounded-xl p-3 bg-black/40 backdrop-blur-sm">
                <div className="font-mono text-emerald-300 text-base font-bold">{s.v}</div>
                <div className="text-emerald-100/40 text-[10px] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes scanline { 0% { transform: translateY(0) } 100% { transform: translateY(640px) } }`}</style>
      </div>
    );
  }

  // ╭───── SCANNING ─────╮
  if (phase === "scanning") {
    return (
      <div className="relative min-h-[640px] rounded-3xl overflow-hidden border border-white/5" style={{ background: "radial-gradient(ellipse at center, #0f1e1a 0%, #000 80%)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[640px]">
          <div className="font-mono text-emerald-400 text-[10px] mb-6 flex items-center gap-2 tracking-widest">
            <Wifi className="w-3 h-3 animate-pulse" /> CONEXÃO SEGURA · TLS 256-BIT
          </div>
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" style={{ animationDelay: "0.5s" }} />
            <Crosshair className="relative w-20 h-20 text-emerald-400 animate-spin" style={{ animationDuration: "3s", filter: "drop-shadow(0 0 20px #10b981)" }} />
          </div>
          <div className="font-mono text-emerald-300 text-5xl font-black mb-3 tabular-nums tracking-tight">{progress}<span className="text-emerald-500/60 text-2xl">%</span></div>
          <div className="w-full max-w-md h-1.5 bg-emerald-950/60 rounded-full overflow-hidden mb-8 border border-emerald-500/20">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300" style={{ width: `${progress}%`, boxShadow: "0 0 12px #10b981" }} />
          </div>
          <div className="w-full max-w-md bg-black/70 border border-emerald-500/20 rounded-xl p-4 font-mono text-[11px] text-emerald-300 space-y-1 max-h-56 overflow-hidden backdrop-blur-sm">
            {logs.map((l, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 whitespace-pre">{l}</div>
            ))}
            <div className="text-emerald-400 animate-pulse">█</div>
          </div>
        </div>
      </div>
    );
  }

  // ╭───── READY: dashboard ─────╮
  return (
    <div className="space-y-5">
      {/* ─── TICKER ─── */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 bg-black h-9">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
          AO VIVO
        </div>
        <div className="absolute inset-0 flex items-center whitespace-nowrap" style={{ animation: "ticker 60s linear infinite" }}>
          {[...products, ...products].slice(0, 20).map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 font-mono text-[11px]">
              <span className="text-emerald-100/80">{p.name}</span>
              <span className="text-emerald-400 font-bold">+{p.growth}%</span>
              <span className="text-emerald-100/30">·</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ─── HEADER + KPI ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 p-5 md:p-6" style={{ background: "linear-gradient(135deg, #0a1612 0%, #050807 100%)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 60%)" }} />

        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-5 items-center mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 font-mono text-[10px] tracking-widest text-emerald-300/70 uppercase">
              <Activity className="w-3 h-3" /> TikTok Shop · Brasil · Atualizado {updatedAt}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Radar <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">TIKSHOP</span>
            </h1>
            <p className="text-emerald-100/50 text-sm mt-1">Os {products.length} produtos com maior potencial pra você replicar agora.</p>
            <button
              onClick={startScan}
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-[11px] text-emerald-300 transition backdrop-blur-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-scan radar
            </button>
          </div>

          <RadarScope products={products} />
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShoppingCart, label: "Vendas / 24h", value: fmt(totalSales), accent: "text-emerald-300" },
            { icon: TrendingUp, label: "Maior crescimento", value: `+${topGrowth}%`, accent: "text-emerald-300" },
            { icon: Eye, label: "Views combinadas", value: `${totalViews.toFixed(0)}M`, accent: "text-emerald-300" },
            { icon: Sparkles, label: "Score médio", value: `${avgScore}/100`, accent: "text-emerald-300" },
          ].map((s) => {
            const Ic = s.icon;
            return (
              <div key={s.label} className="rounded-xl p-3 border border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{s.label}</span>
                  <Ic className="w-3.5 h-3.5 text-emerald-400/60" />
                </div>
                <div className={`font-mono font-black text-xl ${s.accent} tabular-nums`}>{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>


      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto ou categoria…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
        <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-black/40 border border-white/10">
          <Filter className="w-3.5 h-3.5 text-white/40 ml-2" />
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                sort === s.id ? "bg-emerald-500 text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          const source = dbProducts.length > 0 ? dbProducts : REAL_RADAR_PRODUCTS;
          const count = cat === "TODOS" ? source.length : source.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold transition border ${
                active
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${active ? "bg-black/10 text-black/60" : "bg-white/10 text-white/40"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ─── NETFLIX ROWS (Em alta / Por categoria) ─── */}
      {(() => {
        // Hero (top 1)
        const hero = products[0];
        // Top trending row
        const trending = products.slice(0, 12);
        const topSellers = [...products].sort((a, b) => b.sales24h - a.sales24h).slice(0, 12);
        const rowsByCat: { label: string; items: Product[] }[] = [];
        const cats = category === "TODOS"
          ? Array.from(new Set(products.map((p) => p.category)))
          : [category];
        cats.forEach((c) => {
          const items = products.filter((p) => p.category === c).slice(0, 14);
          if (items.length) rowsByCat.push({ label: c, items });
        });

        if (products.length === 0) {
          return (
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm px-5 py-12 text-center text-white/30 text-sm">
              Nenhum produto encontrado.
            </div>
          );
        }

        return (
          <div className="space-y-8">
            {/* HERO billboard */}
            {hero && category === "TODOS" && (
              <HeroCard p={hero} onOpen={() => setSelected(hero)} />
            )}

            <NetflixRow title="🔥 Em alta agora" subtitle="Ordem manual do radar, com imagem real do produto" items={trending} onOpen={setSelected} accent="emerald" />
            <NetflixRow title="🏆 Mais vendidos" subtitle="Top performers no TikTok Shop BR" items={topSellers} onOpen={setSelected} accent="emerald" />

            {rowsByCat.map((row) => (
              <NetflixRow
                key={row.label}
                title={row.label}
                subtitle={`${row.items.length} produtos rastreados`}
                items={row.items}
                onOpen={setSelected}
                accent="emerald"
              />
            ))}
          </div>
        );
      })()}

      <p className="text-[11px] text-white/30 text-center font-mono pt-2">
        Dados estimados com base em sinais públicos do TikTok Shop · uso interno
      </p>


      {/* ─── DETAIL DRAWER ─── */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md h-full overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-300"
            style={{ background: "linear-gradient(180deg, #0a1612 0%, #050807 100%)" }}
          >
            {/* header */}
            <div className="sticky top-0 z-10 backdrop-blur-md bg-black/60 border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300/70">Produto decodificado</span>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* product card */}
              <div className="flex items-start gap-3">
                <ProductThumb p={selected} size={80} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/60">{selected.category}</div>
                  <h2 className="text-lg font-bold text-white leading-tight mt-1">{selected.name}</h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-mono text-2xl font-black text-emerald-300">R$ {selected.price.toFixed(2).replace(".", ",")}</span>
                    {selected.oldPrice && (
                      <span className="font-mono text-sm text-white/30 line-through">R$ {selected.oldPrice.toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* big chart */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Tendência últimos 7 dias</span>
                  <span className="font-mono text-emerald-300 text-xs font-bold">+{selected.growth}%</span>
                </div>
                <Sparkline data={selected.trend} width={320} height={70} />
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Vendas / 24h", v: fmt(selected.sales24h), Ic: ShoppingCart },
                  { l: "Views totais", v: `${selected.views}M`, Ic: Eye },
                  { l: "Criadores ativos", v: fmt(selected.creators), Ic: Users },
                  { l: "Score conversão", v: `${selected.conversionScore}/100`, Ic: Sparkles },
                ].map((s) => {
                  const Ic = s.Ic;
                  return (
                    <div key={s.l} className="rounded-xl border border-white/5 bg-black/40 p-3">
                      <div className="flex items-center gap-1.5 text-white/40 font-mono text-[10px] uppercase tracking-wider">
                        <Ic className="w-3 h-3" /> {s.l}
                      </div>
                      <div className="text-white font-bold text-base mt-1 tabular-nums font-mono">{s.v}</div>
                    </div>
                  );
                })}
              </div>

              {/* hook */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                    <Flame className="w-3 h-3" /> Hook que está vendendo
                  </div>
                  <button onClick={() => copy(selected.hook, "Hook")} className="text-emerald-300/70 hover:text-emerald-300 transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-emerald-50 text-[15px] leading-snug font-medium">"{selected.hook}"</div>
              </div>

              {/* hashtag */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Hashtag principal</span>
                  <button onClick={() => copy(selected.hashtag, "Hashtag")} className="text-white/40 hover:text-white transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-emerald-300 font-mono font-bold text-base">{selected.hashtag}</div>
              </div>

              {/* strategy */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-300 mb-2">
                  <Sparkles className="w-3 h-3" /> Estratégia de replicação
                </div>
                <ol className="text-[13px] text-amber-50/90 space-y-1.5 list-decimal list-inside">
                  <li>Use o hook acima nos primeiros 3 segundos</li>
                  <li>Mostre o produto em uso, não estático</li>
                  <li>Termine com a hashtag principal + 4 secundárias</li>
                  <li>Poste entre 19h–22h pra pegar o pico do feed</li>
                </ol>
              </div>

              {/* cta */}
              {selected.affiliateUrl && (
                <a
                  href={selected.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-400 to-emerald-300 hover:brightness-110 text-black font-bold text-sm rounded-xl transition"
                  style={{ boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
                >
                  <ExternalLink className="w-4 h-4" /> Me afiliar a esse produto agora
                </a>
              )}
              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(selected.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-200 font-semibold text-[13px] rounded-xl transition"
              >
                <ExternalLink className="w-4 h-4" /> Ver vídeos virais deste produto
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
