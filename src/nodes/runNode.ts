const runNode = async (node: any, inputData: any) => {
  switch (node.type) {
    case "telegramTrigger":
      return inputData;
    case "gmailNode":
      console.log(node);
      break;
    default:
      console.log("can't find this type of node", node.type);
      break;
  }
};

export default runNode;
