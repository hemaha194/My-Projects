import React, { useState } from 'react';
import ReactFlow, { Background, MarkerType } from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'node_vevkrnzng',type: 'input',data: { label: 'Moon' },position: { x: -67.75, y: 37.75 }},
  { id: 'node_vl63wxcvj', position: { x: -22, y: -124 }, data: { label: <div>1</div> } },
  { id: 'node_x5s51wc40', position: { x: -162.75, y:-40.75 }, data: { label: '2' } },
  { id: 'node_xzdcuxyjp', position: { x: 83.75, y:-40.25 }, data: { label: '3' } },
];

const initialEdges = [
  { id: 'node_lt4954xih', source: 'node_xzdcuxyjp', target: 'node_vevkrnzng'},
  { id: 'node_m3wnxkm6u', source: 'node_vl63wxcvj', target: 'node_x5s51wc40'},
  { id: 'node_r8gyqujc7', source: 'node_vl63wxcvj', target: 'node_xzdcuxyjp'},
];

const Calendar = () => {
  const [elements, setElements] = useState([...initialNodes, ...initialEdges]);

  const onConnect = (params) => {
    const { source, target } = params;

    // Check if the connection is from node 3 to node 5
    if (source === '3' && target === '5') {
      // Add a new node to the chart
      const newNode = {
        id: '6',
        position: { x: 150, y: 500 },
        data: { label: '6' },
      };

      // Update the elements with the new node and the connection
      setElements((prevElements) => [
        ...prevElements,
        { id: `e${source}-${target}`, source, target, animated: true, label: 'new connection' },
        newNode,
      ]);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
      nodes={initialNodes}
      edges={initialEdges} 
      fitView
      onConnect={onConnect} />
    </div>
  );
};

export default Calendar;
