import React, { useEffect, useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';

const MyResponsiveNetwork = ({ data }) => (
  <ResponsiveNetwork
    nodes={data.nodes}
    links={data.links}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    linkDistance={e => e.distance}
    centeringStrength={0.3}
    repulsivity={6}
    nodeSize={n => n.size}
    activeNodeSize={n => 1.5 * n.size}
    nodeColor={e => e.color}
    nodeBorderWidth={1}
    nodeBorderColor={{
      from: 'color',
      modifiers: [['darker', 0.8]]
    }}
    linkThickness={n => 2 + 2 * n.target.data.height}
    linkBlendMode="multiply"
    motionConfig="wobbly" 
  />
);

export default function App() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const readCSVFile = async (filePath) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error("ERROR: file not found!");
        }
        const csvData = await response.text();
        return csvData;
      } catch (error) {
        console.error("Error reading CSV file:", error);
        return null;
      }
    };

    const convertCSVDataToGraph = (csvData) => {
      const parsedData = csvData.split('\n')
        .slice(1) 
        .map(row => {
            row = row.replace('\r', '');
            const [name, age, friend] = row.split(',');
            return { name, age, friend };
        });
  
      const nodes = [];
      const links = [];
  
      parsedData.forEach(row => {
          const sourceNode = nodes.find(node => node.id === row.name);
          const targetNode = nodes.find(node => node.id === row.friend);
  
          if (!sourceNode) nodes.push({ id: row.name });
          if (!targetNode) nodes.push({ id: row.friend });
          
          const existingLink = links.find(link => (link.source === row.Node && link.target === row.Friend) || (link.source === row.Friend && link.target === row.Node));
          if(!existingLink) links.push({ source: row.name, target: row.friend });
      });
  
      return { nodes, links };
    }

    const csvFilePath = '/data/data.csv';
    readCSVFile(csvFilePath)
      .then(csvData => {
        const graphData = convertCSVDataToGraph(csvData);
        setGraphData(graphData);
        
        console.log(graphData)
      });

  }, []); 

  if(!graphData)  console.log("NULOOO")

  return (
    <div>
      <div className="container" >
        <h1>GRAFO</h1>
        {graphData && <MyResponsiveNetwork data={graphData}/>}
      </div>
    </div>
  );
}
