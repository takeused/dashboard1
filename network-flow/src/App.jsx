// 프로젝트 태그 네트워크를 React Flow로 렌더링하는 메인 컴포넌트
import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { projects } from './projects.js';
import { computeLayout } from './layout.js';

const CAT_COLORS = { ai: '#7c3aed', data: '#0369a1', doc: '#15803d', mcp: '#b45309', util: '#525252', finance: '#0d9488' };
const CAT_LABELS = { all: '전체', ai: 'AI / LLM', data: '데이터', doc: '문서', mcp: 'MCP', util: '유틸', finance: '재테크' };

export default function App() {
  const [cat, setCat] = useState('all');
  const [sel, setSel] = useState(null);

  const items = useMemo(
    () => (cat === 'all' ? projects : projects.filter((p) => p.cat === cat)),
    [cat]
  );

  const { nodes, edges } = useMemo(() => {
    const { nodes: lay, links } = computeLayout(items);
    const rfNodes = items.map((p, i) => ({
      id: String(i),
      position: { x: lay[i].x, y: lay[i].y },
      data: { label: p.name, p },
      width: 150,
      height: 36,
      style: {
        background: CAT_COLORS[p.cat] || '#525252', color: '#fff',
        border: '1px solid #161616', borderRadius: 2,
        fontSize: 11, padding: '6px 10px', width: 150, textAlign: 'center',
      },
    }));
    const rfEdges = links.map((l, i) => ({
      id: `e${l.source}-${l.target}-${i}`,
      source: String(l.source), target: String(l.target),
      style: { stroke: '#8c8c8c', strokeWidth: Math.min(l.w * 0.8, 3), opacity: Math.min(0.2 + l.w * 0.12, 0.6) },
    }));
    return { nodes: rfNodes, edges: rfEdges };
  }, [items]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', color: '#161616' }}>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <strong style={{ fontWeight: 600 }}>프로젝트 네트워크</strong>
        <span style={{ color: '#8c8c8c', fontSize: 12 }}>React Flow · 태그 2개 이상 공유 시 연결</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#525252' }}>노드 {nodes.length} · 연결 {edges.length}</span>
      </header>

      <div style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0' }}>
        {Object.entries(CAT_LABELS).map(([k, v]) => (
          <button key={k} onClick={() => { setCat(k); setSel(null); }} style={{
            border: '1px solid ' + (k === cat ? '#161616' : '#e0e0e0'),
            background: k === cat ? '#161616' : '#fff', color: k === cat ? '#fff' : '#525252',
            padding: '4px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 2,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {k !== 'all' && <span style={{ width: 8, height: 8, background: CAT_COLORS[k], display: 'inline-block' }} />}
            {v}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ReactFlow
            nodes={nodes} edges={edges} fitView
            onNodeClick={(_, n) => setSel(n.data.p)}
            onPaneClick={() => setSel(null)}
            minZoom={0.2} maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e0e0e0" gap={20} />
            <Controls />
            <MiniMap nodeColor={(n) => n.style?.background || '#999'} pannable zoomable />
          </ReactFlow>
        </div>

        {sel && (
          <div style={{ position: 'absolute', top: 12, right: 12, width: 280, background: '#fff', border: '1px solid #e0e0e0', padding: 16, fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
            <button onClick={() => setSel(null)} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#8c8c8c' }}>×</button>
            <div style={{ fontSize: 15, marginBottom: 6 }}>{sel.name}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 8 }}>
              {sel.date} · {sel.group === 'work' ? '회사' : '집'} · {CAT_LABELS[sel.cat]} · {sel.status === 'done' ? '완료' : '진행중'}
            </div>
            <div style={{ color: '#525252', marginBottom: 8, lineHeight: 1.5 }}>{sel.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {sel.tags.map((t) => (
                <span key={t} style={{ fontSize: 11, border: '1px solid #e0e0e0', background: '#f4f4f4', color: '#525252', padding: '1px 8px' }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
