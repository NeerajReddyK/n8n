import runNode from "./runNode.js";

export const runWorkflow = async (workflow: any, inputData: any) => {
  const { nodes } = workflow;
  let data = inputData;
  for (const node of nodes) {
    data = await runNode(node, data);
    console.log("executing node: ", node.type);
  }
};
