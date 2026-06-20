// 태그 공유 그래프의 초기 좌표를 계산하는 경량 force-directed 레이아웃 (대시보드 이식)
export function computeLayout(items, W = 1200, H = 760) {
  const nodes = items.map((p, i) => {
    const a = (i / items.length) * Math.PI * 2;
    const r = 200 + (i % 3) * 60;
    return { i, x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r, vx: 0, vy: 0 };
  });

  const links = [];
  for (let a = 0; a < items.length; a++) {
    for (let b = a + 1; b < items.length; b++) {
      const ta = new Set(items[a].tags);
      const shared = items[b].tags.filter((t) => ta.has(t)).length;
      if (shared >= 2) links.push({ source: a, target: b, w: shared });
    }
  }

  const REPEL = 2200, K = 0.025, LEN = 110, CENTER = 0.006, DAMP = 0.82;
  for (let it = 0; it < 260; it++) {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const na = nodes[a], nb = nodes[b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const d2 = dx * dx + dy * dy + 1, d = Math.sqrt(d2), f = REPEL / d2;
        na.vx -= (dx / d) * f; na.vy -= (dy / d) * f;
        nb.vx += (dx / d) * f; nb.vy += (dy / d) * f;
      }
    }
    links.forEach((l) => {
      const a = nodes[l.source], b = nodes[l.target];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.1, f = (d - LEN) * K;
      a.vx += (dx / d) * f; a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
    });
    nodes.forEach((n) => {
      n.vx += (W / 2 - n.x) * CENTER; n.vy += (H / 2 - n.y) * CENTER;
      n.vx *= DAMP; n.vy *= DAMP; n.x += n.vx; n.y += n.vy;
    });
  }

  return { nodes, links };
}
