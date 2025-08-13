import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const Layout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const generateEdgesWithColors = () => {
    const colors = ['#FF0072', '#00FF72', '#7200FF']; // Add more colors as needed
    const generatedEdges = [];

    for (let i = 0; i < colors.length; i++) {
      const edge = {
        id: `edge-${i}`,
        source: `node-${i}`,
        target: `node-${i + 1}`,
        animated: true,
        style: {
          stroke: colors[i],
          strokeWidth: 2,
        },
      };
      generatedEdges.push(edge);
    }

    return generatedEdges;
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((els) => addEdge(params, els));
    },
    [setEdges]
  );

  useEffect(() => {
    // Generate nodes
    const generatedNodes = Array.from({ length: 4 }, (_, i) => ({
      id: `node-${i}`,
      type: 'default',
      position: { x: i * 150, y: 0 },
      data: { label: `Node ${i}` },
    }));

    setNodes(generatedNodes);

    // Generate edges with colors
    const generatedEdges = generateEdgesWithColors();
    setEdges(generatedEdges);
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        elements={{ nodes, edges }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapToGrid
        snapGrid={[15, 15]}
        defaultZoom={1.5}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Layout;
