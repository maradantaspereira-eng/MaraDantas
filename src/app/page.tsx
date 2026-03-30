import Dashboard from "@/components/Dashboard";
import hooksData from "@/data/hooks_metadata.json";
import { Hook } from "@/components/HookCard";

export default function Home() {
  return <Dashboard hooks={hooksData as Hook[]} />;
}
