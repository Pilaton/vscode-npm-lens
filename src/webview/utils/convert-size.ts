import prettyBytes from "pretty-bytes";

const convertSize = (size: number | undefined) =>
  size ? prettyBytes(size) : "-";

export default convertSize;
