import runNode from "./runNode.js";

export const runWorkflow = async (workflow: any, inputData: any) => {
  const { nodes } = workflow;
  const email = workflow.email;
  let data = inputData;
  for (const node of nodes) {
    data = await runNode(node, data, email);
    console.log("executing node: ", node.type);
  }
};
