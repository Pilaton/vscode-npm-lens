import prettyBytes from "pretty-bytes";

const convertSize = (size?: number) => (size ? prettyBytes(size) : "-");

export default convertSize;
