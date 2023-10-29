import Player from "@/components/Player/Player";
import List from "@/components/List/List";

export default function New() {
  return (
    <main>
      <List />
      <Player src={null} isPlaying={false} />
    </main>
  );
}
