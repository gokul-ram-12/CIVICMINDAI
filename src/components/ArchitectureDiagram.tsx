import { useState } from 'react';
import type { ArchitectureData, ArchitectureNode } from '../types/blueprint';
import { 
  User, 
  Monitor, 
  Server, 
  Database, 
  BrainCircuit, 
  Globe, 
  ArrowRight,
  HelpCircle,
  Code
} from 'lucide-react';

interface ArchitectureDiagramProps {
  data: ArchitectureData;
}

export default function ArchitectureDiagram({ data }: ArchitectureDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeIcon = (type: ArchitectureNode['type']) => {
    const iconClass = "w-4 h-4 text-zinc-300";
    switch (type) {
      case 'user':
        return <User className={iconClass} />;
      case 'frontend':
        return <Monitor className={iconClass} />;
      case 'backend':
        return <Server className={iconClass} />;
      case 'database':
        return <Database className={iconClass} />;
      case 'ai':
        return <BrainCircuit className={iconClass} />;
      default:
        return <Globe className={iconClass} />;
    }
  };

  const getNodeColorClass = (isHovered: boolean, isConnected: boolean) => {
    if (isHovered) {
      return 'border-white bg-white/[0.08] shadow-white/5 ring-1 ring-white/10';
    } else if (isConnected) {
      return 'border-white/30 bg-white/[0.04]';
    } else {
      return 'border-white/8 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]';
    }
  };

  // Identify connected nodes for the hovered node
  const getConnectedEdges = () => {
    if (!hoveredNode) return [];
    return data.edges.filter(
      edge => edge.from === hoveredNode || edge.to === hoveredNode
    );
  };

  const connectedEdges = getConnectedEdges();
  const connectedNodeIds = new Set(
    connectedEdges.flatMap(edge => [edge.from, edge.to])
  );

  // Group nodes into logical stages for rendering columns
  const stages: { title: string; nodes: ArchitectureNode[] }[] = [
    { title: 'Clients', nodes: data.nodes.filter(n => n.type === 'user') },
    { title: 'Frontend', nodes: data.nodes.filter(n => n.type === 'frontend') },
    { title: 'Services / APIs', nodes: data.nodes.filter(n => n.type === 'backend' || n.type === 'external') },
    { title: 'Data & AI', nodes: data.nodes.filter(n => n.type === 'database' || n.type === 'ai') }
  ].filter(stage => stage.nodes.length > 0);

  if (stages.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-600 text-xs">
        Architecture diagram metadata is missing or corrupted.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Diagram Area */}
      <div className="luxury-glass p-6 relative overflow-hidden">
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="absolute top-0 right-0 p-4 flex items-center space-x-1.5 text-[9px] text-zinc-500 uppercase tracking-wider">
          <HelpCircle className="w-3 h-3 text-zinc-600" />
          <span>Hover a card to trace connections</span>
        </div>

        <h3 className="text-[10px] font-bold text-zinc-500 mb-8 uppercase tracking-widest">
          Architecture Workspace
        </h3>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {stages.map((stage, sIdx) => (
            <div key={sIdx} className="space-y-5 flex flex-col justify-start">
              {/* Stage Header */}
              <div className="text-left pb-2 border-b border-white/5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {stage.title}
                </span>
              </div>

              {/* Node Cards */}
              <div className="space-y-3">
                {stage.nodes.map(node => {
                  const isHovered = hoveredNode === node.id;
                  const isConnected = connectedNodeIds.has(node.id) && hoveredNode !== node.id;
                  
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3.5 rounded-xl border flex items-center space-x-3 cursor-pointer select-none transition-all duration-300 ${getNodeColorClass(
                        isHovered,
                        isConnected
                      )}`}
                    >
                      <div className="p-2 rounded-lg bg-black border border-white/5 shrink-0">
                        {getNodeIcon(node.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">
                          {node.label}
                        </p>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                          {node.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Flow Connection List */}
      <div className="luxury-glass p-5">
        <h4 className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest flex items-center space-x-1.5">
          <Code className="w-3.5 h-3.5 text-zinc-400" />
          <span>Pipeline Edge Connections</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.edges.map((edge, idx) => {
            const sourceNode = data.nodes.find(n => n.id === edge.from);
            const targetNode = data.nodes.find(n => n.id === edge.to);
            const isHighlighted = hoveredNode 
              ? (edge.from === hoveredNode || edge.to === hoveredNode)
              : false;

            if (!sourceNode || !targetNode) return null;

            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-[11px] flex flex-col justify-between space-y-2 transition-all duration-300 ${
                  isHighlighted 
                    ? 'border-white/40 bg-white/5 text-white' 
                    : 'border-white/5 bg-white/[0.01] text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold truncate max-w-[40%] ${isHighlighted ? 'text-white' : 'text-zinc-400'}`}>
                    {sourceNode.label}
                  </span>
                  <ArrowRight className={`w-3 h-3 shrink-0 mx-1 ${isHighlighted ? 'text-white' : 'text-zinc-700'}`} />
                  <span className={`font-semibold truncate max-w-[40%] text-right ${isHighlighted ? 'text-white' : 'text-zinc-400'}`}>
                    {targetNode.label}
                  </span>
                </div>
                {edge.label && (
                  <div className={`text-[10px] font-light border-t border-white/5 pt-1.5 ${isHighlighted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    Data: "{edge.label}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
