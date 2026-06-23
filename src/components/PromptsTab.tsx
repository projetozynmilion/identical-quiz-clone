import { useState } from "react";
import { Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import videoGiro from "@/assets/prompt-giro-30.mp4.asset.json";
import videoCabelo from "@/assets/prompt-ajustando-cabelo.mp4.asset.json";
import videoUnboxingPacote from "@/assets/prompt-unboxing-pacote.mp4.asset.json";
import videoUnboxingBlusa from "@/assets/prompt-unboxing-blusa.mp4.asset.json";
import videoHoodieSpider from "@/assets/prompt-hoodie-spider.mp4.asset.json";
import videoHoodieCapuz from "@/assets/prompt-hoodie-capuz.mp4.asset.json";
import videoCasualTryOn from "@/assets/prompt-casual-try-on.mp4.asset.json";

interface PromptItem {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  prompt: string;
}

interface PromptCategory {
  id: string;
  label: string;
  description: string;
  items: PromptItem[];
}

const categories: PromptCategory[] = [
  {
    id: "movimentos-naturais",
    label: "Movimentos Naturais",
    description:
      "Prompts testados pra gerar vídeos UGC com movimentos humanos super naturais — gestos, respiração, micro-expressões e câmera viva.",
    items: [
      {
        id: "giro-30",
        title: "Cena 3 — Giro 30° e volta (tripé)",
        subtitle: "Mostrando o caimento",
        videoUrl: videoGiro.url,
        prompt: `🎬 CENA 3 — GIRO 30° E VOLTA (TRIPÉ)

🔹 LAYER 1
Scene Title: "Mostrando o caimento"
Style: UGC try-on, câmera fixa, sem intervenção

🔹 LAYER 2
[0:00–0:02 — Giro leve]
Visual: ela gira cerca de 30 graus mostrando lateral
Camera: fixa, não acompanha
Audio: ambiente + leve som da roupa

[0:02–0:04 — Volta de frente]
Visual: ela retorna pro enquadramento frontal
Camera: fixa
Audio: contínuo
Emotion: confiança casual

🔹 MICRO-DETAILS
corpo sai levemente do foco e volta
tecido reage ao movimento
enquadramento não "corrige" (realismo de tripé)`,
      },
      {
        id: "ajustando-cabelo",
        title: "Cena — Ajustando o cabelo",
        subtitle: "UGC try-on, tripé fixo",
        videoUrl: videoCabelo.url,
        prompt: `LAYER 1 — SCENE TITLE + STYLE

Scene Title: "Ajustando o cabelo"
Style: UGC try-on, fixed tripod camera, ultra realistic, natural indoor light, real-time motion, no slow motion, no dialogue, no speech, no talking, silent video, no subtitles, no captions, no lip sync, no voiceover, authentic unscripted behavior.`,
      },
      {
        id: "unboxing-pacote",
        title: "Unboxing — Segurando o pacote",
        subtitle: "Sorriso fechado, sem fala",
        videoUrl: videoUnboxingPacote.url,
        prompt: `Medium shot of the woman from the image looking directly into the camera. Her mouth is completely closed, wearing a bright and steady smile. She holds a gray sealed shipping package with both hands in front of her chest, tilting it slightly from side to side. No speaking, no mouth movement, pure facial expression`,
      },
      {
        id: "unboxing-blusa",
        title: "Unboxing — Abrindo o pacote (blusa)",
        subtitle: "Mostrando a blusa branca",
        videoUrl: videoUnboxingBlusa.url,
        prompt: `Medium shot of the woman from the image tearing open a gray shipping package with her hands. She reaches inside and pulls out a neat, folded white top (blusa branca) to show it to the camera. Her mouth remains completely closed, wearing an excited and bright smile throughout the action. No speaking, no mouth movement, focused on the unboxing action`,
      },
      {
        id: "hoodie-spider",
        title: "Mostrando hoodie — Spider graphic",
        subtitle: "Try-on e-commerce, fundo roxo",
        videoUrl: videoHoodieSpider.url,
        prompt: `Medium shot of the young woman from the reference video and image_56.png, holding the white hoodie by its shoulder straps with both hands. She smiles brightly at the camera and tilts the garment slightly from side to side to display the black spider graphic on the chest. She glances down at the hoodie admiringly and then back at the camera with an excited expression. The video ends with her leaning slightly forward, keeping the hoodie held in front of her. The clean, purple-lit indoor background from image_56.png is visible throughout. The video is silent and highly engaging for e-commerce.`,
      },
      {
        id: "hoodie-capuz",
        title: "Hoodie — Colocando e tirando o capuz",
        subtitle: "Gaming chair, luz roxa/rosa",
        videoUrl: videoHoodieCapuz.url,
        prompt: `Based on image_57.png, a cinematic video begins with the young woman, wearing the white spider-man themed hoodie with the hood down, seated in the gaming chair with the purple and pink ambient lighting. She looks directly at the camera and gives a gentle, sweet smile. She then gracefully uses both hands to pull the hood, which has the embroidered spider eyes, over her head and hair, settling it into place as seen in image_57.png. She holds the sides of the hood for a moment, tilting her head sweetly, and then gently uses both hands to slide the hood back off, revealing her wavy black hair and bangs again. Her sweet, charming expression and direct eye contact are maintained throughout the natural movement. The video has high resolution and flattering lighting.`,
      },
      {
        id: "casual-try-on",
        title: "Casual Try-On Pose",
        subtitle: "Authentic TikTok Shop UGC, vertical 9:16",
        videoUrl: videoCasualTryOn.url,
        prompt: `🔹 LAYER 1 — SCENE TITLE + STYLE

Scene Title: "Casual Try-On Pose"

Style: Authentic TikTok Shop UGC, vertical 9:16, tripod camera, ultra-realistic smartphone footage, natural indoor lighting from a side window, soft shadows, genuine blogger energy, self-recorded content, no cinematic acting, no exaggerated posing, no model behavior, realistic body mechanics, natural autofocus breathing, subtle camera sensor adjustments.

━━━━━━━━━━━━━━━━━━━━━━

🔹 LAYER 2 — TIMELINE

[0:00–0:01.5 — Hair Sweep]

Visual:

Standing naturally facing camera.

Right hand slowly rises toward temple.

Fingers slide through hair and gently pull a front section behind the shoulder.

One smaller strand slips free and remains beside the cheek.

Hand does not immediately drop; it continues downward naturally with residual motion.

Body Mechanics:

Weight primarily on left leg.

Right knee slightly relaxed.

Shoulders asymmetrical.

Eyes:

Maintains eye contact with lens.

Single natural blink near end of motion.

Camera:

Very subtle autofocus breathing.

Emotion:

Unconscious grooming gesture.

━━━━━━━━━━━━━━━━━━━━━━

[0:01.5–0:02.5 — Step Forward]

Visual:

Right foot moves forward one short step.

Body weight transfers gradually.

Hip follows after foot lands.

Upper torso arrives slightly later than hips.

Body Mechanics:

Shoulders lag behind lower body.

Shirt fabric reacts with slight delay.

Eyes:

Looks directly into lens.

Camera:

Autofocus shifts slightly toward face.

Emotion:

Comfortable confidence.

━━━━━━━━━━━━━━━━━━━━━━

[0:02.5–0:03.5 — Step Back]

Visual:

Right foot returns backward.

Stops slightly beyond original position.

Weight settles onto rear leg.

Shoulders relax downward.

Body Mechanics:

Small balance correction in ankle.

Natural posture recalibration.

Eyes:

Momentary glance slightly below lens.

Returns to camera.

Camera:

No reframing.

Emotion:

Unplanned adjustment.

━━━━━━━━━━━━━━━━━━━━━━

[0:03.5–0:05 — Side Turn]

Visual:

Torso initiates turn first.

Hips rotate after.

Feet follow last.

Stops in clean side profile.

Body Mechanics:

Weight settles onto right leg.

Left knee soft.

Fabric continues moving briefly after body stops.

Eyes:

Looking forward in profile.

Does not seek camera.

Hair:

Ends continue moving briefly after rotation.

Camera:

Subject drifts slightly off center.

Emotion:

Natural pause, not presenting a pose.

━━━━━━━━━━━━━━━━━━━━━━

[0:05–0:06 — Return Front]

Visual:

Torso rotates back first.

Hips follow.

Feet adjust last.

Body Mechanics:

Overshoots center slightly.

Left foot performs tiny corrective reposition.

Shoulders settle naturally afterward.

Eyes:

Reconnects with lens.

Camera:

Autofocus briefly hunts then locks again.

Emotion:

Relaxed.

━━━━━━━━━━━━━━━━━━━━━━

[0:06–0:08 — Hands On Waist Pose]

Visual:

Right arm rises first.

Hand lands on right hip.

Half-second delay.

Left arm rises afterward.

Hand lands on left hip.

Body Mechanics:

One shoulder slightly higher than the other.

Weight remains mostly on one leg.

Spine naturally curved.

Face:

Chin lowers approximately 5 degrees.

Asymmetrical smile begins from right corner of mouth.

Small cheek compression on one side.

Breathing:

Visible inhale.

Chest rises subtly.

Slow exhale.

Eyes:

Maintains eye contact.

Single irregular blink.

Emotion:

Confident but effortless.

━━━━━━━━━━━━━━━━━━━━━━

🔹 HUMAN REALISM SYSTEM

• Weight distribution remains asymmetrical throughout entire sequence.

• Every body rotation starts in torso, then hips, then feet.

• Clothing always reacts 0.2–0.5 seconds later than body movement.

• Hair maintains secondary motion after every movement.

• Natural posture imperfections preserved.

• Slight muscle tension changes visible in shoulders and neck.

• Occasional micro head tilts (2°–5°).

• Irregular blinking pattern.

• Tiny balance corrections in feet and ankles.

• Facial expressions transition gradually, never instantly.

• Hands never move symmetrically.

• Autofocus occasionally breathes or hunts.

• Subject occasionally drifts slightly off-center.

• No anticipation before movements.

• No influencer-style overacting.

• No fashion-model posing.

• No robotic symmetry.

• No perfectly timed gestures.

• Every movement flows into the next as if recorded in a single uninterrupted take.

Final Look:

Authentic TikTok Shop creator, believable human behavior, realistic body mechanics, subtle imperfections, genuine UGC energy, impossible-to-detect AI realism.`,
      },
    ],
  },
];

interface Props {
  isDark: boolean;
  C: {
    text: string;
    textMuted: string;
    surface: string;
    border: string;
    accent: string;
    bg: string;
  };
}

const PromptCard = ({
  item,
  isDark,
  C,
}: {
  item: PromptItem;
  isDark: boolean;
  C: Props["C"];
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      toast.success("Prompt copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: isDark ? "#101013" : "#ffffff",
        border: `1px solid ${C.border}`,
        boxShadow: isDark
          ? "0 24px 60px -28px rgba(0,0,0,0.8)"
          : "0 16px 40px -20px rgba(0,0,0,0.12)",
      }}
    >
      <div
        className="relative w-full bg-black"
        style={{ aspectRatio: "9 / 16", maxHeight: 520 }}
      >
        <video
          key={item.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          controls
          playsInline
          loop
          muted
          autoPlay
          preload="auto"
          crossOrigin="anonymous"
        >
          <source src={item.videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[18px] font-semibold tracking-tight" style={{ color: C.text }}>
          {item.title}
        </h3>
        <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>
          {item.subtitle}
        </p>

      <div className="mt-auto pt-6 w-full">
          <div className="btn-wrapper" style={{ display: "block", width: "100%" }}>
            <button onClick={handleCopy} className="btn" style={{ width: "100%" }}>
              {copied ? (
                <svg className="btn-svg" viewBox="0 0 24 24">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              ) : (
                <svg className="btn-svg" viewBox="0 0 24 24">
                  <path d="M19,21H8V7H19M21,7V19A2,2 0 0,1 19,21H19M21,7H19M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                </svg>
              )}
              <div className="txt-wrapper">
                <div className="txt-1">
                  {(copied ? "Copiado!" : "Copiar prompt inteiro").split("").map((char, i) =>
                    char === " " ? " " : <span key={i} className="btn-letter">{char}</span>
                  )}
                </div>
                <div className="txt-2">
                  {(copied ? "Copiado!" : "Copiar prompt inteiro").split("").map((char, i) =>
                    char === " " ? " " : <span key={i} className="btn-letter">{char}</span>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptsTab = ({ isDark, C }: Props) => {
  const [active, setActive] = useState(categories[0].id);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
          style={{ background: C.accent, color: "#fff" }}
        >
          <Wand2 className="w-3 h-3" /> BIBLIOTECA DE PROMPTS
        </div>
        <h1 className="text-[40px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
          Prompts
        </h1>
        <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
          Prompts profissionais com vídeo de exemplo. Clique em copiar, cole na sua IA e gere conteúdo UGC de outro nível.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={{
                background: isActive ? C.accent : isDark ? "#1a1a1f" : "#f4f4f6",
                color: isActive ? "#fff" : C.text,
                border: `1px solid ${isActive ? C.accent : C.border}`,
                boxShadow: isActive ? "0 8px 24px -10px rgba(255,122,0,0.55)" : "none",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="text-[13.5px] -mt-4" style={{ color: C.textMuted }}>
        <Sparkles className="inline w-3.5 h-3.5 mr-1" />
        {cat.description}
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cat.items.map((item) => (
          <PromptCard key={item.id} item={item} isDark={isDark} C={C} />
        ))}
      </div>
    </div>
  );
};

export default PromptsTab;
