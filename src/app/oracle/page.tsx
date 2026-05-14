import { TarotGameProvider } from "@/context/tarot-game-context";
import { OracleFlow } from "@/components/OracleFlow";

export default function OraclePage() {
  return (
    <TarotGameProvider>
      <OracleFlow />
    </TarotGameProvider>
  );
}
