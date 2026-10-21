import artefacts from "@/data/artefacts.json";

type Entry = { title: string; type: string; description: string; href: string; bytes: number };

export function artefactsFor(cloud: string, keys?: string[]): (Entry & { key: string })[] {
  const all = (artefacts.clouds as Record<string, Record<string, Entry>>)[cloud] ?? {};
  const list = keys ?? Object.keys(all);
  return list.filter((k) => all[k]).map((k) => ({ key: k, ...all[k] }));
}

const kb = (b: number) => `${Math.max(1, Math.round(b / 1024))} KB`;

export function ArtefactList({ cloud, keys }: { cloud: string; keys?: string[] }) {
  const items = artefactsFor(cloud, keys);
  if (!items.length) return null;
  return (
    <div>
      {items.map((a) => (
        <a key={a.key} href={a.href} className="artefact" download>
          <span className={`ftype ${a.type}`}>{a.type.toUpperCase()}</span>
          <span>
            <span className="a-title">{a.title}</span>
            <span className="a-desc">
              {a.description} · {kb(a.bytes)}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
