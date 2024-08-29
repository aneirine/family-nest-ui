import React, {useEffect, useRef} from 'react';
import {select} from 'd3-selection';

const treeData = [
    {
        name: "Main Node",
        partners: [
                {name: "Partner 1"},
           // {name: "Partner 2"}
        ],
        children: [
            {
                name: "Child 1",
                partners: [
                  //  {name: "Child 1 Partner"}
                   // {name: "Child 1 Partner 2"}
                ],
                children: []
            },
      //      {name: "Child 2", partners: [  /* {name: "Child 1 Partner"}*/], children: []},
          //   {name: "Child 3", partners: [], children: []},
          //  {name: "Child 3", partners: [], children: []}
        ]
    }
];


const TreeComponent = () => {
    const treeContainerRef = useRef(null);

    const processNode = (node, containerWidth = treeContainerRef.current.clientWidth,
                         containerHeight = treeContainerRef.current.clientHeight, results = [], parentX = null, parentY = null) => {

        const baseNodeSize = 50; // Base radius for calculating spacing
        const partnerSpacingX = containerWidth * 0.02; // 2% of the container width for partner spacing
        const childSpacingX = containerWidth * 0.02; // 3% of the container width for child spacing (slightly larger)
        const childYOffset = containerHeight * 0.15; // 15% of the container height
        const totalNodes = 1 + (node.partners ? node.partners.length : 0); // Main node + number of partners


        // Calculate the total width considering the radius of the nodes and the spacing between partners
        const totalWidth = totalNodes * (baseNodeSize * 2) + (totalNodes - 1) * partnerSpacingX;

        // Calculate the starting X position to center the group under the parent
        const startX = (parentX !== null ? parentX : containerWidth / 2) - (totalWidth / 2);

        const centerY = parentY !== null ? parentY + childYOffset : containerHeight / 2; // Position below the parent if parent exists


        // Place the main node
        let currentX = startX;
        results.push({
            name: node.name,
            cx: currentX + baseNodeSize, // Adjust for node size (center the node)
            cy: centerY,
            r: baseNodeSize,
            fill: '#4a90e2'  // Main node color
        });

        // Place the partners considering their radius and spacing
        if (node.partners) {
            node.partners.forEach((partner, index) => {
                currentX += (baseNodeSize * 2) + partnerSpacingX; // Move to the next position considering the radius and spacing
                results.push({
                    name: partner.name,
                    cx: currentX + baseNodeSize, // Adjust for node size (center the node)
                    cy: centerY,
                    r: baseNodeSize,
                    fill: '#50e3c2'  // Partner color
                });
            });
        }

        // If the node has children, process them recursively
        if (node.children && node.children.length > 0) {
            // Calculate the total width required for all children and their partners
            const totalChildrenWidth = node.children.reduce((width, child) => {
                const childTotalNodes = 1 + (child.partners ? child.partners.length : 0) /*+ (child.partners ? child.partners.length : 0)*/;
                return width + (childTotalNodes * (baseNodeSize * 2) + (childTotalNodes - 1) * partnerSpacingX);
            }, 0);
            console.log("totalChildrenWidth " + totalChildrenWidth);

            // Calculate the starting X position for the children group to center it under the current node
            let childStartX = startX + (totalWidth / 2) - (totalChildrenWidth / 2);

            // Process each child node
            node.children.forEach((child) => {
                const childTotalNodes = 1 + (child.partners ? child.partners.length : 0);
                const childGroupWidth = childTotalNodes * (baseNodeSize * 2) + (childTotalNodes - 1) * partnerSpacingX;

                // Center the child group within its calculated space
                const childX = childStartX + (childGroupWidth / 2) - (baseNodeSize); // Adjust for node size

                processNode(child, containerWidth, containerHeight * 1.5, results, childX, centerY);
                childStartX += childGroupWidth + childSpacingX; // Move to the next position for the next child
            });
        }

        return results;
    };


    useEffect(() => {
        const svg = select(treeContainerRef.current);

        svg.selectAll('*').remove();

        const circles = processNode(treeData[0]);


        circles.forEach(circle => {
            svg.append('circle')
                .attr('cx', circle.cx)
                .attr('cy', circle.cy)
                .attr('r', circle.r)
                .attr('fill', circle.fill);
        });
    }, []);

    return <svg ref={treeContainerRef} style={{width: "100vw", height: "100vh"}}/>;
};


export default TreeComponent;
